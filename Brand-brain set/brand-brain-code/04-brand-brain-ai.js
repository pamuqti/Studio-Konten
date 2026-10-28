/**
 * Brand Brain - Ekstraksi AI (Gemini)
 * Ekstrak Brand Brain otomatis dari teks produk, pengembangan blok acuan via AI.
 *
 * Diekstrak dari kalender_konten_planner__3_.html (bundle Vite, di-minify) lalu dirapikan dengan Prettier.
 * Nama variabel pendek (c, d, u, o, j, ...) adalah nama asli hasil minify, belum di-rename.
 *
 * Berisi: i0, r0, Rh, u0
 *
 * Bergantung pada simbol lain di bundle (tidak ikut file ini):
 *   Sr, Vt, __splitExtract, bt, dt, ot, wn, wr
 */

async function i0(c) {
  const d = Vt(),
    u = `Anda adalah Chief Brand Strategist & Creative Director senior.
Tugas Anda adalah membaca deskripsi produk, proposal, atau ide bisnis mentah pengguna, lalu merumuskan "BRAND BRAIN" yang 70-80% terisi secara otomatis, mendalam, dan siap menjadi otak seluruh konten pemasaran berbahasa Indonesia.

Rumuskan komponen berikut:
1. Identitas Dasar: name, category, product, brandPromise, usp, tone, cta, color (hex), instagramHandle.
2. Positioning:
   - weAre: identitas & format esensial brand
   - forAudience: target spesifik
   - whoNeed: masalah/kebutuhan utama yang dihadapi
   - becauseWhy: alasan kuat harus percaya
   - unlike: perbedaannya dengan alternatif/kompetitor
   - statement: formula positioning 1 kalimat utuh
3. Audience DNA:
   - demographics: age, gender, location, occupation, lifestyle
   - psychographics: painPoints (3-4 keresahan konkret), desires (3 impian), objections (keraguan sebelum membeli)
   - contentBehavior: scrollStoppers (hook visual/teks penghenti scroll), commentTriggers (topik pemantik interaksi)
4. Personality & Voice:
   - humanPersona: personifikasi jika brand adalah seorang manusia (cth: "Teman pintar yang santai, bukan guru menggurui")
   - voiceDo: 3-4 aturan gaya bahasa yang WAJIB dipakai
   - voiceDont: 3-4 gaya bahasa yang HARAM dipakai
   - signatureWords: 4-6 kata kunci khas brand
   - forbiddenWords: 3-4 kata klise yang dilarang
5. Content DNA & Funnel CTA:
   - pillars: 4-5 pilar konten dengan estimasi persentase
   - funnelCTA: formula CTA untuk awareness, consideration, dan conversion
6. Brand Memory & Guardrails:
   - alwaysSay: 2-3 hal yang selalu ditekankan
   - neverSay: 2-3 hal yang tidak pernah dijanjikan
   - claimsGuardrail: { allowed: [...], forbidden: [...] }
7. analysisSummary: Ringkasan strategis 2 kalimat tentang positioning brand.`,
    o = `Analisis teks produk/bisnis berikut dan petakan ke BRAND BRAIN lengkap:
"""
${c.trim()}
"""`;
  const __S = {
    type: "OBJECT",
    properties: {
      name: { type: "STRING", description: "Nama brand" },
      category: { type: "STRING", description: "Kategori bisnis spesifik" },
      product: { type: "STRING", description: "Produk atau layanan utama" },
      brandPromise: { type: "STRING", description: "Janji utama brand kepada audiens" },
      audience: { type: "STRING", description: "Ringkasan target audiens" },
      usp: { type: "STRING", description: "Unique Selling Proposition" },
      tone: { type: "STRING", description: "Tone of voice brand" },
      cta: { type: "STRING", description: "Call to Action utama" },
      color: { type: "STRING", description: "Hex color code utama, diawali #" },
      instagramHandle: { type: "STRING", description: "Handle Instagram diawali @" },
      analysisSummary: { type: "STRING", description: "Ringkasan positioning dan DNA brand" },
      positioning: {
        type: "OBJECT",
        properties: {
          weAre: { type: "STRING" },
          forAudience: { type: "STRING" },
          whoNeed: { type: "STRING" },
          becauseWhy: { type: "STRING" },
          unlike: { type: "STRING" },
          statement: { type: "STRING" },
        },
      },
      audienceDNA: {
        type: "OBJECT",
        properties: {
          primary: { type: "STRING" },
          demographics: {
            type: "OBJECT",
            properties: {
              age: { type: "STRING" },
              gender: { type: "STRING" },
              location: { type: "STRING" },
              occupation: { type: "STRING" },
              lifestyle: { type: "STRING" },
            },
          },
          psychographics: {
            type: "OBJECT",
            properties: {
              painPoints: { type: "ARRAY", items: { type: "STRING" } },
              desires: { type: "ARRAY", items: { type: "STRING" } },
              objections: { type: "ARRAY", items: { type: "STRING" } },
            },
          },
          contentBehavior: {
            type: "OBJECT",
            properties: { scrollStoppers: { type: "STRING" }, commentTriggers: { type: "STRING" } },
          },
        },
      },
      personalityVoice: {
        type: "OBJECT",
        properties: {
          humanPersona: { type: "STRING" },
          voiceDo: { type: "ARRAY", items: { type: "STRING" } },
          voiceDont: { type: "ARRAY", items: { type: "STRING" } },
          signatureWords: { type: "ARRAY", items: { type: "STRING" } },
          forbiddenWords: { type: "ARRAY", items: { type: "STRING" } },
        },
      },
      competitorContext: {
        type: "OBJECT",
        properties: {
          directCompetitors: { type: "ARRAY", items: { type: "STRING" } },
          indirectCompetitors: { type: "ARRAY", items: { type: "STRING" } },
          competitorWeakness: { type: "STRING" },
          whatWeWillNeverDo: { type: "ARRAY", items: { type: "STRING" } },
        },
      },
      offerConversionDNA: {
        type: "OBJECT",
        properties: {
          mainOffer: { type: "STRING" },
          entryOffer: { type: "STRING" },
          priceRange: { type: "STRING" },
          riskReversal: { type: "STRING" },
          purchasePath: { type: "STRING" },
        },
      },
      proofCredibility: {
        type: "OBJECT",
        properties: {
          hardProofPoints: { type: "ARRAY", items: { type: "STRING" } },
          caseTransformations: { type: "ARRAY", items: { type: "STRING" } },
          customerVoiceRaw: { type: "ARRAY", items: { type: "STRING" } },
        },
      },
      visualDNA: {
        type: "OBJECT",
        properties: {
          photographyStyle: { type: "ARRAY", items: { type: "STRING" } },
          visualDoNotUse: { type: "ARRAY", items: { type: "STRING" } },
        },
      },
      contentDNA: {
        type: "OBJECT",
        properties: {
          pillars: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                percentage: { type: "NUMBER" },
                description: { type: "STRING" },
              },
            },
          },
          funnelCTA: {
            type: "OBJECT",
            properties: {
              awareness: { type: "STRING" },
              consideration: { type: "STRING" },
              conversion: { type: "STRING" },
            },
          },
        },
      },
      brandMemory: {
        type: "OBJECT",
        properties: {
          alwaysSay: { type: "ARRAY", items: { type: "STRING" } },
          neverSay: { type: "ARRAY", items: { type: "STRING" } },
          claimsGuardrail: {
            type: "OBJECT",
            properties: {
              allowed: { type: "ARRAY", items: { type: "STRING" } },
              forbidden: { type: "ARRAY", items: { type: "STRING" } },
            },
          },
        },
      },
    },
    required: [
      "name",
      "category",
      "product",
      "audience",
      "usp",
      "tone",
      "cta",
      "color",
      "analysisSummary",
    ],
  };
  return await __splitExtract(d, u, o, __S);
}

