import { BrandBrain, ContentDocument, ContentItem, ContentPlanOptions, ConsultationTurn, StrategyBlueprint } from '../types';
import { compileBrandBrainPrompt } from '../utils/brandBrainExport';
import { platformsData, placementTypesData, funnelStagesData, editorialPatterns } from '../data/platforms';

const API_KEY_STORAGE_KEY = 'ruang_konten_gemini_key';
const FALLBACK_MODELS = ['gemini-3-flash-preview', 'gemini-2.5-flash'];
let activeModel = 'gemini-3-flash-preview';

export function getActiveModel(): string {
  return activeModel;
}

export function getApiKeyDetails(): {
  key: string;
  source: 'window' | 'storage' | 'env' | 'none';
  sourceDescription: string;
  isAutoInjected: boolean;
} {
  if (typeof window !== 'undefined') {
    const w = window as any;
    if (w.__GEMINI_API_KEY__ && typeof w.__GEMINI_API_KEY__ === 'string' && w.__GEMINI_API_KEY__.trim()) {
      return { key: w.__GEMINI_API_KEY__.trim(), source: 'window', sourceDescription: 'Auto-Injected (window.__GEMINI_API_KEY__)', isAutoInjected: true };
    }
    if (w.GEMINI_API_KEY && typeof w.GEMINI_API_KEY === 'string' && w.GEMINI_API_KEY.trim()) {
      return { key: w.GEMINI_API_KEY.trim(), source: 'window', sourceDescription: 'Auto-Injected (window.GEMINI_API_KEY)', isAutoInjected: true };
    }
    if (w.aistudio?.apiKey || w.aiStudio?.apiKey) {
      return { key: String(w.aistudio?.apiKey || w.aiStudio?.apiKey).trim(), source: 'window', sourceDescription: 'Google AI Studio Session', isAutoInjected: true };
    }
    try {
      const p = new URLSearchParams(window.location.search);
      const urlKey = p.get('gemini_api_key') || p.get('apiKey') || p.get('key');
      if (urlKey && urlKey.trim()) {
        return { key: urlKey.trim(), source: 'window', sourceDescription: 'URL Parameter (?apiKey=)', isAutoInjected: true };
      }
    } catch {}
    try {
      const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (stored && stored.trim()) {
        return { key: stored.trim(), source: 'storage', sourceDescription: 'Browser LocalStorage', isAutoInjected: false };
      }
    } catch {}
  }
  return { key: '', source: 'none', sourceDescription: 'Belum diatur', isAutoInjected: false };
}

export function getGeminiApiKey(): string {
  return getApiKeyDetails().key;
}

export function saveGeminiApiKey(key: string) {
  try {
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
      if (typeof window !== 'undefined') {
        (window as any).__GEMINI_API_KEY__ = key.trim();
      }
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      if (typeof window !== 'undefined') {
        (window as any).__GEMINI_API_KEY__ = '';
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gemini-api-key-changed', { detail: key.trim() }));
    }
  } catch (e) {
    console.error('Error saving API key to localStorage', e);
  }
}

export function hasActiveApiKey(): boolean {
  return Boolean(getGeminiApiKey());
}

export async function testGeminiApiKey(key: string): Promise<{ success: boolean; model: string; error?: string }> {
  if (!key || !key.trim()) {
    return { success: false, model: '', error: 'API Key kosong.' };
  }
  for (const model of FALLBACK_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key.trim()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Balas dengan kata "READY".' }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      });
      if (res.ok) {
        activeModel = model;
        return { success: true, model };
      }
      const data = await res.json().catch(() => null);
      const msg = data?.error?.message || `HTTP ${res.status}`;
      if (res.status === 400 && (msg.includes('API key not valid') || msg.includes('API_KEY_INVALID'))) {
        return { success: false, model, error: 'API Key tidak valid.' };
      }
      if (res.status === 404) continue;
      return { success: false, model, error: msg };
    } catch {}
  }
  return { success: false, model: '', error: 'Gagal terhubung ke Google Gemini API. Cek koneksi Anda.' };
}

