/**
 * Brand Brain - Ekspor (Export)
 * Format ekspor (Prompt AI, Backup JSON, Brand Guide, Konektor Funnel, Template, Brand Sheet HTML), panel Export, menu Export cepat.
 *
 * Diekstrak dari kalender_konten_planner__3_.html (bundle Vite, di-minify) lalu dirapikan dengan Prettier.
 * Nama variabel pendek (c, d, u, o, j, ...) adalah nama asli hasil minify, belum di-rename.
 *
 * Berisi: bbxH, bbxHas, bbxSecs, bbxFilled, bbxFmts, bbxL, bbxLab, bbxEsc, bbxPick, bbxNodes, bbxMd, bbxHtml, bbxGuide, bbxConn, bbxBuild, bbxPanel, bbmDate, bbmSlug, bbxMenu
 *
 * Bergantung pada simbol lain di bundle (tidak ikut file ini):
 *   G, Oa, Qb, _a, gt, jn, n, ot, ut
 */

const bbxH = (t, p, ...c) => {
  const { key, ...r } = p || {};
  c.length && (r.children = c);
  return n.jsxs(t, r, key);
};

const bbxHas = (v) =>
  v == null
    ? !1
    : typeof v == "string"
      ? v.trim().length > 0
      : Array.isArray(v)
        ? v.some(bbxHas)
        : typeof v == "object"
          ? Object.values(v).some(bbxHas)
          : !0;

const bbxSecs = [
  {
    id: "identity",
    icon: "🏛️",
    label: "Identitas & Fondasi",
    lock: !0,
    keys: [
      "name",
      "category",
      "product",
      "brandPromise",
      "mission",
      "vision",
      "values",
      "audience",
      "usp",
      "tone",
      "cta",
      "color",
      "website",
      "instagramHandle",
      "platformAccounts",
    ],
  },
  { id: "positioning", icon: "🧭", label: "Positioning", keys: ["positioning"] },
  { id: "market", icon: "⚔️", label: "Kompetitor & Pasar", keys: ["competitorContext"] },
  { id: "audience", icon: "🎯", label: "Audience DNA", keys: ["audienceDNA"] },
  { id: "offer", icon: "💎", label: "Penawaran & Konversi", keys: ["offerConversionDNA"] },
  { id: "proof", icon: "🏆", label: "Bukti & Kredibilitas", keys: ["proofCredibility"] },
  { id: "voice", icon: "🎭", label: "Karakter & Suara", keys: ["personalityVoice"] },
  { id: "visual", icon: "🎨", label: "Visual DNA", keys: ["visualDNA"] },
  { id: "content", icon: "📊", label: "Content DNA", keys: ["contentDNA"] },
  { id: "memory", icon: "🧠", label: "Brand Memory & Guardrails", keys: ["brandMemory"] },
  { id: "directives", icon: "📜", label: "Aturan Kustom AI", keys: ["customDirectives"] },
  { id: "blocks", icon: "🧩", label: "Blok Acuan Modular", keys: ["customBlocks"] },
  { id: "knowledge", icon: "📚", label: "Basis Pengetahuan Bebas", keys: ["customKnowledge"] },
  { id: "persona", icon: "🤖", label: "Persona AI", keys: ["aiPersonaInstructions"] },
];

const bbxFilled = (s, p) => s.keys.some((k) => bbxHas(p[k]));

const bbxFmts = [
  {
    id: "prompt",
    icon: "🧠",
    name: "Prompt AI",
    ext: "md",
    mime: "text/markdown;charset=utf-8",
    desc: "Teks acuan siap tempel ke Gemini / ChatGPT / Claude (sama seperti AI Inspector).",
  },
  {
    id: "json",
    icon: "🗄️",
    name: "Backup JSON",
    ext: "json",
    mime: "application/json;charset=utf-8",
    desc: "Data lengkap, bisa diimpor kembali lewat Quick Start di Brand Brain.",
  },
  {
    id: "md",
    icon: "📝",
    name: "Brand Guide",
    ext: "md",
    mime: "text/markdown;charset=utf-8",
    desc: "Dokumen Markdown yang rapi dan mudah dibaca tim atau klien.",
  },
  {
    id: "connector",
    icon: "🔌",
    name: "Konektor Funnel",
    ext: "json",
    mime: "application/json;charset=utf-8",
    desc: "Skema stabil untuk app standalone: data sumber konten per tahap funnel (TOFU sampai Retention).",
  },
  {
    id: "template",
    icon: "📋",
    name: "Template Kosong",
    ext: "json",
    mime: "application/json;charset=utf-8",
    desc: "Skema konektor tanpa isi, lengkap dengan panduan tiap field untuk acuan app lain.",
  },
  {
    id: "html",
    icon: "📄",
    name: "Brand Sheet",
    ext: "html",
    mime: "text/html;charset=utf-8",
    desc: "Halaman siap cetak. Buka lalu Print untuk jadi PDF.",
  },
];

