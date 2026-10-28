/**
 * Brand Brain - Inti data & prompt compiler
 * Contoh brand (Trajecto), kompilasi Brand Brain menjadi teks acuan AI, skor kelengkapan, pembuat blok acuan.
 *
 * Diekstrak dari kalender_konten_planner__3_.html (bundle Vite, di-minify) lalu dirapikan dengan Prettier.
 * Nama variabel pendek (c, d, u, o, j, ...) adalah nama asli hasil minify, belum di-rename.
 *
 * Berisi: Fb, ot, Qb, Xb
 *
 * Bergantung pada simbol lain di bundle (tidak ikut file ini):
 *   -
 */

const Fb = {
  name: "Trajecto",
  category: "Aplikasi Produktivitas & Life Planner",
  product: "All-in-One Personal Productivity, Time-Blocking & Agile Focus Operating System",
  brandPromise:
    "Membantu knowledge worker dan freelancer menyelesaikan kerjaan prioritas sebelum jam 5 sore tanpa stres dan tanpa terjebak siklus bikin template berjam-jam.",
  mission:
    "Membebaskan orang dari ilusi produktif (productive procrastination) menuju eksekusi nyata yang tenang dan terarah.",
  vision:
    "Menjadi sistem operasi fokus personal harian nomor satu untuk talenta mandiri di Asia Tenggara.",
  values: [
    "Eksekusi Nyata > Estetika Semu",
    "Zero-Setup Bloatware",
    "Kerja Selesai, Hidup Dimulai",
  ],
  audience:
    "Freelancer, remote worker, dan solopreneur usia 22-35 tahun yang burnout karena to-do list menumpuk",
  tone: "Santai, lugas, jujur (no-BS), relatable seperti teman kerja yang pintar",
  usp: "Agile Sprint personal 1-hari & visual time-blocking interaktif langsung di browser tanpa ribet setup template",
  cta: "Coba sprint gratis pertama lo hari ini di trajecto.web.app",
  color: "#0284c7",
  website: "https://trajecto.web.app",
  instagramHandle: "@trajecto.app",
  platformAccounts: {
    instagram: "@trajecto.app",
    tiktok: "@trajecto.id",
    threads: "@trajecto.app",
    linkedin: "company/trajecto-app",
    youtube: "@trajecto-app",
    facebook: "TrajectoApp",
  },
  audienceDNA: {
    primary: "Freelancer & Solopreneur 22-35 tahun di Indonesia",
    demographics: {
      age: "22 - 35 tahun",
      gender: "Semua gender (dominan pekerja digital)",
      location: "Kota-kota besar Indonesia (remote / WFH / hybrid)",
      occupation: "Freelancer, UI/UX Designer, Software Engineer, Content Creator, Konsultan",
      lifestyle: "Coffee shop hopper, digital nomad, tech-savvy tapi lelah overcomplicated tools",
      purchasingPower: "Menengah ke atas, bersedia bayar sekali/langganan terjangkau via QRIS",
    },
    psychographics: {
      painPoints: [
        "Daftar to-do list puluhan item yang bikin cemas sebelum mulai kerja",
        "Notion fatigue: habis waktu berjam-jam bikin dashboard estetik alih-alih kerja riil",
        "Tiap malam tidur dengan rasa bersalah karena merasa belum menyelesaikan hal penting",
        "Kerja lembur tidak berujung karena batas sprint harian tidak ada",
      ],
      desires: [
        "Bisa tutup laptop jam 5 sore dengan perasaan puas dan tenang",
        "Fokus terarah hanya pada 2-3 tugas bernilai tinggi setiap hari",
        "Alat kerja yang langsung bisa dipakai dalam 10 detik tanpa tutorial rumit",
      ],
      fears: [
        "Takut tertinggal (FOMO) dan dicap tidak produktif",
        "Takut burn-out berkepanjangan dan kehilangan passion kerja",
      ],
      objections: [
        '"Paling ribet setup kayak Notion/ClickUp lagi"',
        '"Harus bayar subscription mahal pakai kartu kredit luar negeri"',
        '"Apakah benar-benar bikin gue lebih fokus atau cuma aplikasi baru yang dianggurin?"',
      ],
    },
    contentBehavior: {
      scrollStoppers:
        "Pengakuan jujur soal productive procrastination, perbandingan dashboard estetik vs kerjaan nyata",
      commentTriggers: "Debat to-do list vs time-blocking, curhat jam tidur freelancer yang kacau",
      purchaseTriggers:
        "Demo visual 10 detik: buka browser langsung jalan + bayar lokal QRIS tanpa kartu kredit",
    },
  },
  positioning: {
    weAre: "Personal Agile Focus Operating System",
    forAudience: "Freelancer, remote worker, dan solopreneur",
    whoNeed: "Sistem kerja harian yang membatasi overload dan memicu eksekusi nyata",
    becauseWhy:
      "Dirancang dengan prinsip Agile Sprint 1-hari dan visual time-blocking interaktif yang zero-setup",
    unlike:
      "Notion yang makan waktu setup seharian atau aplikasi to-do list pasif yang cuma menumpuk beban mental",
    statement:
      "Trajecto adalah Focus Operating System untuk freelancer dan solopreneur yang butuh eksekusi harian terarah tanpa terjebak over-complicated template setup.",
  },
  personalityVoice: {
    spectrum: { formality: 80, playfulness: 55, approach: 75, positioningTier: 60, energy: 70 },
    humanPersona:
      "Teman kerja pintar yang santai di coffee shop: bicaranya blak-blakan jujur, nggak suka basa-basi teori, dan selalu fokus ke apa yang jalan di dunia nyata.",
    voiceDo: [
      'Gunakan bahasa Indonesia sehari-hari yang natural ("lo / gue", "kerjaan", "beres")',
      "Gunakan analogi konkret situasi kerja sehari-hari (jam 11 malam di depan laptop, kopi dingin, dll)",
      "Tulis kalimat pendek, tajam, dan ritmis",
      "Akui sisi pahit/keraguan secara terbuka sebelum memberikan solusi",
    ],
    voiceDont: [
      'Jangan gunakan bahasa motivasi klise ("gapai mimpimu", "sukses menanti")',
      'Jangan gunakan jargon korporat kaku ("sinergi", "optimalisasi menyeluruh")',
      "Jangan hard-selling berteriak diskon murahan",
      "Jangan membuat klaim yang terkesan takabur atau meremehkan audiens",
    ],
    signatureWords: [
      "productive procrastination",
      "eksekusi riil",
      "Agile Sprint personal",
      "Notion fatigue",
      "zero-setup",
      "fokus tenang",
    ],
    forbiddenWords: [
      "cepat kaya",
      "wajib beli sekarang",
      "revolusi hidup",
      "terbukti 100% ampuh tanpa usaha",
    ],
  },
  competitorContext: {
    directCompetitors: ["Notion", "ClickUp", "Sunsama", "Todoist", "TickTick"],
    indirectCompetitors: [
      "Buku catatan kertas (bullet journal)",
      "Google Calendar kosongan",
      "Apple Notes",
    ],
    competitorWeakness:
      "Notion & ClickUp terlalu lambat dan rumit (feature bloatware), butuh tutorial berjam-jam sehingga memicu productive procrastination. Sunsama terlalu mahal (US$20/bln) dan mewajibkan kartu kredit luar negeri.",
    whatWeWillNeverDo: [
      "Jangan pernah meminta user setting database relasional atau bikin template dari nol",
      "Jangan pernah memasang paywall mahal sebelum user merasakan manfaat sprint 1 hari",
      "Jangan pernah membuat UI yang terasa seperti dashboard korporat yang kaku dan mengintimidasi",
    ],
  },
  offerConversionDNA: {
    mainOffer: "Trajecto Focus Operating System Lifetime Access / Annual Pro",
    entryOffer: "Free Web-Sprint Sandbox (akses langsung tanpa kartu kredit)",
    priceRange: "Gratis untuk Free Web Access • Rp 99.000/tahun untuk Cloud Sync & Multi-Device",
    riskReversal: "30-Hari Jaminan Uang Kembali tanpa tanya jika tidak merasa lebih fokus",
    purchasePath: "Direct Web Checkout via QRIS & GoPay / ShopeePay instan di trajecto.web.app",
  },
  proofCredibility: {
    hardProofPoints: [
      "Dipakai oleh lebih dari 1.200+ freelancer & digital nomad aktif",
      "Rata-rata user menghemat 2,5 jam per hari dari siklus to-do list yang berantakan",
      "Rating kepuasan 4.9/5 dari komunitas kreator mandiri",
    ],
    caseTransformations: [
      "UI/UX Designer yang sebelumnya lembur sampai jam 2 pagi, kini konsisten tutup laptop jam 5 sore setelah membatasi 3 tugas prioritas per sprint.",
      'Software engineer freelance yang berhenti terjebak "Notion restructuring loop" dan berhasil merilis 2 side project dalam 1 bulan.',
    ],
    customerVoiceRaw: [
      '"Gue capek tiap malam ngerasa bersalah padahal seharian di depan laptop. Trajecto bikin batasan kerja gue jadi nyata."',
      '"Akhirnya ada tools yang nggak nyuruh gue belajar nonton tutorial YouTube cuma buat nyatet kerjaan hari ini."',
    ],
  },
  visualDNA: {
    palette: { primary: "#0284c7", secondary: "#0f172a", accent: "#f59e0b", background: "#f8fafc" },
    photographyStyle: [
      "Authentic Smartphone UGC (layar laptop di meja coffee shop berantakan alami)",
      "Clean candid work-in-progress (bukan pose model tersenyum kaku menatap kamera)",
      "Screen recording demo 5-10 detik to the point tanpa intro bertele-tele",
    ],
    visualDoNotUse: [
      "Foto stok korporat berjas senyum di ruang rapat",
      "Grafik 3D kartun generik yang tidak mencerminkan kerja nyata",
      "Tipografi super kecil yang tidak terbaca di feed smartphone",
    ],
  },
  contentDNA: {
    pillars: [
      {
        name: "Edukasi & Bongkar Mitos",
        percentage: 35,
        description: "Bedah productive procrastination, psikologi fokus, dan cara time-blocking",
      },
      {
        name: "Prinsip Kerja & Nilai",
        percentage: 25,
        description: "Filosofi kerja tenang, batas sprint harian, dan anti-hustle culture beracun",
      },
      {
        name: "Showcase Fitur & Solusi",
        percentage: 20,
        description: "Demonstrasi visual time-block browser, sprint board harian Trajecto",
      },
      {
        name: "Relatable Story & Curhat",
        percentage: 15,
        description: "Kehidupan freelancer, dilema jam tidur, drama revisi klien",
      },
      {
        name: "Behind the Scenes & Roadmap",
        percentage: 5,
        description: "Catatan update produk, sprint minggu ini dari tim Trajecto",
      },
    ],
    contentRatio: { awareness: 35, education: 30, engagement: 20, conversion: 10, loyalty: 5 },
    funnelCTA: {
      awareness: "Simpan postingan ini biar lo ingat pas to-do list mulai berantakan besok.",
      consideration: "Coba tes cara kerja time-blocking visual di browser lo: trajecto.web.app",
      conversion:
        "Mulai sprint pertama lo hari ini tanpa setup di trajecto.web.app (Free Web Access)",
      retention: "Bagikan progres sprint lo hari ini ke komunitas Trajecto.",
    },
  },
  brandMemory: {
    alwaysSay: [
      "Kerjaan klien bayar hasil eksekusi, bukan estetiknya dashboard.",
      "Maksimal 3 tugas prioritas per hari. Lebih dari itu adalah wishlist.",
      "Jam 5 sore laptop ditutup.",
    ],
    neverSay: [
      "Semua tugas bisa diselesaikan dalam semalam jika kamu mau berusaha lebih keras.",
      "Bekerjalah 16 jam sehari selagi muda.",
    ],
    signatureStories: [
      "Kisah founder yang menghabiskan 3 bulan mendesain template Notion yang akhirnya ditinggalkan dalam 4 hari karena terlalu ribet diisi.",
    ],
    claimsGuardrail: {
      allowed: [
        "Aplikasi berbasis web ringan yang langsung jalan di browser",
        "Menggunakan metode Agile Sprint harian dan time-blocking visual",
        "Bisa diakses gratis tanpa perlu instalasi atau setup database",
      ],
      forbidden: [
        "Menjamin produktivitas naik 1000% dalam 1 hari",
        "Menjamin tidak akan pernah prokrastinasi lagi seumur hidup",
      ],
    },
  },
  fieldStatus: {
    foundation: "confirmed",
    audienceDNA: "confirmed",
    positioning: "confirmed",
    competitorContext: "confirmed",
    offerConversionDNA: "confirmed",
    proofCredibility: "confirmed",
    personalityVoice: "confirmed",
    visualDNA: "confirmed",
    contentDNA: "confirmed",
    brandMemory: "confirmed",
    customBlocks: "confirmed",
  },
  customDirectives: [
    "Selalu sertakan ajakan coba sprint gratis di web tanpa setup di akhir konten.",
    'Jangan gunakan bahasa motivasi klise ("gapai impianmu"), gunakan realita dunia kerja konkret.',
    "Format naskah harus menggunakan kalimat pendek dan spasi lega yang ramah layar smartphone.",
    "Wajib sebutkan kemudahan bayar lokal QRIS saat membahas penawaran pro.",
  ],
  customBlocks: [
    {
      id: "block-katalog-trajecto",
      title: "Daftar Paket & Pricing Trajecto",
      category: "Katalog Produk & Harga",
      content: `1. Free Tier: Rp 0 (Akses time-blocking harian 1 sprint langsung di browser)
2. Pro Sprint Pass: Rp 49.000 / bulan atau Rp 399.000 sekali bayar lifetime (Bonus template sprint mingguan & integrasi kalender)
3. Team Focus: Rp 129.000 / seat / bulan (Untuk agensi & tim kreatif)`,
      isActive: !0,
    },
    {
      id: "block-sop-trajecto",
      title: "SOP Visual & Tone Media Sosial",
      category: "SOP & Konten",
      content: `- Hook awal wajib fokus ke perbandingan visual: "Ekspektasi vs Realita" kerja harian.
- Dilarang memakai ilustrasi corporate 3D kaku (corporate Memphis style).
- Gunakan screenshot UI nyata Trajecto dengan latar belakang meja kerja natural.`,
      isActive: !0,
    },
    {
      id: "block-faq-trajecto",
      title: "FAQ Jawaban Keraguan Pengguna",
      category: "FAQ & Objections",
      content: `Q: Apakah Trajecto bikin saya ribet setup database kayak Notion?
A: Tidak sama sekali. Buka link web, ketik 3 prioritas hari ini, mulai timer. Beres dalam 10 detik.

Q: Perlu instalasi atau sign up kartu kredit?
A: Tidak perlu kartu kredit, pembayaran pro mendukung QRIS, GoPay, OVO, dan transfer bank lokal.`,
      isActive: !0,
    },
    {
      id: "block-promo-trajecto",
      title: "Promo Spesial Payday Sprint",
      category: "Kampanye & Event",
      content: `Kode voucher: GAJIANFOKUS
Diskon: Potongan 30% untuk Pro Lifetime Pass
Periode: Tanggal 25-30 setiap bulan
Fokus hook: "Jangan biarkan gaji bulan ini habis tanpa investasi ke ketenangan pikiran Anda."`,
      isActive: !0,
    },
  ],
  customKnowledge: `Trajecto dibangun berdasarkan filosofi "Calm Productivity" karya Jason Fried dan prinsip time-boxing dari Cal Newport.
Masalah terbesar pekerja lepas dan pekerja remote di Indonesia bukanlah kekurangan waktu, melainkan "fragmentasi fokus": membuka 20 tab browser sekaligus, membalas chat WhatsApp klien di tengah kerja analitis, dan merasa bersalah setiap sore karena merasa belum menyelesaikan tugas penting.
Solusi Trajecto adalah membatasi sprint harian hanya pada 3 tugas "Must-Win" dan mengunci jendela waktu 90 menit tanpa distraksi.`,
  aiPersonaInstructions:
    "Anda bertindak sebagai Head of Creative Strategy di Trajecto. Bicaralah seperti teman kerja pintar yang santai, empatik terhadap burnout, dan membenci basa-basi teori produktivitas yang tidak realistis. Setiap hook dan naskah harus langsung memotong kebisingan linimasa media sosial.",
};