async function callDirectGeminiApi(
  key: string,
  modelName: string,
  systemInstruction: string,
  promptText: string,
  responseSchema?: any
): Promise<any> {
  const models = [modelName || activeModel, ...FALLBACK_MODELS.filter(m => m !== (modelName || activeModel))];
  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const body: any = {
        contents: [{ role: 'user', parts: [{ text: promptText }] }]
      };
      if (systemInstruction) {
        body.systemInstruction = { parts: [{ text: systemInstruction }] };
      }
      const genConfig: any = { temperature: 0.7 };
      if (responseSchema) {
        genConfig.responseMimeType = 'application/json';
        genConfig.responseSchema = responseSchema;
      }
      body.generationConfig = genConfig;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        const errMsg = errJson?.error?.message || `HTTP ${res.status} ${res.statusText}`;
        if (res.status === 404 || errMsg.toLowerCase().includes('not found')) {
          lastError = new Error(`Gemini API (${model}): ${errMsg}`);
          continue;
        }
        throw new Error(`Gemini API Error (${model}): ${errMsg}`);
      }

      const text = (await res.json())?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error(`Respons dari Gemini (${model}) kosong.`);
      activeModel = model;
      return responseSchema ? JSON.parse(text.trim()) : text;
    } catch (e: any) {
      lastError = e;
      if (e.message && e.message.includes('404')) continue;
      throw e;
    }
  }
  throw lastError || new Error('Gagal menghubungi Gemini API dengan semua model yang tersedia.');
}