const bbxL = {
  name: "Nama Brand",
  category: "Kategori",
  product: "Produk / Layanan",
  brandPromise: "Brand Promise",
  mission: "Misi",
  vision: "Visi",
  values: "Nilai Brand",
  audience: "Target Audiens",
  usp: "USP / Pembeda",
  tone: "Tone of Voice",
  cta: "CTA Utama",
  color: "Warna Utama",
  website: "Website",
  instagramHandle: "Instagram",
  platformAccounts: "Akun Platform",
  instagram: "Instagram",
  tiktok: "TikTok",
  threads: "Threads / X",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  facebook: "Facebook",
  weAre: "Kami adalah",
  forAudience: "Untuk",
  whoNeed: "Yang membutuhkan",
  becauseWhy: "Karena",
  unlike: "Berbeda dari",
  statement: "Positioning Statement",
  directCompetitors: "Kompetitor Langsung",
  indirectCompetitors: "Alternatif / Substitusi",
  competitorWeakness: "Kelemahan Kompetitor",
  whatWeWillNeverDo: "Tidak Akan Pernah Kami Lakukan",
  primary: "Audiens Utama",
  demographics: "Demografi",
  age: "Usia",
  gender: "Gender",
  location: "Lokasi",
  occupation: "Pekerjaan",
  lifestyle: "Gaya Hidup",
  purchasingPower: "Daya Beli",
  psychographics: "Psikografi",
  painPoints: "Pain Points",
  desires: "Keinginan",
  fears: "Ketakutan",
  objections: "Keberatan",
  contentBehavior: "Perilaku Konten",
  scrollStoppers: "Penghenti Scroll",
  commentTriggers: "Pemicu Komentar",
  purchaseTriggers: "Pemicu Pembelian",
  mainOffer: "Penawaran Utama",
  entryOffer: "Penawaran Awal",
  priceRange: "Rentang Harga",
  riskReversal: "Garansi",
  purchasePath: "Jalur Pembelian",
  hardProofPoints: "Bukti Keras",
  caseTransformations: "Studi Transformasi",
  customerVoiceRaw: "Suara Pelanggan",
  humanPersona: "Persona Manusia",
  spectrum: "Spektrum Nada",
  formality: "Kasual (0-100)",
  playfulness: "Keceriaan (0-100)",
  approach: "Kedekatan (0-100)",
  positioningTier: "Tier Positioning (0-100)",
  energy: "Keberanian (0-100)",
  voiceDo: "DO (Wajib)",
  voiceDont: "DON'T (Dilarang)",
  signatureWords: "Kata Khas",
  forbiddenWords: "Kata Terlarang",
  palette: "Palet Warna",
  secondary: "Sekunder",
  accent: "Aksen",
  background: "Latar",
  photographyStyle: "Gaya Fotografi",
  visualDoNotUse: "Visual yang Dihindari",
  pillars: "Pilar Konten",
  percentage: "Persentase",
  description: "Deskripsi",
  contentRatio: "Rasio Konten",
  awareness: "Awareness",
  education: "Edukasi",
  engagement: "Engagement",
  conversion: "Konversi",
  loyalty: "Loyalitas",
  funnelCTA: "CTA per Funnel",
  consideration: "Consideration",
  retention: "Retensi",
  alwaysSay: "Selalu Katakan",
  neverSay: "Tidak Pernah Katakan",
  signatureStories: "Cerita Khas",
  claimsGuardrail: "Pagar Klaim",
  allowed: "Diizinkan",
  forbidden: "Dilarang",
};

const bbxLab = (k, par) =>
  k === "primary" && par === "palette"
    ? "Utama"
    : bbxL[k] ||
      String(k)
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (x) => x.toUpperCase());

const bbxEsc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const bbxPick = (p, sel, o) => {
  const out = {};
  bbxSecs.forEach((s) => {
    if (!(s.lock || sel[s.id])) return;
    s.keys.forEach((k) => {
      let v = p[k];
      if (k === "customBlocks" && Array.isArray(v) && o.onlyActive)
        v = v.filter((b) => b && b.isActive !== !1);
      if (bbxHas(v)) out[k] = v;
    });
  });
  if (!out.name) out.name = p.name || "Brand";
  if (o.meta && p.fieldStatus) out.fieldStatus = p.fieldStatus;
  return out;
};

const bbxNodes = (p, sel, o) => {
  const nodes = [],
    item = (x) => {
      if (x == null || typeof x != "object") return String(x);
      const nm = x.name || x.title,
        rest = Object.entries(x)
          .filter(([k, v]) => k !== "name" && k !== "title" && bbxHas(v))
          .map(([k, v]) => bbxLab(k) + ": " + v);
      return nm ? nm + (rest.length ? " — " + rest.join(" · ") : "") : rest.join(" · ");
    };
  const walk = (v, k, d, par, top) => {
    if (!bbxHas(v)) return;
    if (k === "customBlocks") {
      v.forEach((b) => {
        if (b && bbxHas(b.content))
          nodes.push({
            t: "block",
            title: b.title || "Blok Acuan",
            cat: b.category || "",
            content: String(b.content).trim(),
          });
      });
      return;
    }
    if (k === "customKnowledge" || k === "aiPersonaInstructions") {
      nodes.push({ t: "text", x: String(v).trim() });
      return;
    }
    if (Array.isArray(v)) {
      nodes.push({ t: "ul", k: top ? "" : bbxLab(k, par), items: v.filter(bbxHas).map(item) });
      return;
    }
    if (typeof v == "object") {
      if (!top) nodes.push({ t: "sub", x: bbxLab(k, par), d });
      Object.entries(v).forEach(([a, b]) => walk(b, a, d + 1, k, !1));
      return;
    }
    nodes.push({ t: "kv", k: bbxLab(k, par), v: String(v) });
  };
  const data = bbxPick(p, sel, o);
  bbxSecs.forEach((s) => {
    const ks = s.keys.filter((k) => bbxHas(data[k]));
    if (!ks.length || !(s.lock || sel[s.id])) return;
    nodes.push({ t: "h", x: s.icon + " " + s.label });
    ks.forEach((k) => walk(data[k], k, 0, "", !s.lock));
  });
  return nodes;
};

