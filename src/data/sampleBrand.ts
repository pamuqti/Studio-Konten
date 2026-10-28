import { BrandBrain, CustomKnowledgeBlock } from '../types';

export const emptyBrand: BrandBrain = {
  name: "",
  category: "",
  product: "",
  audience: "",
  usp: "",
  tone: "Hangat, bersahabat, dan edukatif",
  cta: "Hubungi kami via link bio",
  color: "#205c49",
  instagramHandle: "",
  platformAccounts: {
    instagram: "",
    tiktok: "",
    threads: "",
    linkedin: "",
    youtube: "",
    facebook: ""
  }
};

export const sampleBrandTrajecto: BrandBrain = {
  id: "brand-trajecto",
  name: "Trajecto",
  category: "Aplikasi Produktivitas & Life Planner",
  product: "All-in-One Personal Productivity, Time-Blocking & Agile Focus Operating System",
  brandPromise: "Membantu knowledge worker dan freelancer menyelesaikan kerjaan prioritas sebelum jam 5 sore tanpa stres dan tanpa terjebak siklus bikin template berjam-jam.",
  mission: "Membebaskan orang dari ilusi produktif (productive procrastination) menuju eksekusi nyata yang tenang dan terarah.",
  vision: "Menjadi sistem operasi fokus personal harian nomor satu untuk talenta mandiri di Asia Tenggara.",
  values: [
    "Eksekusi Nyata > Estetika Semu",
    "Zero-Setup Bloatware",
    "Kerja Selesai, Hidup Dimulai"
  ],
  audience: "Freelancer, remote worker, dan solopreneur usia 22-35 tahun yang burnout karena to-do list menumpuk",
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
    facebook: "TrajectoApp"
  },
  audienceDNA: {
    primary: "Freelancer & Solopreneur 22-35 tahun di Indonesia",
    demographics: {
      age: "22 - 35 tahun",
      gender: "Semua gender (dominan pekerja digital)",
      location: "Kota-kota besar Indonesia (remote / WFH / hybrid)",
      occupation: "Freelancer, UI/UX Designer, Software Engineer, Content Creator, Konsultan",
      lifestyle: "Coffee shop hopper, digital nomad, tech-savvy tapi lelah overcomplicated tools",
      purchasingPower: "Menengah ke atas, bersedia bayar sekali/langganan terjangkau via QRIS"
    },
    psychographics: {
      painPoints: [
        "Daftar to-do list puluhan item yang bikin cemas sebelum mulai kerja",
        "Notion fatigue: habis waktu berjam-jam bikin dashboard estetik alih-alih kerja riil",
        "Tiap malam tidur dengan rasa bersalah karena merasa belum menyelesaikan hal penting",
        "Kerja lembur tidak berujung karena batas sprint harian tidak ada"
      ],
      desires: [
        "Bisa tutup laptop jam 5 sore dengan perasaan puas dan tenang",
        "Fokus terarah hanya pada 2-3 tugas bernilai tinggi setiap hari",
        "Alat kerja yang langsung bisa dipakai dalam 10 detik tanpa tutorial rumit"
      ],
      fears: [
        "Takut tertinggal (FOMO) dan dicap tidak produktif",
        "Takut burn-out berkepanjangan dan kehilangan passion kerja"
      ],
      objections: [
        '"Paling ribet setup kayak Notion/ClickUp lagi"',
        '"Harus bayar subscription mahal pakai kartu kredit luar negeri"',
        '"Apakah benar-benar bikin gue lebih fokus atau cuma aplikasi baru yang dianggurin?"'
      ]
    },
    contentBehavior: {
      scrollStoppers: "Pengakuan jujur soal productive procrastination, perbandingan dashboard estetik vs kerjaan nyata",
      commentTriggers: "Debat to-do list vs time-blocking, curhat jam tidur freelancer yang kacau",
      purchaseTriggers: "Demo visual 10 detik: buka browser langsung jalan + bayar lokal QRIS tanpa kartu kredit"
    }
  },
  positioning: {
    weAre: "Personal Agile Focus Operating System",
    forAudience: "Freelancer, remote worker, dan solopreneur",
    whoNeed: "Sistem kerja harian yang membatasi overload dan memicu eksekusi nyata",
    becauseWhy: "Dirancang dengan prinsip Agile Sprint 1-hari dan visual time-blocking interaktif yang zero-setup",
    unlike: "Notion yang makan waktu setup seharian atau aplikasi to-do list pasif yang cuma menumpuk beban mental",
    statement: "Trajecto adalah Focus Operating System untuk freelancer dan solopreneur yang butuh eksekusi harian terarah tanpa terjebak over-complicated template setup."
  },
  personalityVoice: {
    spectrum: {
      formality: 80,
      playfulness: 55,
      approach: 75,
      positioningTier: 60,
      energy: 70
    },
    humanPersona: "Teman kerja pintar yang santai di coffee shop: bicaranya blak-blakan jujur, nggak suka basa-basi teori, dan selalu fokus ke apa yang jalan di dunia nyata.",
    voiceDo: [
      'Gunakan bahasa Indonesia sehari-hari yang natural ("lo / gue", "kerjaan", "beres")',
      "Gunakan analogi konkret situasi kerja sehari-hari (jam 11 malam di depan laptop, kopi dingin, dll)",
      "Tulis kalimat pendek, tajam, dan ritmis",
      "Akui sisi pahit/keraguan secara terbuka sebelum memberikan solusi"
    ],
    voiceDont: [
      'Jangan gunakan bahasa motivasi klise ("gapai mimpimu", "sukses menanti")',
      'Jangan gunakan jargon korporat kaku ("sinergi", "optimalisasi menyeluruh")',
      "Jangan hard-selling berteriak diskon murahan",
      "Jangan membuat klaim yang terkesan takabur atau meremehkan audiens"
    ],
    signatureWords: [
      "productive procrastination",
      "eksekusi riil",
      "Agile Sprint personal",
      "Notion fatigue",
      "zero-setup",
      "fokus tenang"
    ],
    forbiddenWords: [
      "cepat kaya",
      "wajib beli sekarang",
      "revolusi hidup",
      "terbukti 100% ampuh tanpa usaha"
    ]
  },
  competitorContext: {
    directCompetitors: ["Notion", "ClickUp", "Sunsama", "Todoist", "TickTick"],
    indirectCompetitors: [
      "Buku catatan kertas (bullet journal)",
      "Google Calendar kosongan",
      "Apple Notes"
    ],
    competitorWeakness: "Notion & ClickUp terlalu lambat dan rumit (feature bloatware), butuh tutorial berjam-jam sehingga memicu productive procrastination. Sunsama terlalu mahal (US$20/bln) dan mewajibkan kartu kredit luar negeri.",
    whatWeWillNeverDo: [
      "Jangan pernah meminta user setting database relasional atau bikin template dari nol",
      "Jangan pernah memasang paywall mahal sebelum user merasakan manfaat sprint 1 hari",
      "Jangan pernah membuat UI yang terasa seperti dashboard korporat yang kaku dan mengintimidasi"
    ]
  },
  offerConversionDNA: {
    mainOffer: "Trajecto Focus Operating System Lifetime Access / Annual Pro",
    entryOffer: "Free Web-Sprint Sandbox (akses langsung tanpa kartu kredit)",
    priceRange: "Gratis untuk Free Web Access • Rp 99.000/tahun untuk Cloud Sync & Multi-Device",
    riskReversal: "30-Hari Jaminan Uang Kembali tanpa tanya jika tidak merasa lebih fokus",
    purchasePath: "Direct Web Checkout via QRIS & GoPay / ShopeePay instan di trajecto.web.app"
  },
  proofCredibility: {
    hardProofPoints: [
      "Dipakai oleh lebih dari 1.200+ freelancer & digital nomad aktif",
      "Rata-rata user menghemat 2,5 jam per hari dari siklus to-do list yang berantakan",
      "Rating kepuasan 4.9/5 dari komunitas kreator mandiri"
    ],
    caseTransformations: [
      "UI/UX Designer yang sebelumnya lembur sampai jam 2 pagi, kini konsisten tutup laptop jam 5 sore setelah membatasi 3 tugas prioritas per sprint.",
      'Software engineer freelance yang berhenti terjebak "Notion restructuring loop" dan berhasil merilis 2 side project dalam 1 bulan.'
    ],
    customerVoiceRaw: [
      '"Gue capek tiap malam ngerasa bersalah padahal seharian di depan laptop. Trajecto bikin batasan kerja gue jadi nyata."',
      '"Akhirnya ada tools yang nggak nyuruh gue belajar nonton tutorial YouTube cuma buat nyatet kerjaan hari ini."'
    ]
  },
  visualDNA: {
    palette: {
      primary: "#0284c7",
      secondary: "#0f172a",
      accent: "#f59e0b",
      background: "#f8fafc"
    },
    photographyStyle: [
      "Authentic Smartphone UGC (layar laptop di meja coffee shop berantakan alami)",
      "Clean candid work-in-progress (bukan pose model tersenyum kaku menatap kamera)",
      "Screen recording demo 5-10 detik to the point tanpa intro bertele-tele"
    ],
    visualDoNotUse: [
      "Foto stok korporat berjas senyum di ruang rapat",
      "Grafik 3D kartun generik yang tidak mencerminkan kerja nyata",
      "Tipografi super kecil yang tidak terbaca di feed smartphone"
    ]
  },
  contentDNA: {
    pillars: [
      { name: "Edukasi & Bongkar Mitos", percentage: 35, description: "Bedah productive procrastination, psikologi fokus, dan cara time-blocking" },
      { name: "Prinsip Kerja & Nilai", percentage: 25, description: "Filosofi kerja tenang, batas sprint harian, dan anti-hustle culture beracun" },
      { name: "Showcase Fitur & Solusi", percentage: 20, description: "Demonstrasi visual time-block browser, sprint board harian Trajecto" },
      { name: "Relatable Story & Curhat", percentage: 15, description: "Kehidupan freelancer, dilema jam tidur, drama revisi klien" },
      { name: "Behind the Scenes & Roadmap", percentage: 5, description: "Catatan update produk, sprint minggu ini dari tim Trajecto" }
    ],
    contentRatio: { awareness: 35, education: 30, engagement: 20, conversion: 10, loyalty: 5 },
    funnelCTA: {
      awareness: "Simpan postingan ini biar lo ingat pas to-do list mulai berantakan besok.",
      consideration: "Coba tes cara kerja time-blocking visual di browser lo: trajecto.web.app",
      conversion: "Mulai sprint pertama lo hari ini tanpa setup di trajecto.web.app (Free Web Access)",
      retention: "Bagikan progres sprint lo hari ini ke komunitas Trajecto."
    }
  },
  brandMemory: {
    alwaysSay: [
      "Kerjaan klien bayar hasil eksekusi, bukan estetiknya dashboard.",
      "Maksimal 3 tugas prioritas per hari. Lebih dari itu adalah wishlist.",
      "Jam 5 sore laptop ditutup."
    ],
    neverSay: [
      "Semua tugas bisa diselesaikan dalam semalam jika kamu mau berusaha lebih keras.",
      "Bekerjalah 16 jam sehari selagi muda."
    ],
    signatureStories: [
      "Kisah founder yang menghabiskan 3 bulan mendesain template Notion yang akhirnya ditinggalkan dalam 4 hari karena terlalu ribet diisi."
    ],
    claimsGuardrail: {
      allowed: [
        "Aplikasi berbasis web ringan yang langsung jalan di browser",
        "Menggunakan metode Agile Sprint harian dan time-blocking visual",
        "Bisa diakses gratis tanpa perlu instalasi atau setup database"
      ],
      forbidden: [
        "Menjamin produktivitas naik 1000% dalam 1 hari",
        "Menjamin tidak akan pernah prokrastinasi lagi seumur hidup"
      ]
    }
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
    customBlocks: "confirmed"
  },
  customDirectives: [
    "Selalu sertakan ajakan coba sprint gratis di web tanpa setup di akhir konten.",
    'Jangan gunakan bahasa motivasi klise ("gapai impianmu"), gunakan realita dunia kerja konkret.',
    "Format naskah harus menggunakan kalimat pendek dan spasi lega yang ramah layar smartphone.",
    "Wajib sebutkan kemudahan bayar lokal QRIS saat membahas penawaran pro."
  ],
  customBlocks: [
    {
      id: "block-katalog-trajecto",
      title: "Daftar Paket & Pricing Trajecto",
      category: "Katalog Produk & Harga",
      content: `1. Free Tier: Rp 0 (Akses time-blocking harian 1 sprint langsung di browser)\n2. Pro Sprint Pass: Rp 49.000 / bulan atau Rp 399.000 sekali bayar lifetime (Bonus template sprint mingguan & integrasi kalender)\n3. Team Focus: Rp 129.000 / seat / bulan (Untuk agensi & tim kreatif)`,
      isActive: true
    },
    {
      id: "block-sop-trajecto",
      title: "SOP Visual & Tone Media Sosial",
      category: "SOP & Konten",
      content: `- Hook awal wajib fokus ke perbandingan visual: "Ekspektasi vs Realita" kerja harian.\n- Dilarang memakai ilustrasi corporate 3D kaku (corporate Memphis style).\n- Gunakan screenshot UI nyata Trajecto dengan latar belakang meja kerja natural.`,
      isActive: true
    },
    {
      id: "block-faq-trajecto",
      title: "FAQ Jawaban Keraguan Pengguna",
      category: "FAQ & Objections",
      content: `Q: Apakah Trajecto bikin saya ribet setup database kayak Notion?\nA: Tidak sama sekali. Buka link web, ketik 3 prioritas hari ini, mulai timer. Beres dalam 10 detik.\n\nQ: Perlu instalasi atau sign up kartu kredit?\nA: Tidak perlu kartu kredit, pembayaran pro mendukung QRIS, GoPay, OVO, dan transfer bank lokal.`,
      isActive: true
    },
    {
      id: "block-promo-trajecto",
      title: "Promo Spesial Payday Sprint",
      category: "Kampanye & Event",
      content: `Kode voucher: GAJIANFOKUS\nDiskon: Potongan 30% untuk Pro Lifetime Pass\nPeriode: Tanggal 25-30 setiap bulan\nFokus hook: "Jangan biarkan gaji bulan ini habis tanpa investasi ke ketenangan pikiran Anda."`,
      isActive: true
    }
  ],
  customKnowledge: `Trajecto dibangun berdasarkan filosofi "Calm Productivity" karya Jason Fried dan prinsip time-boxing dari Cal Newport.\nMasalah terbesar pekerja lepas dan pekerja remote di Indonesia bukanlah kekurangan waktu, melainkan "fragmentasi fokus": membuka 20 tab browser sekaligus, membalas chat WhatsApp klien di tengah kerja analitis, dan merasa bersalah setiap sore karena merasa belum menyelesaikan tugas penting.\nSolusi Trajecto adalah membatasi sprint harian hanya pada 3 tugas "Must-Win" dan mengunci jendela waktu 90 menit tanpa distraksi.`,
  aiPersonaInstructions: "Anda bertindak sebagai Head of Creative Strategy di Trajecto. Bicaralah seperti teman kerja pintar yang santai, empatik terhadap burnout, dan membenci basa-basi teori produktivitas yang tidak realistis. Setiap hook dan naskah harus langsung memotong kebisingan linimasa media sosial."
};