export function generateTemplatePlan(brand: BrandBrain, options: ContentPlanOptions): ContentDocument {
  const count = options.count || 30;
  const topic = options.topic || brand.product || brand.name;
  const startDateStr = options.start || new Date().toISOString().slice(0, 10);
  const startDate = new Date(`${startDateStr}T00:00:00Z`);

  const platforms = options.platform && options.platform !== "Semua Platform"
    ? [options.platform]
    : ["Instagram", "TikTok", "Threads", "LinkedIn", "YouTube", "Facebook"];

  const items: ContentItem[] = [];
  let itemCounter = 0;

  for (let day = 0; day < count; day++) {
    const curDate = new Date(startDate);
    curDate.setUTCDate(startDate.getUTCDate() + day);
    const dateFormatted = curDate.toISOString().slice(0, 10);

    platforms.forEach(platform => {
      let placementType = "Post Gambar";
      if (platform === "TikTok") placementType = "Video Pendek";
      else if (platform === "Instagram") placementType = day % 2 === 0 ? "Carousel" : "Post Gambar";
      else if (platform === "Threads") placementType = "Threads";
      else if (platform === "LinkedIn") placementType = day % 2 === 0 ? "Carousel" : "Post Gambar";
      else if (platform === "YouTube") placementType = day % 7 === 2 ? "Video Panjang" : "Video Pendek";
      else if (platform === "Facebook") placementType = "Post Gambar";

      if (options.contentTypes && options.contentTypes.length > 0 && !options.contentTypes.includes(placementType)) {
        const alt = options.contentTypes.filter(t => placementTypesData[t]?.targetPlacements.some(pl => pl.toLowerCase().includes(platform.toLowerCase())));
        if (!alt.length) return;
        placementType = alt[(day + itemCounter) % alt.length];
      }

      itemCounter++;
      const stageKeys: Array<'tofu' | 'mofu' | 'bofu' | 'ret'> = ['tofu', 'mofu', 'bofu', 'ret'];
      const stageKey = stageKeys[itemCounter % stageKeys.length];
      const stageInfo = funnelStagesData[stageKey];

      const pattern = editorialPatterns[(day + itemCounter) % editorialPatterns.length];
      const platformInfo = platformsData[platform] || platformsData.Instagram;
      const targetTime = platformInfo.defaultTimes[day % platformInfo.defaultTimes.length];

      let targetHandle = "@" + (brand.name.toLowerCase().replace(/[^a-z0-9]/g, "") || "brand");
      if (platform === "Instagram") targetHandle = brand.platformAccounts?.instagram || brand.instagramHandle || targetHandle;
      else if (platform === "TikTok") targetHandle = brand.platformAccounts?.tiktok || targetHandle;
      else if (platform === "Threads") targetHandle = brand.platformAccounts?.threads || targetHandle;
      else if (platform === "LinkedIn") targetHandle = brand.platformAccounts?.linkedin || `company/${targetHandle.replace("@", "")}`;
      else if (platform === "YouTube") targetHandle = brand.platformAccounts?.youtube || targetHandle;
      else if (platform === "Facebook") targetHandle = brand.platformAccounts?.facebook || targetHandle;

      const placementObj = placementTypesData[placementType] || placementTypesData["Post Gambar"];
      const placementsStr = placementObj.targetPlacements.join(", ");

      const hook = options.trendContext ? `[Tren: ${options.trendContext}] ${pattern.hook}` : pattern.hook;
      const angle = options.trendContext
        ? `${pattern.angle}. Mengaitkan fenomena tren "${options.trendContext}" secara cerdas ke topik ${topic} untuk ${brand.audience}.`
        : `${pattern.angle}. Relevan dengan ${topic} untuk ${brand.audience}.`;

      let caption = `${hook}?\n\nKelihatan sepele, tapi ini yang membedakan hasil biasa dengan luar biasa dalam ${topic}.\n\nDi ${brand.name}: ${brand.usp}.\n\n${brand.cta || "Tulis tanggapanmu di komentar ya!"}`;
      if (platform === "TikTok") {
        caption = `${hook}!\n\nBanyak yang skip hal krusial ini saat ngebahas ${topic}. Di ${brand.name}, kita pegang prinsip: "${brand.usp}".\n\n📌 Save video ini & ${brand.cta || "tulis pengalamanmu di kolom komentar!"}\n\n#${brand.name.toLowerCase().replace(/[^a-z0-9]/g, "")} #tips #fyp`;
      } else if (platform === "Threads") {
        caption = `[1/5] ${hook}\n\n[2/5] Kenapa ini penting? Realitanya di lapangan, ${angle.toLowerCase()}.\n\n[3/5] Di ${brand.name}, standarnya jelas: ${brand.usp}.\n\n[4/5] Gak usah overcomplicated, eksekusi konsisten selalu menang.\n\n[5/5] ${brand.cta || "Setuju atau ada sudut pandang lain?"}`;
      } else if (platform === "LinkedIn") {
        caption = `${hook}\n\nSebuah refleksi penting mengenai ${topic} bagi para profesional di industri ${brand.category || "bisnis"}.\n\nStudi kasus & pendekatan kami di ${brand.name}:\n• Pendekatan: ${angle}\n• Nilai diferensiasi: ${brand.usp}\n\nBagaimana pengalaman Anda di organisasi masing-masing? ${brand.cta || "Mari berdiskusi di kolom komentar."}`;
      }

      items.push({
        id: `item-${Date.now()}-${itemCounter}-${Math.random().toString(36).slice(2, 6)}`,
        title: `Hari ${String(day + 1).padStart(2, "0")} • [${platform} • ${placementObj.name}] ${hook}`,
        status: "draft",
        fields: {
          Tanggal: dateFormatted,
          "Jam Tayang": targetTime,
          "Tipe Placement": placementType,
          Penempatan: placementsStr,
          Platform: platform,
          "Akun Target": targetHandle,
          Format: placementObj.spec,
          Pilar: pattern.pilar,
          Hook: hook,
          "Sudut Konten": angle,
          Caption: caption,
          "Brief Visual": `${pattern.visual}. Format ${placementObj.name} khusus ${platform} dengan penempatan di [${placementsStr}]. Tone: ${brand.tone}.`,
          CTA: brand.cta || "Simpan postingan ini agar tidak lupa!",
          "Tahap Funnel": stageInfo.label,
          Checklist: "unchecked",
          "Kategori Platform": platform
        }
      });
    });
  }

  return {
    version: 1,
    id: `plan-${Date.now()}`,
    module: "plan",
    title: `Kalender Konten · ${brand.name}`,
    brand,
    options,
    source: "template",
    createdAt: new Date().toISOString(),
    items
  };
}