const bbxMd = (nodes, title, meta) => {
  let o = "# " + title + "\n";
  if (meta) o += "\n> " + meta + "\n";
  nodes.forEach((x) => {
    if (x.t === "h") o += "\n## " + x.x + "\n\n";
    else if (x.t === "sub") o += "\n" + "#".repeat(Math.min(6, x.d + 3)) + " " + x.x + "\n\n";
    else if (x.t === "kv") o += "- **" + x.k + ":** " + x.v.replace(/\n+/g, " ") + "\n";
    else if (x.t === "ul") {
      if (x.k) o += "\n**" + x.k + "**\n\n";
      o += x.items.map((i) => "- " + i.replace(/\n+/g, " ")).join("\n") + "\n\n";
    } else if (x.t === "block")
      o += "\n### " + x.title + (x.cat ? " _(" + x.cat + ")_" : "") + "\n\n" + x.content + "\n";
    else if (x.t === "text") o += x.x + "\n";
  });
  return o.trim() + "\n";
};

const bbxHtml = (nodes, p, meta) => {
  const c = /^#[0-9a-f]{3,8}$/i.test(p.color || "") ? p.color : "#205c49",
    sw = (v) =>
      /^#[0-9a-f]{3,8}$/i.test(v) ? '<i class="sw" style="background:' + bbxEsc(v) + '"></i>' : "";
  let b = "",
    open = !1;
  nodes.forEach((x) => {
    if (x.t === "h") {
      if (open) b += "</section>";
      b += '<section class="card"><h2>' + bbxEsc(x.x) + "</h2>";
      open = !0;
    } else if (x.t === "sub") b += "<h3>" + bbxEsc(x.x) + "</h3>";
    else if (x.t === "kv")
      b +=
        '<div class="kv"><span>' +
        bbxEsc(x.k) +
        "</span><p>" +
        sw(x.v) +
        bbxEsc(x.v).replace(/\n/g, "<br>") +
        "</p></div>";
    else if (x.t === "ul")
      b +=
        (x.k ? '<div class="lbl">' + bbxEsc(x.k) + "</div>" : "") +
        "<ul>" +
        x.items.map((i) => "<li>" + bbxEsc(i) + "</li>").join("") +
        "</ul>";
    else if (x.t === "block")
      b +=
        '<div class="blk"><h4>' +
        bbxEsc(x.title) +
        (x.cat ? " <small>" + bbxEsc(x.cat) + "</small>" : "") +
        '</h4><div class="pre">' +
        bbxEsc(x.content) +
        "</div></div>";
    else if (x.t === "text") b += '<div class="pre">' + bbxEsc(x.x) + "</div>";
  });
  if (open) b += "</section>";
  const css =
    ":root{--c:" +
    c +
    "}*{box-sizing:border-box}body{margin:0;background:#f4f7f3;color:#142620;font:14px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}header{background:var(--c);color:#fff;padding:40px 24px}header>div{max-width:860px;margin:0 auto}.badge{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:rgba(255,255,255,.2);padding:3px 10px;border-radius:99px}h1{margin:10px 0 4px;font-size:30px}header p{margin:0;opacity:.9}main{max-width:860px;margin:0 auto;padding:24px;display:grid;gap:16px}.card{background:#fff;border:1px solid #dce4db;border-radius:16px;padding:20px 22px;break-inside:avoid-page}h2{margin:0 0 12px;font-size:15px;border-bottom:1px solid #edf1eb;padding-bottom:8px}h3{margin:16px 0 6px;font-size:13px;color:var(--c)}h4{margin:12px 0 6px;font-size:13px}h4 small{font-weight:500;color:#697c70}.kv{display:grid;grid-template-columns:190px 1fr;gap:10px;padding:5px 0;border-bottom:1px dashed #edf1eb}.kv span{font-size:12px;font-weight:700;color:#52665b}.kv p{margin:0}.lbl{font-size:12px;font-weight:700;color:#52665b;margin-top:10px}ul{margin:4px 0 8px;padding-left:20px}li{margin:2px 0}.pre{white-space:pre-wrap;background:#f8faf7;border:1px solid #e5ece3;border-radius:10px;padding:10px 12px;font-size:13px}.sw{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;vertical-align:middle;border:1px solid rgba(0,0,0,.15)}footer{max-width:860px;margin:0 auto;padding:0 24px 32px;font-size:11px;color:#697c70}@media(max-width:600px){.kv{grid-template-columns:1fr;gap:0}}@media print{body{background:#fff}header{-webkit-print-color-adjust:exact;print-color-adjust:exact}.card{border-color:#ccc}}";
  return (
    '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
    bbxEsc((p.name || "Brand") + " - Brand Brain") +
    "</title><style>" +
    css +
    '</style></head><body><header><div><span class="badge">Brand Brain</span><h1>' +
    bbxEsc(p.name || "Brand") +
    "</h1><p>" +
    bbxEsc([p.category, p.product].filter(Boolean).join(" · ")) +
    "</p></div></header><main>" +
    b +
    "</main><footer>" +
    bbxEsc(meta || "") +
    "</footer></body></html>"
  );
};