export const sampleBrandKopiSenja: BrandBrain = {
  id: "brand-kopi-senja",
  name: "Kopi Senja Roastery",
  category: "F&B / Artisan Specialty Coffee",
  product: "Biji Kopi Specialty Roasting Segar, Cold Brew Kaleng, & Menu Kopi Susu Aren Otentik",
  brandPromise: "Menghadirkan kenikmatan kopi artisan kelas specialty roastery tanpa rasa intimidated dan tanpa harga selangit.",
  mission: "Mendekatkan kekayaan cita rasa kopi petani lokal Indonesia ke cangkir harian para penikmat kopi di kota besar.",
  vision: "Menjadi roastery kopi lokal independen paling dipercaya untuk konsistensi rasa dan kejujuran sumber biji kopi.",
  values: [
    "Jujur Pada Petani & Rasa",
    "Segar Tanpa Pemanis Kimia",
    "Ngopi Itu Merawat Jiwa"
  ],
  audience: "Pecinta kopi harian, pekerja kantor, dan mahasiswa 20-38 tahun yang mencari rasa kopi asli tanpa asam lambung",
  tone: "Hangat, santai, puitis tapi membumi, ramah layaknya barista langganan yang selalu mengingat pesanan Anda",
  usp: "Biji kopi lokal 100% single-origin di-roast mingguan dengan profil rasa manis alami tanpa perisa buatan",
  cta: "Mampir ke kedai kami atau pesan beans segar via Tokopedia di bio!",
  color: "#b45309",
  website: "https://kopisenja.id",
  instagramHandle: "@kopisenja.roastery",
  platformAccounts: {
    instagram: "@kopisenja.roastery",
    tiktok: "@kopisenja.id",
    threads: "@kopisenja.roastery",
    youtube: "@kopisenjaroastery",
    facebook: "KopiSenjaRoastery"
  },
  audienceDNA: {
    primary: "Pekerja kreatif dan penikmat kopi kota besar (20 - 38 tahun)",
    demographics: {
      age: "20 - 38 tahun",
      gender: "Semua gender",
      location: "Jabodetabek, Bandung, Surabaya, Yogyakarta",
      occupation: "Karyawan swasta, freelancer, mahasiswa tingkat akhir",
      lifestyle: "Suka nongkrong produktif, menghargai rasa kopi asli, gemar menyeduh sendiri di rumah",
      purchasingPower: "Menengah (Rp 25.000 - Rp 95.000 per transaksi)"
    },
    psychographics: {
      painPoints: [
        "Kopi botolan di pasaran terlalu manis dan bikin mual",
        "Takut asam lambung kambuh karena biji kopi kualitas rendah yang di-roast gosong",
        "Merasa kopi specialty terlalu ribet dan intimidatif dengan istilah-istilah rumit"
      ],
      desires: [
        "Kopi yang aman diminum tiap pagi tanpa perut perih",
        "Rasa kopi yang wangi buah dan cokelat alami",
        "Tempat ngopi yang tenang tanpa musik berisik"
      ]
    }
  },
  positioning: {
    weAre: "Artisan Neighborhood Coffee Roastery",
    forAudience: "Penikmat kopi harian yang mencari kualitas rasa jujur",
    whoNeed: "Kopi harian berkualitas tinggi yang ramah di lambung dan kantong",
    becauseWhy: "Di-roast berkala dalam batch kecil menggunakan biji arabika lokal pilihan grade 1",
    unlike: "Kopi sachet tinggi gula atau kafe franchise berharga mahal",
    statement: "Kopi Senja adalah artisan roastery untuk penikmat kopi yang butuh rasa otentik segar tanpa kepalsuan."
  }
};

