import { BrandBrain, CustomKnowledgeBlock } from '../types';

export function compileBrandBrainPrompt(c: BrandBrain): string {
  if (!c) return "";
  let d = `\n=== BRAND BRAIN: SATU SUMBER KEBENARAN STRATEGIS ===\n`;
  d += `NAMA BRAND: ${c.name || "Brand"}\n`;
  d += `KATEGORI: ${c.category || "Bisnis & Produk"}\n`;
  d += `PRODUK / LAYANAN: ${c.product || "-"}\n`;
  if (c.brandPromise) d += `BRAND PROMISE: ${c.brandPromise}\n`;
  d += `USP / PEMBEDA UTAMA: ${c.usp || "-"}\n`;
  d += `CTA DEFAULT: ${c.cta || "-"}\n`;

  if (c.platformAccounts) {
    const u = c.platformAccounts;
    const o = [
      u.instagram && `Instagram: ${u.instagram}`,
      u.tiktok && `TikTok: ${u.tiktok}`,
      u.threads && `Threads / X: ${u.threads}`,
      u.linkedin && `LinkedIn: ${u.linkedin}`,
      u.youtube && `YouTube: ${u.youtube}`,
      u.facebook && `Facebook: ${u.facebook}`
    ].filter(Boolean);
    if (o.length > 0) {
      d += `\n[AKUN PLATFORM RESMI]\n- ${o.join("\n- ")}\n`;
    }
  }

  if (c.positioning) {
    const u = c.positioning;
    d += `\n[POSITIONING BRAND]\n`;
    if (u.statement) d += `- Positioning Statement: "${u.statement}"\n`;
    if (u.weAre) d += `- Siapa Sebenarnya: ${u.weAre}\n`;
    if (u.forAudience) d += `- Target Utama: ${u.forAudience}\n`;
    if (u.whoNeed) d += `- Kebutuhan Utama: ${u.whoNeed}\n`;
    if (u.becauseWhy) d += `- Alasan Percaya: ${u.becauseWhy}\n`;
    if (u.unlike) d += `- Perbedaan dari Alternatif Lain: ${u.unlike}\n`;
  }

  if (c.competitorContext) {
    const u = c.competitorContext;
    d += `\n[FAKTA KOMPETISI & CELAH PASAR]\n`;
    if (u.directCompetitors?.length) d += `- Kompetitor Utama di Lapangan: ${u.directCompetitors.join(", ")}\n`;
    if (u.indirectCompetitors?.length) d += `- Alternatif yang Biasa Dipakai Audiens: ${u.indirectCompetitors.join(", ")}\n`;
    if (u.competitorWeakness) d += `- Kelemahan Kompetitor / Rasa Frustrasi Konsumen: ${u.competitorWeakness}\n`;
    if (u.whatWeWillNeverDo?.length) {
      d += `- HAL YANG HARAM DITIRU DARI KOMPETITOR (PAGAR KREATIF):\n  * ${u.whatWeWillNeverDo.join("\n  * ")}\n`;
    }
  }

  if (c.audienceDNA) {
    const u = c.audienceDNA;
    d += `\n[AUDIENCE DNA]\n`;
    if (u.primary) d += `- Profil Utama: ${u.primary}\n`;
    if (u.demographics) {
      const o = u.demographics;
      d += `- Demografi: ${[o.age, o.gender, o.location, o.occupation, o.purchasingPower].filter(Boolean).join(" • ")}\n`;
    }
    if (u.psychographics?.painPoints?.length) {
      d += `- Titik Keresahan Nyata (Pain Points):\n  * ${u.psychographics.painPoints.join("\n  * ")}\n`;
    }
    if (u.psychographics?.desires?.length) {
      d += `- Impian & Ekspektasi Nyata (Desires):\n  * ${u.psychographics.desires.join("\n  * ")}\n`;
    }
    if (u.psychographics?.objections?.length) {
      d += `- Keraguan Membeli (Objections Sebelum Transaksi):\n  * ${u.psychographics.objections.join("\n  * ")}\n`;
    }
    if (u.contentBehavior?.scrollStoppers) d += `- Penghenti Scroll (Hook Magnet): ${u.contentBehavior.scrollStoppers}\n`;
    if (u.contentBehavior?.commentTriggers) d += `- Pemantik Komentar: ${u.contentBehavior.commentTriggers}\n`;
  } else {
    d += `TARGET AUDIENS: ${c.audience || "-"}\n`;
  }

  if (c.offerConversionDNA) {
    const u = c.offerConversionDNA;
    d += `\n[PENAWARAN & ARSITEKTUR KONVERSI RIIL]\n`;
    if (u.mainOffer) d += `- Hero Offer: ${u.mainOffer}\n`;
    if (u.entryOffer) d += `- Entry / Tripwire: ${u.entryOffer}\n`;
    if (u.priceRange) d += `- Rentang Harga / Transaksi: ${u.priceRange}\n`;
    if (u.riskReversal) d += `- Garansi / Risk Reversal: ${u.riskReversal}\n`;
    if (u.purchasePath) d += `- Jalur Beli / Checkout: ${u.purchasePath}\n`;
  }

  if (c.proofCredibility) {
    const u = c.proofCredibility;
    d += `\n[BUKTI EMPIRIS & KREDIBILITAS LAPANGAN]\n`;
    if (u.hardProofPoints?.length) d += `- Fakta & Angka Keras:\n  * ${u.hardProofPoints.join("\n  * ")}\n`;
    if (u.caseTransformations?.length) d += `- Hasil Transformasi Nyata (Before-After):\n  * ${u.caseTransformations.join("\n  * ")}\n`;
    if (u.customerVoiceRaw?.length) d += `- Suara Asli Pelanggan:\n  * ${u.customerVoiceRaw.join("\n  * ")}\n`;
  }

  if (c.personalityVoice) {
    const u = c.personalityVoice;
    d += `\n[PERSONALITY & VOICE RULES]\n`;
    if (u.humanPersona) d += `- Personifikasi Manusia: ${u.humanPersona}\n`;
    d += `- Tone of Voice: ${c.tone || "Natural"}\n`;
    if (u.voiceDo?.length) d += `- DO (WAJIB DITERAPKAN):\n  * ${u.voiceDo.join("\n  * ")}\n`;
    if (u.voiceDont?.length) d += `- DON'T (HARAM DILAKUKAN):\n  * ${u.voiceDont.join("\n  * ")}\n`;
    if (u.signatureWords?.length) d += `- Kosa Kata Khas (Signature Words): ${u.signatureWords.map(o => `"${o}"`).join(", ")}\n`;
    if (u.forbiddenWords?.length) d += `- Kata Terlarang (Forbidden Words): ${u.forbiddenWords.map(o => `"${o}"`).join(", ")}\n`;
  } else {
    d += `TONE OF VOICE: ${c.tone || "Hangat, bersahabat, dan edukatif"}\n`;
  }

  if (c.visualDNA) {
    const u = c.visualDNA;
    d += `\n[ARAHAN VISUAL & ART DIRECTION]\n`;
    if (u.photographyStyle?.length) d += `- Gaya Visual / Footage: ${u.photographyStyle.join(", ")}\n`;
    if (u.visualDoNotUse?.length) d += `- Visual yang Dilarang (Anti-Slop): ${u.visualDoNotUse.join(", ")}\n`;
  }

  if (c.contentDNA) {
    const u = c.contentDNA;
    d += `\n[CONTENT DNA & FUNNEL CTA]\n`;
    if (u.pillars?.length) d += `- Pilar Konten: ${u.pillars.map(o => `${o.name} (${o.percentage}%)`).join(", ")}\n`;
    if (u.funnelCTA) {
      d += `- Formula CTA Berdasarkan Funnel:\n`;
      if (u.funnelCTA.awareness) d += `  * Awareness: "${u.funnelCTA.awareness}"\n`;
      if (u.funnelCTA.consideration) d += `  * Consideration: "${u.funnelCTA.consideration}"\n`;
      if (u.funnelCTA.conversion) d += `  * Conversion: "${u.funnelCTA.conversion}"\n`;
      if (u.funnelCTA.retention) d += `  * Retention: "${u.funnelCTA.retention}"\n`;
    }
  }

  if (c.brandMemory) {
    const u = c.brandMemory;
    d += `\n[BRAND MEMORY & GUARDRAILS]\n`;
    if (u.alwaysSay?.length) d += `- Hal yang Selalu Ditekankan: ${u.alwaysSay.map(o => `"${o}"`).join(" | ")}\n`;
    if (u.neverSay?.length) d += `- Hal yang Tidak Pernah Dijanjikan: ${u.neverSay.map(o => `"${o}"`).join(" | ")}\n`;
    if (u.claimsGuardrail?.allowed?.length) d += `- Klaim yang Boleh Dinyatakan: ${u.claimsGuardrail.allowed.join("; ")}\n`;
    if (u.claimsGuardrail?.forbidden?.length) d += `- KLAIM TERLARANG: ${u.claimsGuardrail.forbidden.join("; ")}\n`;
  }

  if (c.aiPersonaInstructions?.trim()) {
    d += `\n[INSTRUKSI PERSONA AI & ROLEPLAY KHUSUS]\n${c.aiPersonaInstructions.trim()}\n`;
  }

  if (c.customDirectives && c.customDirectives.length > 0) {
    const u = c.customDirectives.filter(o => o && o.trim());
    if (u.length > 0) {
      d += `\n[ATURAN WAJIB & DIRECTIVES KHUSUS PENGGUNA (WAJIB DIIKUTI)]:\n`;
      u.forEach((o, j) => {
        d += `${j + 1}. ${o.trim()}\n`;
      });
    }
  }

  if (c.customBlocks && c.customBlocks.length > 0) {
    const u = c.customBlocks.filter(o => o.isActive !== false && o.content?.trim());
    if (u.length > 0) {
      d += `\n[BLOK ACUAN DINAMIS & KNOWLEDGE BASE KHUSUS (CUSTOM BRAIN BLOCKS)]:\n`;
      u.forEach((o, j) => {
        d += `--- BLOK #${j + 1}: ${o.title || "Blok Acuan"} (${o.category || "Umum"}) ---\n${o.content.trim()}\n\n`;
      });
    }
  }

  if (c.customKnowledge?.trim()) {
    d += `\n[BASIS PENGETAHUAN BEBAS (RAW KNOWLEDGE / CATATAN DOKUMEN)]:\n${c.customKnowledge.trim()}\n`;
  }

  d += `=== AKHIR BRAND BRAIN ===\n`;
  return d;
}