const bbxGuide = {
  "brand.name": "Nama brand persis seperti yang dipakai di semua konten.",
  "brand.category": "Kategori atau industri bisnis.",
  "brand.product": "Produk/layanan utama dalam satu kalimat.",
  "brand.promise": "Janji nyata brand: membantu [audiens] mendapat [hasil] tanpa [hambatan].",
  "brand.mission": "Misi brand (alasan brand ada).",
  "brand.vision": "Visi jangka panjang brand.",
  "brand.values": "Nilai/prinsip brand (list pendek).",
  "brand.cta_default": "CTA default bila konten tidak punya CTA khusus.",
  "brand.platforms":
    "Handle akun resmi per platform (instagram, tiktok, threads, linkedin, youtube, facebook).",
  "positioning.statement":
    "Kalimat positioning: [Brand] adalah [kategori] untuk [audiens] yang butuh [kebutuhan], karena [alasan], beda dari [alternatif].",
  "audience_profile.summary": "Ringkasan ICP (Ideal Customer Profile) dalam satu kalimat.",
  "audience_profile.demographics": "Usia, gender, lokasi, pekerjaan, gaya hidup, daya beli target.",
  "competition.weakness": "Kelemahan kompetitor/frustrasi pasar yang bisa dijadikan sudut konten.",
  "competition.never_do": "Hal yang dilakukan kompetitor tapi tidak akan pernah ditiru brand.",
  "voice.persona": "Jika brand adalah manusia, seperti apa cara bicaranya.",
  "voice.tone": "Tone of voice ringkas.",
  "voice.spectrum": "Skala 0-100 untuk casual, playful, friendly, bold.",
  "voice.do / voice.dont": "Aturan gaya bahasa yang wajib dan dilarang.",
  "voice.signature_words / voice.forbidden_words": "Kata khas brand dan kata yang dilarang muncul.",
  "visual.palette": "Warna brand (primary, secondary, accent, background) dalam hex.",
  "visual.photography_style / visual.avoid": "Gaya visual yang dipakai dan yang dihindari.",
  "guardrails.always_say / guardrails.never_say":
    "Prinsip yang selalu diulang dan kalimat yang tidak pernah dikatakan.",
  "guardrails.claims_allowed / guardrails.claims_forbidden":
    "Klaim aman vs klaim terlarang (berlaku untuk konten dan materi sales).",
  "guardrails.custom_directives":
    "Aturan tambahan khusus yang wajib dipatuhi AI saat membuat konten.",
  "guardrails.ai_persona": "Instruksi peran/persona AI saat menulis untuk brand ini.",
  "content_strategy.pillars": "Pilar konten: nama, share_pct (total idealnya 100), deskripsi.",
  "content_strategy.ratio":
    "Rasio konten per tujuan (persen): awareness, education, engagement, conversion, loyalty.",
  "content_strategy.campaigns": "Blok kampanye/event aktif (kategori Kampanye & Event).",
  "content_strategy.copy_library":
    "Koleksi copywriting yang boleh dijadikan acuan gaya (kategori Koleksi Copywriting).",
  "funnel.stages[awareness]":
    "TOFU. Bahan konten untuk audiens yang belum kenal brand. Isi pain_points, fears, scroll_stoppers, comment_triggers, signature_stories.",
  "funnel.stages[consideration]":
    "MOFU. Bahan konten untuk audiens yang membandingkan solusi. Isi desires, usp, differentiator, competitor_weakness, hard_proof_points, values.",
  "funnel.stages[conversion]":
    "BOFU. Bahan konten dan sales untuk audiens yang siap beli. Isi offer, harga, garansi, jalur beli, objections, case_transformations, customer_voice, catalog_blocks, faq_blocks.",
  "funnel.stages[retention]": "Bahan konten untuk pelanggan: customer_voice, mission, vision.",
  "funnel.stages[].cta": "CTA khusus tahap funnel tersebut.",
  "funnel.stages[].content_share_pct":
    "Porsi konten untuk tahap ini. Consideration = education + engagement, retention = loyalty.",
  "funnel.stages[].goal / audience_state / kpi_suggestions":
    "Nilai default dari sistem. Boleh diganti oleh app yang membaca.",
  "knowledge.notes": "Catatan/dokumen mentah bebas sebagai konteks tambahan.",
  "knowledge.other_blocks":
    "Blok acuan lain (SOP, aturan, riset) yang tidak masuk kategori di atas.",
};