export async function generateContentPlanAi(brand: BrandBrain, options: ContentPlanOptions, seedItems: ContentItem[]): Promise<ContentItem[]> {
  const serverRes = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ module: 'plan', brand, options, seedItems })
  }).catch(() => null);

  if (serverRes && serverRes.ok) {
    const data = await serverRes.json().catch(() => null);
    if (data && Array.isArray(data.items)) {
      return data.items.map((it: any, idx: number) => ({
        id: seedItems[idx]?.id || `ai-${Date.now()}-${idx}`,
        title: it.title || seedItems[idx]?.title || `Item #${idx + 1}`,
        status: 'draft',
        fields: it.fields || {}
      }));
    }
  }

  const clientKey = getGeminiApiKey();
  if (!clientKey) {
    return seedItems;
  }

  const brandPrompt = compileBrandBrainPrompt(brand);
  const systemInstruction = `Anda adalah Brand Strategist & Creative Director senior berbahasa Indonesia.
Rancang konsep rencana konten harian strategis multi-pilar yang inovatif dan terukur untuk brand "${brand.name}".

${brandPrompt}

Kebutuhan:
- Topik: ${options.topic || "Perkenalan Brand & Solusi"}
- Platform: ${options.platform || "Semua Platform"}
- Tujuan: ${options.goal || "Awareness"}
${options.trendContext ? `- Kaitan Tren: "${options.trendContext}"` : ""}
${options.contentTypes?.length ? `- Tipe Konten Terpilih: ${options.contentTypes.join(", ")}` : ""}`;

  const prompt = JSON.stringify({
    expectedItemsCount: seedItems.length,
    seedItems: seedItems.map(it => ({ title: it.title, fields: it.fields }))
  });

  const schema = {
    type: "OBJECT",
    properties: {
      concepts: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            pilar: { type: "STRING" },
            hook: { type: "STRING" },
            sudutKonten: { type: "STRING" },
            briefVisual: { type: "STRING" },
            caption: { type: "STRING" },
            cta: { type: "STRING" },
            tahapFunnel: { type: "STRING" }
          },
          required: ["pilar", "hook", "sudutKonten", "briefVisual", "caption", "cta", "tahapFunnel"]
        }
      }
    },
    required: ["concepts"]
  };

  const aiResult = await callDirectGeminiApi(clientKey, activeModel, systemInstruction, prompt, schema);
  const concepts = aiResult?.concepts;
  if (!Array.isArray(concepts) || concepts.length === 0) {
    return seedItems;
  }

  return seedItems.map((item, idx) => {
    const concept = concepts[idx % concepts.length];
    const fields = { ...item.fields };
    fields.Pilar = concept.pilar || fields.Pilar || "Edukasi & Solusi";
    fields.Hook = concept.hook || fields.Hook || item.title;
    fields["Sudut Konten"] = concept.sudutKonten || fields["Sudut Konten"] || "";
    fields["Brief Visual"] = concept.briefVisual || fields["Brief Visual"] || "";
    fields.Caption = `${concept.caption}\n\n${concept.cta || brand.cta || ""}`;
    fields.CTA = concept.cta || fields.CTA || brand.cta || "";
    return {
      ...item,
      title: `${fields.Platform || "Konten"} · ${concept.hook.slice(0, 36)}...`,
      fields
    };
  });
}