export function calculateBrainCompleteness(c: BrandBrain): {
  score: number;
  confirmedCount: number;
  aiSuggestedCount: number;
  missingCount: number;
} {
  const d = [
    Boolean(c.name && c.product),
    Boolean(c.brandPromise || c.usp),
    Boolean(c.positioning?.statement || c.positioning?.weAre),
    Boolean(c.competitorContext?.directCompetitors?.length || c.competitorContext?.competitorWeakness),
    Boolean(c.audienceDNA?.psychographics?.painPoints?.length || c.audience),
    Boolean(c.offerConversionDNA?.mainOffer || c.offerConversionDNA?.priceRange),
    Boolean(c.proofCredibility?.hardProofPoints?.length || c.proofCredibility?.caseTransformations?.length),
    Boolean(c.personalityVoice?.humanPersona || c.personalityVoice?.voiceDo?.length),
    Boolean(c.visualDNA?.photographyStyle?.length || c.color),
    Boolean(c.contentDNA?.pillars?.length),
    Boolean(c.brandMemory?.claimsGuardrail?.allowed?.length || c.brandMemory?.alwaysSay?.length),
    Boolean(c.customBlocks?.length || c.customDirectives?.length || c.customKnowledge)
  ];
  const u = d.length;
  const o = d.filter(Boolean).length;
  const j = Math.round((o / u) * 100);
  const g = Object.values(c.fieldStatus || {});
  const p = g.filter(_ => _ === "confirmed").length;
  const y = g.filter(_ => _ === "ai_suggested").length;
  const S = Math.max(0, u - (p + y));
  return { score: j, confirmedCount: p, aiSuggestedCount: y, missingCount: S };
}