function ot(c) {
  if (!c) return "";
  let d = `
=== BRAND BRAIN: SATU SUMBER KEBENARAN STRATEGIS ===
`;
  if (
    ((d += `NAMA BRAND: ${c.name || "Brand"}
`),
    (d += `KATEGORI: ${c.category || "Bisnis & Produk"}
`),
    (d += `PRODUK / LAYANAN: ${c.product || "-"}
`),
    c.brandPromise &&
      (d += `BRAND PROMISE: ${c.brandPromise}
`),
    (d += `USP / PEMBEDA UTAMA: ${c.usp || "-"}
`),
    (d += `CTA DEFAULT: ${c.cta || "-"}
`),
    c.platformAccounts)
  ) {
    const u = c.platformAccounts,
      o = [
        u.instagram && `Instagram: ${u.instagram}`,
        u.tiktok && `TikTok: ${u.tiktok}`,
        u.threads && `Threads / X: ${u.threads}`,
        u.linkedin && `LinkedIn: ${u.linkedin}`,
        u.youtube && `YouTube: ${u.youtube}`,
        u.facebook && `Facebook: ${u.facebook}`,
      ].filter(Boolean);
    o.length > 0 &&
      (d += `
[AKUN PLATFORM RESMI]
- ${o.join(`
- `)}
`);
  }
  if (c.positioning) {
    const u = c.positioning;
    ((d += `
[POSITIONING BRAND]
`),
      u.statement &&
        (d += `- Positioning Statement: "${u.statement}"
`),
      u.weAre &&
        (d += `- Siapa Sebenarnya: ${u.weAre}
`),
      u.forAudience &&
        (d += `- Target Utama: ${u.forAudience}
`),
      u.whoNeed &&
        (d += `- Kebutuhan Utama: ${u.whoNeed}
`),
      u.becauseWhy &&
        (d += `- Alasan Percaya: ${u.becauseWhy}
`),
      u.unlike &&
        (d += `- Perbedaan dari Alternatif Lain: ${u.unlike}
`));
  }
  if (c.competitorContext) {
    const u = c.competitorContext;
    ((d += `
[FAKTA KOMPETISI & CELAH PASAR]
`),
      u.directCompetitors?.length &&
        (d += `- Kompetitor Utama di Lapangan: ${u.directCompetitors.join(", ")}
`),
      u.indirectCompetitors?.length &&
        (d += `- Alternatif yang Biasa Dipakai Audiens: ${u.indirectCompetitors.join(", ")}
`),
      u.competitorWeakness &&
        (d += `- Kelemahan Kompetitor / Rasa Frustrasi Konsumen: ${u.competitorWeakness}
`),
      u.whatWeWillNeverDo?.length &&
        (d += `- HAL YANG HARAM DITIRU DARI KOMPETITOR (PAGAR KREATIF):
  * ${u.whatWeWillNeverDo.join(`
  * `)}
`));
  }
  if (c.audienceDNA) {
    const u = c.audienceDNA;
    if (
      ((d += `
[AUDIENCE DNA]
`),
      u.primary &&
        (d += `- Profil Utama: ${u.primary}
`),
      u.demographics)
    ) {
      const o = u.demographics;
      d += `- Demografi: ${[o.age, o.gender, o.location, o.occupation, o.purchasingPower].filter(Boolean).join(" • ")}
`;
    }
    (u.psychographics?.painPoints?.length &&
      (d += `- Titik Keresahan Nyata (Pain Points):
  * ${u.psychographics.painPoints.join(`
  * `)}
`),
      u.psychographics?.desires?.length &&
        (d += `- Impian & Ekspektasi Nyata (Desires):
  * ${u.psychographics.desires.join(`
  * `)}
`),
      u.psychographics?.objections?.length &&
        (d += `- Keraguan Membeli (Objections Sebelum Transaksi):
  * ${u.psychographics.objections.join(`
  * `)}
`),
      u.contentBehavior?.scrollStoppers &&
        (d += `- Penghenti Scroll (Hook Magnet): ${u.contentBehavior.scrollStoppers}
`),
      u.contentBehavior?.commentTriggers &&
        (d += `- Pemantik Komentar: ${u.contentBehavior.commentTriggers}
`));
  } else
    d += `TARGET AUDIENS: ${c.audience || "-"}
`;
  if (c.offerConversionDNA) {
    const u = c.offerConversionDNA;
    ((d += `
[PENAWARAN & ARSITEKTUR KONVERSI RIIL]
`),
      u.mainOffer &&
        (d += `- Hero Offer: ${u.mainOffer}
`),
      u.entryOffer &&
        (d += `- Entry / Tripwire: ${u.entryOffer}
`),
      u.priceRange &&
        (d += `- Rentang Harga / Transaksi: ${u.priceRange}
`),
      u.riskReversal &&
        (d += `- Garansi / Risk Reversal: ${u.riskReversal}
`),
      u.purchasePath &&
        (d += `- Jalur Beli / Checkout: ${u.purchasePath}
`));
  }
  if (c.proofCredibility) {
    const u = c.proofCredibility;
    ((d += `
[BUKTI EMPIRIS & KREDIBILITAS LAPANGAN]
`),
      u.hardProofPoints?.length &&
        (d += `- Fakta & Angka Keras:
  * ${u.hardProofPoints.join(`
  * `)}
`),
      u.caseTransformations?.length &&
        (d += `- Hasil Transformasi Nyata (Before-After):
  * ${u.caseTransformations.join(`
  * `)}
`),
      u.customerVoiceRaw?.length &&
        (d += `- Suara Asli Pelanggan (Bahan Hook & Validasi Frustrasi):
  * ${u.customerVoiceRaw.join(`
  * `)}
`));
  }
  if (c.personalityVoice) {
    const u = c.personalityVoice;
    ((d += `
[PERSONALITY & VOICE RULES]
`),
      u.humanPersona &&
        (d += `- Personifikasi Manusia: ${u.humanPersona}
`),
      (d += `- Tone of Voice: ${c.tone || "Natural"}
`),
      u.voiceDo?.length &&
        (d += `- DO (WAJIB DITERAPKAN):
  * ${u.voiceDo.join(`
  * `)}
`),
      u.voiceDont?.length &&
        (d += `- DON'T (HARAM DILAKUKAN):
  * ${u.voiceDont.join(`
  * `)}
`),
      u.signatureWords?.length &&
        (d += `- Kosa Kata Khas (Signature Words): ${u.signatureWords.map((o) => `"${o}"`).join(", ")}
`),
      u.forbiddenWords?.length &&
        (d += `- Kata Terlarang (Forbidden Words): ${u.forbiddenWords.map((o) => `"${o}"`).join(", ")}
`));
  } else
    d += `TONE OF VOICE: ${c.tone || "Hangat, bersahabat, dan edukatif"}
`;
  if (c.visualDNA) {
    const u = c.visualDNA;
    ((d += `
[ARAHAN VISUAL & ART DIRECTION]
`),
      u.photographyStyle?.length &&
        (d += `- Gaya Visual / Footage: ${u.photographyStyle.join(", ")}
`),
      u.visualDoNotUse?.length &&
        (d += `- Visual yang Dilarang (Anti-Slop): ${u.visualDoNotUse.join(", ")}
`));
  }
  if (c.contentDNA) {
    const u = c.contentDNA;
    ((d += `
[CONTENT DNA & FUNNEL CTA]
`),
      u.pillars?.length &&
        (d += `- Pilar Konten: ${u.pillars.map((o) => `${o.name} (${o.percentage}%)`).join(", ")}
`),
      u.funnelCTA &&
        ((d += `- Formula CTA Berdasarkan Funnel:
`),
        u.funnelCTA.awareness &&
          (d += `  * Awareness: "${u.funnelCTA.awareness}"
`),
        u.funnelCTA.consideration &&
          (d += `  * Consideration: "${u.funnelCTA.consideration}"
`),
        u.funnelCTA.conversion &&
          (d += `  * Conversion: "${u.funnelCTA.conversion}"
`),
        u.funnelCTA.retention &&
          (d += `  * Retention: "${u.funnelCTA.retention}"
`)));
  }
  if (c.brandMemory) {
    const u = c.brandMemory;
    ((d += `
[BRAND MEMORY & GUARDRAILS]
`),
      u.alwaysSay?.length &&
        (d += `- Hal yang Selalu Ditekankan: ${u.alwaysSay.map((o) => `"${o}"`).join(" | ")}
`),
      u.neverSay?.length &&
        (d += `- Hal yang Tidak Pernah Dijanjikan: ${u.neverSay.map((o) => `"${o}"`).join(" | ")}
`),
      u.claimsGuardrail?.allowed?.length &&
        (d += `- Klaim yang Boleh Dinyatakan: ${u.claimsGuardrail.allowed.join("; ")}
`),
      u.claimsGuardrail?.forbidden?.length &&
        (d += `- KLAIM TERLARANG: ${u.claimsGuardrail.forbidden.join("; ")}
`));
  }
  if (
    (c.aiPersonaInstructions?.trim() &&
      (d += `
[INSTRUKSI PERSONA AI & ROLEPLAY KHUSUS]
${c.aiPersonaInstructions.trim()}
`),
    c.customDirectives && c.customDirectives.length > 0)
  ) {
    const u = c.customDirectives.filter((o) => o && o.trim());
    u.length > 0 &&
      ((d += `
[ATURAN WAJIB & DIRECTIVES KHUSUS PENGGUNA (WAJIB DIIKUTI)]:
`),
      u.forEach((o, j) => {
        d += `${j + 1}. ${o.trim()}
`;
      }));
  }
  if (c.customBlocks && c.customBlocks.length > 0) {
    const u = c.customBlocks.filter((o) => o.isActive !== !1 && o.content?.trim());
    u.length > 0 &&
      ((d += `
[BLOK ACUAN DINAMIS & KNOWLEDGE BASE KHUSUS (CUSTOM BRAIN BLOCKS)]:
`),
      u.forEach((o, j) => {
        d += `--- BLOK #${j + 1}: ${o.title || "Blok Acuan"} (${o.category || "Umum"}) ---
${o.content.trim()}

`;
      }));
  }
  return (
    c.customKnowledge?.trim() &&
      (d += `
[BASIS PENGETAHUAN BEBAS (RAW KNOWLEDGE / CATATAN DOKUMEN)]:
${c.customKnowledge.trim()}
`),
    (d += `=== AKHIR BRAND BRAIN ===
`),
    d
  );
}