const bbxConn = (p, blank, o) => {
  if (blank) p = {};
  o = o || {};
  const S = (v) => (v == null ? "" : String(v).trim()),
    A = (v) =>
      Array.isArray(v)
        ? v
            .filter((x) => x != null && String(x).trim() !== "")
            .map((x) => (typeof x == "string" ? x.trim() : x))
        : [],
    N = (v) => (typeof v == "number" && isFinite(v) ? v : null),
    pos = p.positioning || {},
    cc = p.competitorContext || {},
    ad = p.audienceDNA || {},
    dm = ad.demographics || {},
    ps = ad.psychographics || {},
    cb = ad.contentBehavior || {},
    of = p.offerConversionDNA || {},
    pf = p.proofCredibility || {},
    pv = p.personalityVoice || {},
    sp = pv.spectrum || {},
    vd = p.visualDNA || {},
    pal = vd.palette || {},
    cd = p.contentDNA || {},
    cr = cd.contentRatio || {},
    fc = cd.funnelCTA || {},
    bm = p.brandMemory || {},
    cg = bm.claimsGuardrail || {},
    pa = p.platformAccounts || {},
    blocks = (Array.isArray(p.customBlocks) ? p.customBlocks : [])
      .filter((b) => b && (o.onlyActive === !1 || b.isActive !== !1) && bbxHas(b.content))
      .map((b) => ({ title: S(b.title), category: S(b.category), content: S(b.content) })),
    res = [/katalog|harga/i, /faq|objection/i, /kampanye|event/i, /copywriting/i],
    cat = (i) => blocks.filter((b) => res[i].test(b.category)),
    other = blocks.filter((b) => !res.some((r) => r.test(b.category))),
    ed = N(cr.education),
    eg = N(cr.engagement),
    share = {
      awareness: N(cr.awareness),
      consideration: ed == null && eg == null ? null : (ed || 0) + (eg || 0),
      conversion: N(cr.conversion),
      retention: N(cr.loyalty),
    },
    st = (id, tag, label, goal, state, kpi, src, cta) => ({
      id,
      tag,
      label,
      goal,
      audience_state: state,
      content_share_pct: share[id],
      cta: S(cta),
      kpi_suggestions: kpi,
      source_material: src,
    });
  const out = {
    schema: "brand-brain-connector",
    schema_version: "1.0",
    source_app: "Ruang Konten",
    exported_at: blank || !o.meta ? "" : new Date().toISOString(),
    completeness_pct: blank || !o.meta ? null : Qb(p).score,
    brand: {
      name: S(p.name),
      category: S(p.category),
      product: S(p.product),
      promise: S(p.brandPromise),
      mission: S(p.mission),
      vision: S(p.vision),
      values: A(p.values),
      website: S(p.website),
      primary_color: S(p.color),
      cta_default: S(p.cta),
      platforms: {
        instagram: S(pa.instagram || p.instagramHandle),
        tiktok: S(pa.tiktok),
        threads: S(pa.threads),
        linkedin: S(pa.linkedin),
        youtube: S(pa.youtube),
        facebook: S(pa.facebook),
      },
    },
    positioning: {
      we_are: S(pos.weAre),
      for_audience: S(pos.forAudience),
      who_need: S(pos.whoNeed),
      because: S(pos.becauseWhy),
      unlike: S(pos.unlike),
      statement: S(pos.statement),
    },
    audience_profile: {
      summary: S(p.audience),
      primary: S(ad.primary),
      demographics: {
        age: S(dm.age),
        gender: S(dm.gender),
        location: S(dm.location),
        occupation: S(dm.occupation),
        lifestyle: S(dm.lifestyle),
        purchasing_power: S(dm.purchasingPower),
      },
    },
    competition: {
      direct: A(cc.directCompetitors),
      indirect: A(cc.indirectCompetitors),
      weakness: S(cc.competitorWeakness),
      never_do: A(cc.whatWeWillNeverDo),
    },
    voice: {
      persona: S(pv.humanPersona),
      tone: S(p.tone),
      spectrum: {
        casual: N(sp.formality),
        playful: N(sp.playfulness),
        friendly: N(sp.approach),
        positioning_tier: N(sp.positioningTier),
        bold: N(sp.energy),
      },
      do: A(pv.voiceDo),
      dont: A(pv.voiceDont),
      signature_words: A(pv.signatureWords),
      forbidden_words: A(pv.forbiddenWords),
    },
    visual: {
      palette: {
        primary: S(pal.primary || p.color),
        secondary: S(pal.secondary),
        accent: S(pal.accent),
        background: S(pal.background),
      },
      photography_style: A(vd.photographyStyle),
      avoid: A(vd.visualDoNotUse),
    },
    guardrails: {
      always_say: A(bm.alwaysSay),
      never_say: A(bm.neverSay),
      claims_allowed: A(cg.allowed),
      claims_forbidden: A(cg.forbidden),
      custom_directives: A(p.customDirectives),
      ai_persona: S(p.aiPersonaInstructions),
    },
    content_strategy: {
      pillars: (Array.isArray(cd.pillars) ? cd.pillars : [])
        .filter((x) => x && bbxHas(x.name))
        .map((x) => ({
          name: S(x.name),
          share_pct: N(x.percentage),
          description: S(x.description),
        })),
      ratio: {
        awareness: N(cr.awareness),
        education: ed,
        engagement: eg,
        conversion: N(cr.conversion),
        loyalty: N(cr.loyalty),
      },
      campaigns: cat(2),
      copy_library: cat(3),
    },
    funnel: {
      stages: [
        st(
          "awareness",
          "TOFU",
          "Awareness",
          "Dikenal dan menghentikan scroll audiens yang belum kenal brand.",
          "Belum kenal brand; baru sadar punya masalah (problem-aware).",
          ["reach", "views", "saves", "shares", "follower baru"],
          {
            pain_points: A(ps.painPoints),
            fears: A(ps.fears),
            scroll_stoppers: S(cb.scrollStoppers),
            comment_triggers: S(cb.commentTriggers),
            signature_stories: A(bm.signatureStories),
          },
          fc.awareness,
        ),
        st(
          "consideration",
          "MOFU",
          "Consideration",
          "Membangun kepercayaan dan membuktikan brand layak dipilih dibanding alternatif.",
          "Sudah paham masalahnya dan sedang membandingkan solusi (solution-aware).",
          ["engagement rate", "profile visit", "link click", "DM masuk", "watch time"],
          {
            desires: A(ps.desires),
            usp: S(p.usp),
            differentiator: S(pos.unlike),
            positioning_statement: S(pos.statement),
            competitor_weakness: S(cc.competitorWeakness),
            hard_proof_points: A(pf.hardProofPoints),
            values: A(p.values),
          },
          fc.consideration,
        ),
        st(
          "conversion",
          "BOFU",
          "Conversion",
          "Mengubah calon pembeli menjadi lead atau pembeli.",
          "Siap membeli tapi masih ragu atau punya keberatan (product-aware).",
          ["CTR", "lead", "checkout / penjualan", "conversion rate", "CPA"],
          {
            main_offer: S(of.mainOffer),
            entry_offer: S(of.entryOffer),
            price_range: S(of.priceRange),
            risk_reversal: S(of.riskReversal),
            purchase_path: S(of.purchasePath),
            objections: A(ps.objections),
            purchase_triggers: S(cb.purchaseTriggers),
            case_transformations: A(pf.caseTransformations),
            customer_voice: A(pf.customerVoiceRaw),
            catalog_blocks: cat(0),
            faq_blocks: cat(1),
          },
          fc.conversion || p.cta,
        ),
        st(
          "retention",
          "RETENTION",
          "Retention & Advocacy",
          "Menjaga pelanggan tetap aktif, puas, dan mau merekomendasikan.",
          "Sudah menjadi pelanggan atau pengguna.",
          ["repeat purchase", "referral", "UGC", "churn", "NPS"],
          { customer_voice: A(pf.customerVoiceRaw), mission: S(p.mission), vision: S(p.vision) },
          fc.retention,
        ),
      ],
    },
    knowledge: { notes: S(p.customKnowledge), other_blocks: other },
  };
  if (blank) {
    out.readme =
      'Template kosong skema konektor Ruang Konten. Struktur key selalu sama pada file yang berisi data, jadi app standalone bisa membaca tanpa cek key hilang. Field kosong bernilai "", [] atau null.';
    out.field_guide = bbxGuide;
  }
  return out;
};