export async function polishCaptionAi(caption: string, brand: BrandBrain, style?: string): Promise<Array<{ label: string; caption: string; hook: string }>> {
  const serverRes = await fetch('/api/ai/polish-caption', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caption, brand, style })
  }).catch(() => null);

  if (serverRes && serverRes.ok) {
    const data = await serverRes.json().catch(() => null);
    if (data && Array.isArray(data.variations)) {
      return data.variations;
    }
  }

  const clientKey = getGeminiApiKey();
  if (clientKey) {
    const brandPrompt = compileBrandBrainPrompt(brand);
    const system = `Anda adalah copywriter media sosial profesional. Sempurnakan caption berikut agar lebih engaging, mudah dibaca (formatting baris rapi), memiliki hook kuat, dan 100% selaras dengan acuan DNA Brand Brain.
Gaya yang diinginkan: ${style || "Storytelling & bernilai edukasi"}.
CTA brand: ${brand?.cta || "Tulis di kolom komentar"}.

${brandPrompt}`;

    const prompt = `Caption asli yang perlu disempurnakan:\n"""\n${caption}\n"""\nBerikan 3 variasi: 1. Ringkas & Punchy, 2. Storytelling & Emosional, 3. Edukatif & Berbobot.`;
    const schema = {
      type: "OBJECT",
      properties: {
        variations: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              label: { type: "STRING" },
              caption: { type: "STRING" },
              hook: { type: "STRING" }
            },
            required: ["label", "caption", "hook"]
          }
        }
      },
      required: ["variations"]
    };
    const res = await callDirectGeminiApi(clientKey, activeModel, system, prompt, schema);
    if (res?.variations && Array.isArray(res.variations)) {
      return res.variations;
    }
  }

  return [
    {
      label: "Ringkas & Punchy",
      hook: "Paling sering diskip, padahal dampaknya fatal.",
      caption: `${caption.slice(0, 150)}...\n\nEksekusi konsisten selalu menang dibanding teori.\n\n${brand.cta || "Simpan postingan ini!"}`
    },
    {
      label: "Storytelling & Emosional",
      hook: "Pernah gak sih ngerasa lelah padahal seharian sibuk?",
      caption: `Dulu kita sering terjebak di siklus yang sama: kerjaan menumpuk, energi habis, tapi hasil belum kelihatan.\n\n${caption}\n\nDi ${brand.name}, kita percaya ${brand.usp}.\n\n${brand.cta || "Bagikan ceritamu di komentar!"}`
    },
    {
      label: "Edukatif & Berbobot",
      hook: "3 Pola yang membedakan hasil biasa dengan luar biasa:",
      caption: `1. Fokus pada akar masalah, bukan gejala luar.\n2. Sederhanakan alur eksekusi setiap hari.\n3. Evaluasi berkala tanpa menunda.\n\n${caption}\n\n${brand.cta || "Bookmark untuk dibaca ulang!"}`
    }
  ];
}

export async function generateHookIdeasAi(topic: string, brand: BrandBrain): Promise<Array<{ category: string; hookText: string; explanation?: string }>> {
  const serverRes = await fetch('/api/ai/hook-ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, brand })
  }).catch(() => null);

  if (serverRes && serverRes.ok) {
    const data = await serverRes.json().catch(() => null);
    if (data && Array.isArray(data.hooks)) {
      return data.hooks;
    }
  }

  const clientKey = getGeminiApiKey();
  if (clientKey) {
    const brandPrompt = compileBrandBrainPrompt(brand);
    const system = `Buat 5 variasi hook pembuka media sosial (3 detik pertama) yang memicu rasa penasaran audiens tanpa clickbait murahan, selaras dengan DNA Brand Brain.\nTopik: ${topic || "Konten Brand"}\nBrand: ${brand.name}\n\n${brandPrompt}`;
    const schema = {
      type: "OBJECT",
      properties: {
        hooks: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              category: { type: "STRING" },
              hookText: { type: "STRING" },
              explanation: { type: "STRING" }
            },
            required: ["category", "hookText"]
          }
        }
      },
      required: ["hooks"]
    };
    const res = await callDirectGeminiApi(clientKey, activeModel, system, topic, schema);
    if (res?.hooks && Array.isArray(res.hooks)) {
      return res.hooks;
    }
  }

  return [
    { category: "Contrarian (Kontrarian)", hookText: `Kebanyakan orang salah mengira bahwa kunci ${topic || "sukses"} adalah X...`, explanation: "Mematahkan asumsi umum audiens" },
    { category: "Curiosity (Rasa Penasaran)", hookText: `Satu hal kecil yang baru saya sadari setelah bertahun-tahun di bidang ini...`, explanation: "Membuka open loop psikologis" },
    { category: "Relatable (Frustrasi Harian)", hookText: `Pernah gak sih ngerasa udah usaha keras tapi hasilnya masih stuck di situ-situ aja?`, explanation: "Memvalidasi rasa lelah target audiens" },
    { category: "Problem-Solution (Solusi Praktis)", hookText: `Stop buang waktu 3 jam sehari cuma buat hal yang sebenarnya bisa beres 10 menit!`, explanation: "Menjanjikan penghematan waktu konkret" },
    { category: "Case Study (Studi Kasus)", hookText: `Bagaimana kami mengubah kekacauan ini jadi sistem teratur dalam 7 hari:`, explanation: "Bukti nyata transformasi" }
  ];
}