export const sampleBrandGrowthForge: BrandBrain = {
  id: "brand-growth-forge",
  name: "GrowthForge Studio",
  category: "B2B Creative & Growth Marketing Agency",
  product: "Creative Strategy, High-Converting Short-Form Video Ads, & Paid Traffic Scaling",
  brandPromise: "Membantu brand D2C dan UMKM modern melipatgandakan ROAS iklan dengan konten video yang memicu pembelian nyata, bukan sekadar vanity metrics.",
  mission: "Menghentikan pemborosan budget iklan brand melalui creative testing berbasis data psikologi konsumen.",
  vision: "Menjadi mitra pertumbuhan kreatif nomor satu bagi 500+ brand lokal di Indonesia.",
  values: [
    "ROAS Nyata > Views Semu",
    "Kecepatan Iterasi Iklan",
    "Psikologi Pembeli Berbasis Riset"
  ],
  audience: "Founder brand D2C, Chief Marketing Officer, dan pemilik bisnis e-commerce beromset Rp 100jt - Rp 2M/bulan",
  tone: "Data-driven, tajam, profesional, percaya diri, tanpa basa-basi",
  usp: "Kombinasi analisis psikologi pembeli dengan framework hook 3-detik yang teruji menghasilkan 4x ROAS",
  cta: "Klaim audit performa iklan 30 menit gratis sekarang di bio kami",
  color: "#7c3aed",
  website: "https://growthforge.agency",
  instagramHandle: "@growthforge.studio",
  platformAccounts: {
    instagram: "@growthforge.studio",
    tiktok: "@growthforge.agency",
    threads: "@growthforge.studio",
    linkedin: "company/growthforge-studio",
    youtube: "@growthforgestudio"
  },
  audienceDNA: {
    primary: "Founder & Marketing Leader Brand Lokal Indonesia",
    demographics: {
      age: "25 - 45 tahun",
      gender: "Semua gender",
      location: "Indonesia",
      occupation: "Founder, CEO, CMO, Head of Performance Marketing",
      lifestyle: "Orientasi hasil bisnis, membaca case study, fokus pada margin keuntungan",
      purchasingPower: "Bisnis / Korporat (Budget retainer Rp 15jt - Rp 80jt/bulan)"
    }
  },
  positioning: {
    weAre: "Performance Creative Growth Agency",
    forAudience: "Brand lokal yang terjebak pada ROAS iklan rendah",
    whoNeed: "Video iklan kreatif berkonversi tinggi dan strategi scaling yang terukur",
    becauseWhy: "Framework creative testing 100+ variasi hook setiap minggu",
    unlike: "Agensi branding tradisional yang hanya memikirkan estetika tanpa kaitan dengan penjualan",
    statement: "GrowthForge Studio adalah agensi creative performance untuk brand yang ingin skala omset dengan iklan berbasis konversi terukur."
  }
};

export const BRAND_PRESETS: BrandBrain[] = [
  sampleBrandTrajecto,
  sampleBrandKopiSenja,
  sampleBrandGrowthForge
];