const bbxBuild = (p, sel, o, fmt) => {
  if (fmt === "connector" || fmt === "template")
    return {
      text: JSON.stringify(bbxConn(p, fmt === "template", o), null, 2),
      ext: "json",
      mime: "application/json;charset=utf-8",
    };
  const f = bbxFmts.find((x) => x.id === fmt) || bbxFmts[0],
    d = new Date().toLocaleDateString("en-CA"),
    score = Qb(p).score,
    meta = o.meta ? "Diekspor dari Ruang Konten · " + d + " · Kelengkapan " + score + "%" : "";
  let text = "";
  if (fmt === "json") {
    const out = { type: "brand-brain-export", version: 1 };
    if (o.meta) {
      out.exportedAt = new Date().toISOString();
      out.completeness = score;
    }
    out.brand = bbxPick(p, sel, o);
    text = JSON.stringify(out, null, 2);
  } else if (fmt === "prompt") {
    const part = bbxPick(p, sel, o);
    if (Array.isArray(part.customBlocks))
      part.customBlocks = part.customBlocks.map((x) => ({ ...x, isActive: !0 }));
    text = (meta ? "[" + meta + "]\n" : "") + ot(part).trim() + "\n";
  } else {
    const nodes = bbxNodes(p, sel, o);
    text =
      fmt === "md"
        ? bbxMd(nodes, (p.name || "Brand") + " - Brand Brain", meta)
        : bbxHtml(nodes, p, meta);
  }
  return { text, ext: f.ext, mime: f.mime };
};