export async function extractBrandBrainAi(rawText: string): Promise<{ brand: Partial<BrandBrain>; analysisSummary?: string }> {
  const serverRes = await fetch('/api/ai/extract-brand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText })
  }).catch(() => null);

  if (serverRes && serverRes.ok) {
    const data = await serverRes.json().catch(() => null);
    if (data?.brand) {
      return { brand: data.brand, analysisSummary: data.analysisSummary };
    }
  }

  const clientKey = getGeminiApiKey();
  if (clientKey) {
    const system = `Anda adalah Chief Brand Strategist & Creative Director senior.
Tugas Anda membaca deskripsi produk pengguna, lalu merumuskan BRAND BRAIN lengkap (name, category, product, brandPromise, audience, usp, tone, cta, color, positioning, audienceDNA, personalityVoice, contentDNA, brandMemory).`;
    const schema = {
      type: "OBJECT",
      properties: {
        name: { type: "STRING" },
        category: { type: "STRING" },
        industry: { type: "STRING" },
        scale: { type: "STRING" },
        scaleLabel: { type: "STRING" },
        product: { type: "STRING" },
        brandPromise: { type: "STRING" },
        audience: { type: "STRING" },
        usp: { type: "STRING" },
        tone: { type: "STRING" },
        cta: { type: "STRING" },
        color: { type: "STRING" },
        instagramHandle: { type: "STRING" },
        analysisSummary: { type: "STRING" },
        positioning: {
          type: "OBJECT",
          properties: {
            weAre: { type: "STRING" },
            forAudience: { type: "STRING" },
            whoNeed: { type: "STRING" },
            becauseWhy: { type: "STRING" },
            unlike: { type: "STRING" },
            statement: { type: "STRING" }
          }
        }
      },
      required: ["name", "category", "product", "audience", "usp", "tone", "cta", "color", "analysisSummary"]
    };
    const res = await callDirectGeminiApi(clientKey, activeModel, system, rawText, schema);
    if (res) {
      return { brand: res, analysisSummary: res.analysisSummary };
    }
  }

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || "Brand Baru";
  return {
    brand: {
      name: firstLine.slice(0, 30),
      category: "Bisnis & Produk",
      industry: "Bisnis & Komersial",
      scale: "smb",
      scaleLabel: "UMKM Berkembang",
      product: rawText.slice(0, 150),
      audience: "Target pasar dan konsumen Indonesia",
      usp: "Kualitas terpercaya tanpa kompromi",
      tone: "Hangat, bersahabat, dan edukatif",
      cta: "Hubungi kami via link bio",
      color: "#205c49",
      instagramHandle: `@${firstLine.toLowerCase().replace(/[^a-z0-9]/g, "") || "brand"}`
    },
    analysisSummary: "Profil brand berhasil disaring dari deskripsi awal."
  };
}