async function r0(c, d, u, o) {
  const j = Vt(),
    g = ot(o),
    p = `Anda adalah Chief Brand Strategist & Creative Director senior.
Bantu kembangkan dan sempurnakan blok acuan Brand Brain berikut untuk brand "${o?.name || "Brand"}":

Judul Blok: ${c}
Kategori: ${d}
Draf Konten Saat Ini:
"""
${u || "(Belum ada konten, buatkan yang komprehensif dari awal)"}
"""

${g}

Instruksi:
1. Buat acuan yang tajam, sangat praktis, aplikatif, dan langsung bisa dijadikan pedoman mutlak bagi tim kreatif / AI saat menulis konten.
2. Gunakan format poin-poin rapi (bullet points atau nomor) berbahasa Indonesia.
3. Hindari kalimat klise atau teori mengambang. Berikan instruksi konkret, contoh naskah, atau data terukur.
4. Output HANYA berupa teks isi blok tersebut (tanpa salam pembuka/penutup).`,
    y = await wn(j, dt, "Anda adalah Senior Brand Strategist & Content Architect.", p);
  return typeof y == "string" ? y : JSON.stringify(y, null, 2);
}

async function Rh(c) {
  if (!Sr())
    try {
      const d = await fetch("/api/ai/extract-brand", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText: c }),
        }),
        { ok: u, data: o } = await wr(d);
      if (u && d.ok && o?.name)
        return {
          brand: {
            name: o.name || "Brand Baru",
            category: o.category || "Bisnis & Produk",
            product: o.product || "",
            brandPromise: o.brandPromise || "",
            audience: o.audience || "",
            usp: o.usp || "",
            tone: o.tone || "Hangat, bersahabat, penuh keaslian, dan edukatif",
            cta: o.cta || "Hubungi kami sekarang",
            color: o.color && o.color.startsWith("#") ? o.color : "#205c49",
            instagramHandle:
              o.instagramHandle ||
              (o.name ? `@${o.name.toLowerCase().replace(/[^a-z0-9]/g, "")}` : "@brandanda"),
            positioning: o.positioning,
            audienceDNA: o.audienceDNA,
            personalityVoice: o.personalityVoice,
            contentDNA: o.contentDNA,
            brandMemory: o.brandMemory,
            fieldStatus: {
              foundation: o.brandPromise ? "ai_suggested" : "missing",
              positioning: o.positioning?.statement ? "ai_suggested" : "missing",
              audienceDNA: o.audienceDNA?.psychographics?.painPoints?.length
                ? "ai_suggested"
                : "missing",
              personalityVoice: o.personalityVoice?.humanPersona ? "ai_suggested" : "missing",
              contentDNA: o.contentDNA?.pillars?.length ? "ai_suggested" : "missing",
              brandMemory: o.brandMemory?.alwaysSay?.length ? "ai_suggested" : "missing",
            },
          },
          analysisSummary:
            o.analysisSummary ||
            "Brand Brain berhasil dianalisis dan dirumuskan dari deskripsi produk.",
        };
    } catch {}
  if (bt()) {
    const d = await i0(c);
    return {
      brand: {
        name: d.name || "Brand Baru",
        category: d.category || "Bisnis & Produk",
        product: d.product || "",
        brandPromise: d.brandPromise || "",
        audience: d.audience || "",
        usp: d.usp || "",
        tone: d.tone || "Hangat, bersahabat, penuh keaslian, dan edukatif",
        cta: d.cta || "Hubungi kami sekarang",
        color: d.color && d.color.startsWith("#") ? d.color : "#205c49",
        instagramHandle:
          d.instagramHandle ||
          (d.name ? `@${d.name.toLowerCase().replace(/[^a-z0-9]/g, "")}` : "@brandanda"),
        positioning: d.positioning,
        competitorContext: d.competitorContext,
        offerConversionDNA: d.offerConversionDNA,
        proofCredibility: d.proofCredibility,
        audienceDNA: d.audienceDNA,
        personalityVoice: d.personalityVoice,
        visualDNA: d.visualDNA,
        contentDNA: d.contentDNA,
        brandMemory: d.brandMemory,
        fieldStatus: {
          foundation: d.brandPromise ? "ai_suggested" : "missing",
          positioning: d.positioning?.statement ? "ai_suggested" : "missing",
          competitorContext: d.competitorContext?.directCompetitors?.length
            ? "ai_suggested"
            : "missing",
          audienceDNA: d.audienceDNA?.psychographics?.painPoints?.length
            ? "ai_suggested"
            : "missing",
          offerConversionDNA: d.offerConversionDNA?.mainOffer ? "ai_suggested" : "missing",
          proofCredibility: d.proofCredibility?.hardProofPoints?.length
            ? "ai_suggested"
            : "missing",
          personalityVoice: d.personalityVoice?.humanPersona ? "ai_suggested" : "missing",
          visualDNA: d.visualDNA?.photographyStyle?.length ? "ai_suggested" : "missing",
          contentDNA: d.contentDNA?.pillars?.length ? "ai_suggested" : "missing",
          brandMemory: d.brandMemory?.alwaysSay?.length ? "ai_suggested" : "missing",
        },
      },
      analysisSummary:
        d.analysisSummary ||
        "Brand Brain berhasil dianalisis dan dirumuskan dari deskripsi produk.",
    };
  }
  throw new Error("Gemini API Key belum dimasukkan. Tambahkan API Key di menu Pengaturan.");
}

async function u0(c, d, u, o) {
  return await r0(c, d, u, o);
}