const bbxPanel = ({ brand: p, onNotify: j }) => {
  const h = bbxH,
    [fmt, setFmt] = G.useState("prompt"),
    [sel, setSel] = G.useState(() => {
      const o = {};
      bbxSecs.forEach((s) => {
        o[s.id] = !!s.lock || bbxFilled(s, p);
      });
      return o;
    }),
    [onlyActive, setOA] = G.useState(!0),
    [meta, setMeta] = G.useState(!0),
    [addDate, setAD] = G.useState(!0),
    [fname, setFname] = G.useState(""),
    [copied, setCopied] = G.useState(!1),
    opts = { onlyActive, meta },
    out = G.useMemo(() => bbxBuild(p, sel, opts, fmt), [p, sel, onlyActive, meta, fmt]),
    slug = (x) =>
      String(x || "")
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    base =
      slug(fname) ||
      (fmt === "template"
        ? "brand-brain-connector-template"
        : slug(p.name || "brand") + "-brand-brain" + (fmt === "connector" ? "-connector" : "")),
    file = base + (addDate ? "-" + new Date().toLocaleDateString("en-CA") : "") + "." + out.ext,
    total = bbxSecs.length,
    picked = bbxSecs.filter((s) => s.lock || sel[s.id]).length,
    words = out.text.trim().split(/\s+/).filter(Boolean).length,
    kb = (new Blob([out.text]).size / 1024).toFixed(1),
    toggle = (id) => setSel((o) => ({ ...o, [id]: !o[id] })),
    preset = (k) =>
      setSel(() => {
        const o = {};
        bbxSecs.forEach((s) => {
          o[s.id] =
            !!s.lock ||
            (k === "all"
              ? !0
              : k === "filled"
                ? bbxFilled(s, p)
                : ["positioning", "voice", "memory", "directives"].includes(s.id));
        });
        return o;
      }),
    doDownload = () => {
      gt(file, out.text, out.mime);
      j && j('File "' + file + '" berhasil diunduh.', "success");
    },
    doCopy = () => {
      Oa(out.text).then((ok) => {
        if (ok) {
          setCopied(!0);
          setTimeout(() => setCopied(!1), 2e3);
          j && j("Hasil ekspor disalin ke clipboard.", "success");
        } else j && j("Gagal menyalin. Coba unduh sebagai file.", "error");
      });
    },
    noEnter = (e) => {
      e.key === "Enter" && e.preventDefault();
    },
    cur = bbxFmts.find((x) => x.id === fmt),
    fixedSchema = fmt === "connector" || fmt === "template",
    blocksOn = sel.blocks,
    mkBtn = (cls, onClick, ic, txt) =>
      h(
        "button",
        { type: "button", onClick, className: "bbx-btn " + cls },
        ic,
        h("span", null, txt),
      );
  return h(
    "div",
    { className: "bbx" },
    h(
      "div",
      { className: "bbx-note" },
      h("span", null, "ℹ️"),
      h(
        "span",
        null,
        "Ekspor memakai isi form saat ini, termasuk perubahan yang belum kamu simpan. Pilih format, pilih bagian yang mau ikut, lalu unduh atau salin.",
      ),
    ),
    h(
      "div",
      { className: "bbx-card" },
      h(
        "div",
        { className: "bbx-h" },
        h("span", null, "1. Format Ekspor"),
        h("span", { className: "bbx-hint" }, "Pilih satu"),
      ),
      h(
        "div",
        { className: "bbx-fmts" },
        bbxFmts.map((f) =>
          h(
            "button",
            {
              key: f.id,
              type: "button",
              onClick: () => setFmt(f.id),
              className: "bbx-fmt" + (fmt === f.id ? " on" : ""),
            },
            h("b", null, f.icon + " " + f.name, h("span", { className: "bbx-ext" }, "." + f.ext)),
            h("span", null, f.desc),
          ),
        ),
      ),
    ),
    h(
      "div",
      { className: "bbx-card" + (fixedSchema ? " bbx-dim" : "") },
      h(
        "div",
        { className: "bbx-h" },
        h("span", null, "2. Bagian yang Diekspor"),
        h(
          "span",
          { className: "bbx-hint" },
          fixedSchema
            ? "Format ini selalu memuat skema lengkap"
            : picked + " dari " + total + " bagian dipilih",
        ),
      ),
      h(
        "div",
        { className: "bbx-row", style: { marginBottom: "0.75rem" } },
        h("span", { className: "bbx-hint" }, "Preset cepat:"),
        mkBtn("bbx-ghost", () => preset("filled"), null, "Hanya yang terisi"),
        mkBtn("bbx-ghost", () => preset("short"), null, "Ringkas (voice & guardrails)"),
        mkBtn("bbx-ghost", () => preset("all"), null, "Pilih semua"),
      ),
      h(
        "div",
        { className: "bbx-secs" },
        bbxSecs.map((s) => {
          const on = !!(s.lock || sel[s.id]),
            fl = bbxFilled(s, p);
          return h(
            "label",
            { key: s.id, className: "bbx-sec" + (on ? " on" : "") + (s.lock ? " lock" : "") },
            h("input", {
              type: "checkbox",
              checked: on,
              disabled: !!s.lock,
              onChange: () => toggle(s.id),
            }),
            h("span", null, s.icon),
            h("span", null, s.label + (s.lock ? " (wajib)" : "")),
            h("small", { className: fl ? "bbx-ok" : "bbx-no" }, fl ? "Terisi" : "Kosong"),
          );
        }),
      ),
    ),
    h(
      "div",
      { className: "bbx-card" },
      h("div", { className: "bbx-h" }, h("span", null, "3. Opsi & Nama File")),
      h(
        "div",
        { className: "bbx-opts" },
        h(
          "label",
          { className: "bbx-chk" },
          h("input", {
            type: "checkbox",
            checked: meta,
            onChange: (e) => setMeta(e.target.checked),
          }),
          h("span", null, "Sertakan info ekspor (tanggal & kelengkapan)"),
        ),
        h(
          "label",
          { className: "bbx-chk" + (blocksOn ? "" : " off") },
          h("input", {
            type: "checkbox",
            checked: onlyActive,
            disabled: !blocksOn,
            onChange: (e) => setOA(e.target.checked),
          }),
          h("span", null, "Blok acuan aktif saja"),
        ),
        h(
          "label",
          { className: "bbx-chk" },
          h("input", {
            type: "checkbox",
            checked: addDate,
            onChange: (e) => setAD(e.target.checked),
          }),
          h("span", null, "Tambahkan tanggal di nama file"),
        ),
      ),
      h(
        "div",
        { className: "bbx-row", style: { marginTop: "0.9rem" } },
        h("input", {
          type: "text",
          value: fname,
          onChange: (e) => setFname(e.target.value),
          onKeyDown: noEnter,
          placeholder: slug(p.name || "brand") + "-brand-brain",
          className: "bbx-input",
          style: { flex: "1 1 220px" },
        }),
        h(
          "span",
          { className: "bbx-hint" },
          "Nama file: ",
          h("b", { style: { color: "#142620" } }, file),
        ),
      ),
    ),
    h(
      "div",
      { className: "bbx-card" },
      h(
        "div",
        { className: "bbx-h" },
        h("span", null, "Pratinjau & Ekspor"),
        h(
          "span",
          { className: "bbx-hint" },
          out.text.length.toLocaleString() +
            " karakter · ~" +
            words.toLocaleString() +
            " kata · " +
            kb +
            " KB",
        ),
      ),
      h(
        "div",
        { className: "bbx-row", style: { marginBottom: "0.75rem" } },
        mkBtn(
          "bbx-primary",
          doDownload,
          h(jn, { className: "w-3.5 h-3.5" }),
          "Unduh " + cur.name + " (." + out.ext + ")",
        ),
        mkBtn(
          "bbx-ghost",
          doCopy,
          copied ? h(ut, { className: "w-3.5 h-3.5" }) : h(_a, { className: "w-3.5 h-3.5" }),
          copied ? "Tersalin!" : "Salin ke Clipboard",
        ),
      ),
      fmt === "html"
        ? h("iframe", {
            className: "bbx-frame",
            title: "Pratinjau Brand Sheet",
            sandbox: "",
            srcDoc: out.text,
          })
        : h("pre", { className: "bbx-pre" }, out.text),
    ),
  );
};