export async function generateTrendBridgeAi(trendName: string, topic: string, brand: BrandBrain) {
  const clientKey = getGeminiApiKey();
  if (clientKey) {
    const brandPrompt = compileBrandBrainPrompt(brand);
    const system = `Anda adalah Brand Strategist & Viral Trend Analyst berpengalaman.
Kaitkan tren "${trendName}" dengan brand ${brand.name} menggunakan teknik "Trend Hijacking" yang cerdas dan tidak cringe.\n\n${brandPrompt}`;
    const schema = {
      type: "OBJECT",
      properties: {
        trendSummary: { type: "STRING" },
        bridgeAngle: { type: "STRING" },
        hooks: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              category: { type: "STRING" },
              hookText: { type: "STRING" },
              explanation: { type: "STRING" }
            },
            required: ["category", "hookText"]
          }
        },
        caption: { type: "STRING" },
        visualDirection: { type: "STRING" },
        suggestedPlacement: { type: "STRING" }
      },
      required: ["trendSummary", "bridgeAngle", "hooks", "caption", "visualDirection", "suggestedPlacement"]
    };
    const res = await callDirectGeminiApi(clientKey, activeModel, system, `Topik: ${topic}\nTren: ${trendName}`, schema);
    if (res) return res;
  }

  return {
    trendSummary: `Tren "${trendName}" mencerminkan keresahan spontan audiens mengenai realitas yang tidak sesuai ekspektasi.`,
    bridgeAngle: `Menghubungkan humor tren "${trendName}" dengan pentingnya memiliki sistem kerja nyata bersama ${brand.name}.`,
    hooks: [
      { category: "Relatable / POV", hookText: `POV: Kamu ikut tren ${trendName} tapi deadline kerjaan tetap belum beres...`, explanation: "Mengaitkan tren dengan realitas kerja" },
      { category: "Kontrarian", hookText: `Unpopular opinion soal tren ${trendName}: Masalah aslinya bukan di situ, tapi di...`, explanation: "Memberi perspektif kritis yang segar" },
      { category: "Edukasi Cepat", hookText: `3 Hal yang bisa kita pelajari dari fenomena ${trendName} untuk hidup lebih teratur:`, explanation: "Mengubah lelucon menjadi pelajaran praktis" }
    ],
    caption: `Tren ${trendName} emang bikin senyum, tapi kalau dipikir-pikir ada benarnya juga.\n\nDaripada overthinking, di ${brand.name} kita fokus ke ${brand.usp}.\n\n${brand.cta || "Cek link bio sekarang!"}`,
    visualDirection: "Video 9:16 vertikal dengan ekspresi spontan dan transisi dinamis.",
    suggestedPlacement: "Video Pendek (TikTok & Reels)"
  };
}