function Qb(c) {
  const d = [
      !!(c.name && c.product),
      !!(c.brandPromise || c.usp),
      !!(c.positioning?.statement || c.positioning?.weAre),
      !!(c.competitorContext?.directCompetitors?.length || c.competitorContext?.competitorWeakness),
      !!(c.audienceDNA?.psychographics?.painPoints?.length || c.audience),
      !!(c.offerConversionDNA?.mainOffer || c.offerConversionDNA?.priceRange),
      !!(
        c.proofCredibility?.hardProofPoints?.length ||
        c.proofCredibility?.caseTransformations?.length
      ),
      !!(c.personalityVoice?.humanPersona || c.personalityVoice?.voiceDo?.length),
      !!(c.visualDNA?.photographyStyle?.length || c.color),
      !!c.contentDNA?.pillars?.length,
      !!(c.brandMemory?.claimsGuardrail?.allowed?.length || c.brandMemory?.alwaysSay?.length),
      !!(c.customBlocks?.length || c.customDirectives?.length || c.customKnowledge),
    ],
    u = d.length,
    o = d.filter(Boolean).length,
    j = Math.round((o / u) * 100),
    g = Object.values(c.fieldStatus || {}),
    p = g.filter((_) => _ === "confirmed").length,
    y = g.filter((_) => _ === "ai_suggested").length,
    S = Math.max(0, u - (p + y));
  return { score: j, confirmedCount: p, aiSuggestedCount: y, missingCount: S };
}