const bbmDate = () => new Date().toLocaleDateString("en-CA");

const bbmSlug = (x) =>
  String(x || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "brand";

const bbxMenu = ({ brand: p, onNotify: j, onMore }) => {
  const h = bbxH,
    [open, setOpen] = G.useState(!1),
    ref = G.useRef(null);
  G.useEffect(() => {
    if (!open) return;
    const f = (e) => {
        ref.current && !ref.current.contains(e.target) && setOpen(!1);
      },
      k = (e) => {
        e.key === "Escape" && setOpen(!1);
      };
    document.addEventListener("mousedown", f);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", f);
      document.removeEventListener("keydown", k);
    };
  }, [open]);
  const all = () => {
      const o = {};
      bbxSecs.forEach((s) => (o[s.id] = !0));
      return o;
    },
    O = { onlyActive: !0, meta: !0 },
    nm = bbmSlug(p && p.name),
    mk = (fmt) => bbxBuild(p || {}, all(), O, fmt),
    dl = (fmt) => {
      const r = mk(fmt),
        name =
          (fmt === "template"
            ? "brand-brain-connector-template"
            : nm + "-brand-brain" + (fmt === "connector" ? "-connector" : "")) +
          "-" +
          bbmDate() +
          "." +
          r.ext;
      gt(name, r.text, r.mime);
      setOpen(!1);
      j && j('"' + name + '" berhasil diunduh.', "success");
    },
    cp = (fmt) => {
      Oa(mk(fmt).text).then((ok) => {
        setOpen(!1);
        j && j(ok ? "JSON disalin ke clipboard." : "Gagal menyalin.", ok ? "success" : "error");
      });
    },
    it = (ic, t, s, on) =>
      h(
        "button",
        { type: "button", className: "bbm-it", onClick: on },
        h("span", { className: "bbm-ic" }, ic),
        h("span", { className: "bbm-tx" }, h("b", null, t), h("small", null, s)),
      );
  return h(
    "div",
    { className: "bbm", ref },
    h(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        "aria-expanded": open,
        className:
          "px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6faf4] text-[#205c49] border border-[#cfded1] text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs",
        title: "Export Brand Brain",
      },
      h(jn, { className: "w-3.5 h-3.5" }),
      h("span", null, "Export"),
      h("span", { style: { fontSize: "9px" } }, "▾"),
    ),
    open &&
      h(
        "div",
        { className: "bbm-menu" },
        h("div", { className: "bbm-g" }, "Berisi (data saat ini)"),
        it(
          "🔌",
          "Konektor Funnel (.json)",
          "Untuk app standalone, tersusun per tahap funnel.",
          () => dl("connector"),
        ),
        it("📋", "Salin Konektor Funnel", "Salin JSON berisi ke clipboard.", () => cp("connector")),
        it("🗄️", "Backup JSON (.json)", "Data lengkap, bisa diimpor kembali ke Brand Brain.", () =>
          dl("json"),
        ),
        it("🧠", "Prompt AI (.md)", "Teks acuan siap tempel ke AI.", () => dl("prompt")),
        h("div", { className: "bbm-sep" }),
        h("div", { className: "bbm-g" }, "Kosong"),
        it("📄", "Template Kosong (.json)", "Skema konektor tanpa isi + panduan tiap field.", () =>
          dl("template"),
        ),
        it("📋", "Salin Template Kosong", "Salin template ke clipboard.", () => cp("template")),
        h("div", { className: "bbm-sep" }),
        it("⚙️", "Form Export Lengkap…", "Pilih format, bagian, dan nama file.", () => {
          setOpen(!1);
          onMore && onMore();
        }),
      ),
  );
};