export function createDefaultBlock(category: string = "Aturan Wajib AI"): CustomKnowledgeBlock {
  const d = `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  switch (category) {
    case "Aturan Wajib AI":
      return {
        id: d,
        title: "Aturan Wajib Copywriting & Format",
        category,
        content: `- Selalu sertakan CTA spesifik (cth: "Klik link di bio" / "Komentar MAU").\n- Jangan pernah memakai kata "murah", gunakan "terjangkau dan berbobot".\n- Utamakan sudut pandang orang kedua yang akrab ("Anda" atau "Kamu").`,
        isActive: true
      };
    case "Katalog Produk & Harga":
      return {
        id: d,
        title: "Daftar Varian Produk & Paket Penawaran",
        category,
        content: `1. Paket Starter: Rp 149.000 (Akses draf & template instan)\n2. Paket Pro Hero: Rp 349.000 (Paling laris! Akses fitur lengkap + bonus panduan)\n3. Paket Bisnis: Rp 899.000 (Multi-brand + asistensi privat)`,
        isActive: true
      };
    case "SOP & Konten":
      return {
        id: d,
        title: "SOP Penulisan & Kualitas Naskah",
        category,
        content: `- Hook pembuka maksimal 10 kata yang langsung memotong distraksi scroll.\n- Paragraf isi maksimal 2 baris agar nyaman dibaca di layar smartphone.\n- Dilarang klaim berlebihan yang tidak didukung data nyata.`,
        isActive: true
      };
    case "FAQ & Objections":
      return {
        id: d,
        title: "FAQ & Keraguan Konsumen yang Sering Muncul",
        category,
        content: `Q: Apakah sistem ini cocok untuk pemula?\nA: Ya, dirancang tanpa setup rumit sehingga langsung jalan dalam 5 menit.\n\nQ: Bagaimana jika tidak cocok?\nA: Tersedia garansi kepuasan 14 hari tanpa ribet.`,
        isActive: true
      };
    case "Koleksi Copywriting":
      return {
        id: d,
        title: "Kumpulan Hook & Sudut Pandang Teruji",
        category,
        content: `- "90% orang salah mengira bahwa rahasia X adalah Y..."\n- "Sebelum Anda menghabiskan uang untuk Z, perhatikan 1 hal ini..."\n- "Cara saya mengatasi masalah A tanpa harus mengorbankan B..."`,
        isActive: true
      };
    case "Kampanye & Event":
      return {
        id: d,
        title: "Promo Spesial Musiman & Diskon",
        category,
        content: `Tema: Promo Spesial Gajian (Payday Boost)\nDiskon: Cashback 25% dengan kode voucher PAYDAYBOOST\nFokus: Ajak audiens mengalokasikan anggaran untuk upgrade diri sekarang.`,
        isActive: true
      };
    default:
      return {
        id: d,
        title: "Catatan Acuan Strategis",
        category: "Riset & Catatan Bebas",
        content: "Tuliskan catatan riset, referensi kompetitor, data lapangan, atau panduan apa saja yang wajib dipahami AI saat merancang konten.",
        isActive: true
      };
  }
}