export async function consultContentStrategistAi(
  userReply: string,
  history: ConsultationTurn[],
  moduleType: string,
  brand: BrandBrain,
  dayCount: number = 7
): Promise<{
  aiReply: string;
  quickOptions?: string[];
  blueprint?: StrategyBlueprint;
  maturityScore: number;
  isReadyToExecute: boolean;
}> {
  const turnIndex = history.filter(h => h.sender === 'user').length + 1;
  const clientKey = getGeminiApiKey();

  if (clientKey) {
    try {
      const brandPrompt = compileBrandBrainPrompt(brand);
      const system = `Anda adalah Senior Content Strategist & Creative Director di Ruang Konten.
Tugas Anda memandu maksud pengguna sebelum menyusun rencana kalender konten ${dayCount} hari untuk brand "${brand.name}".
Gaya bicara: Ringkas, strategis, hangat, to-the-point, dan berorientasi hasil.

${brandPrompt}

Aturan:
- Apresiasi ide pengguna dan berikan sudut pandang strategis.
- Tanyakan 1 pertanyaan penegas untuk memperjelas target atau pilar.
- Sertakan opsi pilihan cepat dalam format: [OPSI: Pilihan 1 | Pilihan 2 | Pilihan 3]`;

      const histText = history.map(h => `${h.sender === 'user' ? 'Pengguna' : 'Strategist'}: ${h.text}`).join('\n');
      const prompt = `Konteks: Rencana ${dayCount} hari untuk ${brand.name}\nRiwayat:\n${histText}\nPengguna: ${userReply}\n\nBerikan arahan strategis berikutnya:`;

      const aiText = await callDirectGeminiApi(clientKey, activeModel, system, prompt);
      if (typeof aiText === 'string') {
        let cleanText = aiText;
        let options: string[] | undefined;
        const optMatch = aiText.match(/\[OPSI:\s*([^\]]+)\]/i);
        if (optMatch) {
          options = optMatch[1].split('|').map(o => o.trim()).filter(Boolean);
          cleanText = aiText.replace(optMatch[0], '').trim();
        }
        const score = Math.min(100, turnIndex * 35);
        const ready = turnIndex >= 2;
        const bp: StrategyBlueprint | undefined = ready ? {
          coreAngle: `Fokus solusi nyata ${brand.product} dengan keunggulan ${brand.usp}`,
          targetAudienceRefined: brand.audience,
          recommendedPillars: ["Edukasi & Masalah", "Kisah di Balik Layar", "Solusi & Bukti", "Konversi"],
          suggestedTone: brand.tone,
          suggestedCta: brand.cta,
          summary: `Rencana konten ${dayCount} hari terarah berdasarkan konsultasi: ${userReply}`
        } : undefined;

        return {
          aiReply: cleanText,
          quickOptions: options,
          blueprint: bp,
          maturityScore: score,
          isReadyToExecute: ready
        };
      }
    } catch (e) {
      console.warn("Direct strategist consultation fallback to rule-based:", e);
    }
  }

  if (turnIndex === 1) {
    return {
      aiReply: `Ide yang sangat potensial untuk menyusun rencana **${dayCount} hari kalender konten** bagi **${brand.name}**! Untuk memastikan alokasi konten berimbang dan terarah, mari kita tajamkan arahnya.\n\nApa **fokus objektif utama** yang ingin Anda capai melalui kampanye ini?`,
      quickOptions: ["🎯 Edukasi Otoritas & Solusi Masalah", "🛍️ Pameran Fitur & Penjualan Cepat", "🔥 Bangun Hubungan & Interaksi Audiens", "⭐ Bukti Sosial / Testimoni Nyata"],
      maturityScore: 40,
      isReadyToExecute: false
    };
  } else if (turnIndex === 2) {
    return {
      aiReply: `Sip, fokusnya sudah sangat jelas: *"Langkah terarah untuk ${userReply.replace(/^[🎯🛍️🔥⭐]\s*/, "")}"*.\n\nUntuk skala **${dayCount} hari**, kita akan membagi pilar konten secara proporsional. Satu hal terakhir agar naskah dan alurnya pas: **Gaya bahasa (Tone of Voice)** seperti apa yang paling nyaman untuk audiens Anda?`,
      quickOptions: ["✨ Santai, gaul, dan penuh analogi relatable", "💼 Profesional, edukatif, dan to-the-point", "💡 Hangat, empatis, dan seperti curhat teman", "⚡ Berani, tegas, dan membongkar mitos lama"],
      maturityScore: 75,
      isReadyToExecute: true,
      blueprint: {
        coreAngle: `Menyoroti ${brand.product} dengan fokus: ${userReply}`,
        targetAudienceRefined: brand.audience,
        recommendedPillars: ["Edukasi Solutif", "Validasi Frustrasi", "Demonstrasi Nilai", "Call To Action"],
        suggestedTone: brand.tone,
        suggestedCta: brand.cta,
        summary: `Strategi ${dayCount} hari terfokus pada ${userReply} untuk audiens ${brand.audience}.`
      }
    };
  } else {
    return {
      aiReply: `Sempurna! Semua informasi strategis untuk rencana **${dayCount} hari** sudah terkunci rapi:\n\n• **Skala:** ${dayCount} Hari Rilis\n• **Objektif:** Terarah pada konversi & edukasi\n• **Gaya Bahasa:** ${userReply}\n• **DNA Brand:** Mengedepankan *${brand.usp}*\n\nBlueprint strategi di bawah ini sudah siap dieksekusi menjadi kalender konten nyata!`,
      maturityScore: 100,
      isReadyToExecute: true,
      blueprint: {
        coreAngle: `Transformasi nyata bersama ${brand.name}: ${brand.usp}`,
        targetAudienceRefined: brand.audience,
        recommendedPillars: ["Edukasi & Insight", "Storytelling Masalah", "Pembeda Brand", "Ajakan Bertindak"],
        suggestedTone: userReply || brand.tone,
        suggestedCta: brand.cta,
        summary: `Eksekusi rencana ${dayCount} hari untuk ${brand.name}.`
      }
    };
  }
}