function Xb(c = "Aturan Wajib AI") {
  const d = `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  switch (c) {
    case "Aturan Wajib AI":
      return {
        id: d,
        title: "Aturan Wajib Copywriting & Format",
        category: c,
        content: `- Selalu sertakan CTA spesifik (cth: "Klik link di bio" / "Komentar MAU").
- Jangan pernah memakai kata "murah", gunakan "terjangkau dan berbobot".
- Utamakan sudut pandang orang kedua yang akrab ("Anda" atau "Kamu").`,
        isActive: !0,
      };
    case "Katalog Produk & Harga":
      return {
        id: d,
        title: "Daftar Varian Produk & Paket Penawaran",
        category: c,
        content: `1. Paket Starter: Rp 149.000 (Akses draf & template instan)
2. Paket Pro Hero: Rp 349.000 (Paling laris! Akses fitur lengkap + bonus panduan)
3. Paket Bisnis: Rp 899.000 (Multi-brand + asistensi privat)`,
        isActive: !0,
      };
    case "SOP & Konten":
      return {
        id: d,
        title: "SOP Penulisan & Kualitas Naskah",
        category: c,
        content: `- Hook pembuka maksimal 10 kata yang langsung memotong distraksi scroll.
- Paragraf isi maksimal 2 baris agar nyaman dibaca di layar smartphone.
- Dilarang klaim berlebihan yang tidak didukung data nyata.`,
        isActive: !0,
      };
    case "FAQ & Objections":
      return {
        id: d,
        title: "FAQ & Keraguan Konsumen yang Sering Muncul",
        category: c,
        content: `Q: Apakah sistem ini cocok untuk pemula?
A: Ya, dirancang tanpa setup rumit sehingga langsung jalan dalam 5 menit.

Q: Bagaimana jika tidak cocok?
A: Tersedia garansi kepuasan 14 hari tanpa ribet.`,
        isActive: !0,
      };
    case "Koleksi Copywriting":
      return {
        id: d,
        title: "Kumpulan Hook & Sudut Pandang Teruji",
        category: c,
        content: `- "90% orang salah mengira bahwa rahasia X adalah Y..."
- "Sebelum Anda menghabiskan uang untuk Z, perhatikan 1 hal ini..."
- "Cara saya mengatasi masalah A tanpa harus mengorbankan B..."`,
        isActive: !0,
      };
    case "Kampanye & Event":
      return {
        id: d,
        title: "Promo Spesial Musiman & Diskon",
        category: c,
        content: `Tema: Promo Spesial Gajian (Payday Boost)
Diskon: Cashback 25% dengan kode voucher PAYDAYBOOST
Fokus: Ajak audiens mengalokasikan anggaran untuk upgrade diri sekarang.`,
        isActive: !0,
      };
    default:
      return {
        id: d,
        title: "Catatan Acuan Strategis",
        category: "Riset & Catatan Bebas",
        content:
          "Tuliskan catatan riset, referensi kompetitor, data lapangan, atau panduan apa saja yang wajib dipahami AI saat merancang konten.",
        isActive: !0,
      };
  }
}

