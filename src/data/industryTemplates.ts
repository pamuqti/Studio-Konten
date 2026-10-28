import { BrandBrain } from '../types';

export type IndustryKey =
  | 'fnb'
  | 'fashion'
  | 'beauty'
  | 'saas'
  | 'agency'
  | 'health'
  | 'property';

export type BusinessScaleKey = 'micro' | 'smb' | 'scaleup';

export interface IndustryTemplateMeta {
  id: string;
  name: string;
  industry: IndustryKey;
  industryLabel: string;
  scale: BusinessScaleKey;
  scaleLabel: string;
  scaleColor: string;
  scaleDesc: string;
  icon: string;
  accentColor: string;
  tagline: string;
  targetAudienceBrief: string;
  brand: BrandBrain;
}

export const INDUSTRY_CATEGORIES: { id: IndustryKey; label: string; icon: string }[] = [
  { id: 'fnb', label: 'Kuliner & F&B', icon: '☕' },
  { id: 'fashion', label: 'Fashion & Retail', icon: '👗' },
  { id: 'beauty', label: 'Kecantikan & Skincare', icon: '✨' },
  { id: 'saas', label: 'Teknologi & SaaS', icon: '💻' },
  { id: 'agency', label: 'Jasa & Agensi B2B', icon: '🚀' },
  { id: 'health', label: 'Kebugaran & Wellness', icon: '🥗' },
  { id: 'property', label: 'Properti & Interior', icon: '🏡' }
];

export const SCALE_LEVELS: { id: BusinessScaleKey; label: string; desc: string; badgeColor: string }[] = [
  {
    id: 'micro',
    label: 'Mikro / Solopreneur',
    desc: 'Owner-operator, tim 1-2 orang, fokus jualan cepat, kedekatan personal & organic trust',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'smb',
    label: 'UMKM Berkembang',
    desc: 'Tim 3-15 orang, omset ratusan juta, fokus diferensiasi USP & testing iklan digital',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'scaleup',
    label: 'Scale-Up / Nasional',
    desc: 'Tim mapan, multi-cabang/omnichannel, fokus brand authority, retention & loyalty',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  }
];

export interface IndustryServiceOption {
  id: string;
  name: string;
  icon: string;
  desc: string;
  sampleAudience: string;
  sampleUsp: string;
}

export const INDUSTRY_SERVICES_PRESETS: Record<IndustryKey, IndustryServiceOption[]> = {
  fnb: [
    {
      id: 'fnb-coffee',
      name: 'Kopi Susu Gula Aren & Beans Specialty',
      icon: '☕',
      desc: 'Minuman kopi harian dan biji kopi artisan sangrai lokal',
      sampleAudience: 'Pekerja WFH, Gen Z & milenial penikmat kopi berkualitas terjangkau',
      sampleUsp: '100% Biji kopi petani lokal dengan racikan susu fresh creamy seimbang'
    },
    {
      id: 'fnb-sambal',
      name: 'Sambal Kemasan & Lauk Frozen Siap Saji',
      icon: '🌶️',
      desc: 'Sambal artisan dan lauk siap santap praktis tahan lama',
      sampleAudience: 'Ibu bekerja, anak kos, dan perantau yang rindu masakan rumah otentik',
      sampleUsp: 'Resep keluarga tanpa pengawet sintetis dengan isian lauk melimpah'
    },
    {
      id: 'fnb-catering',
      name: 'Katering Sehat & Diet Meal Prep',
      icon: '🍱',
      desc: 'Paket makan siang/malam terukur kalori dan nutrisi seimbang',
      sampleAudience: 'Pegawai kantoran sibuk yang ingin turun berat badan atau hidup bugar',
      sampleUsp: 'Menu berganti tiap hari dirancang ahli gizi, bebas MSG berlebih'
    },
    {
      id: 'fnb-bakery',
      name: 'Artisan Bakery & Pastry Premium',
      icon: '🥐',
      desc: 'Roti sourdough, croissant, dan hampers kue kering',
      sampleAudience: 'Pecinta kue premium, keluarga kelas menengah, dan pembeli hampers hadiah',
      sampleUsp: 'Menggunakan butter Prancis murni dengan proses fermentasi alami 24 jam'
    },
    {
      id: 'fnb-resto',
      name: 'Restoran Keluarga & Paket Prasmanan Event',
      icon: '🍲',
      desc: 'Tempat makan bersantap keluarga, gathering kantor & pesta',
      sampleAudience: 'Keluarga multi-generasi, komunitas, dan panitia event perusahaan',
      sampleUsp: 'Porsi besar ramah kantong, rasa otentik dengan area bermain anak luas'
    }
  ],
  fashion: [
    {
      id: 'fas-modest',
      name: 'Hijab Daily, Gamis & Modest Wear Muslimah',
      icon: '🧕',
      desc: 'Busana muslimah harian yang syar\'i, adem, dan trendi',
      sampleAudience: 'Muslimah modern usia 20-38 tahun aktif di kantor maupun rumah tangga',
      sampleUsp: 'Bahan katun serat bambu anti-gerah, jahitan butik, dan cutting ramah wudhu'
    },
    {
      id: 'fas-street',
      name: 'Streetwear, Graphic Tee & Oversized Apparel',
      icon: '👕',
      desc: 'Pakaian kasual bertema pop-culture, musik, dan skena urban',
      sampleAudience: 'Remaja dan dewasa muda 17-28 tahun yang ekspresif dan cinta kultur lokal',
      sampleUsp: 'Kain heavy cotton 235gsm tahan susut dengan sablon discharge bertekstur lembut'
    },
    {
      id: 'fas-shoes',
      name: 'Sneakers & Sepatu Kasual Lokal',
      icon: '👟',
      desc: 'Sepatu jalanan tahan banting produksi pengrajin lokal berstandar ekspor',
      sampleAudience: 'Pria & wanita komuter harian yang butuh sepatu awet dan stylish',
      sampleUsp: 'Insole memory foam empuk anti-pegal dengan sol vulcanized tahan slip'
    },
    {
      id: 'fas-formal',
      name: 'Pakaian Kerja & Kemeja Minimalis Smart-Casual',
      icon: '💼',
      desc: 'Kemeja ironless dan celana ankle fit untuk profesional kantoran',
      sampleAudience: 'Pekerja korporat dan startup usia 24-35 tahun',
      sampleUsp: 'Kain teknologi anti-kusut tanpa perlu setrika, rapi sepanjang hari'
    },
    {
      id: 'fas-wastra',
      name: 'Batik & Tenun Modern Kontemporer',
      icon: '🧵',
      desc: 'Pakaian formal etnik kontemporer untuk acara resmi dan harian',
      sampleAudience: 'Eksekutif, dosen, dan pecinta warisan budaya nusantara modern',
      sampleUsp: 'Motif batik tulis/cap eksklusif langsung dari pengrajin desa binaan'
    }
  ],
  beauty: [
    {
      id: 'bty-serum',
      name: 'Serum Pencerah & Skin Barrier Repair',
      icon: '💧',
      desc: 'Serum konsentrat aktif untuk kulit kusam, bekas jerawat, dan bruntusan',
      sampleAudience: 'Wanita & pria 18-35 tahun dengan masalah kulit sensitif dan warna tidak merata',
      sampleUsp: 'Formula dermatologis halal BPOM dengan Ceramide murni dan Niacinamide 10%'
    },
    {
      id: 'bty-sunscreen',
      name: 'Sunscreen Ringan Matte Anti-Whitecast',
      icon: '☀️',
      desc: 'Tabir surya harian SPF 50+ PA++++ yang ringan seperti air',
      sampleAudience: 'Remaja dan pekerja outdoor di iklim tropis Indonesia yang anti-lengket',
      sampleUsp: 'Water-based cooling gel tanpa residu putih, aman untuk kulit berjerawat'
    },
    {
      id: 'bty-clinic',
      name: 'Klinik Estetika & Facial Treatment',
      icon: '💆‍♀️',
      desc: 'Layanan perawatan kulit medis ditangani dokter estetika berpengalaman',
      sampleAudience: 'Wanita karier dan calon pengantin yang ingin hasil glowing terukur cepat',
      sampleUsp: 'Teknologi laser & peeling standar medis Eropa dengan konsultasi dokter gratis'
    },
    {
      id: 'bty-makeup',
      name: 'Lip Tint & Cushion Make-up Natural',
      icon: '💄',
      desc: 'Riasan wajah harian ringan untuk tampilan no-makeup makeup look',
      sampleAudience: 'Mahasiswi dan Gen Z yang suka kepraktisan dan hasil akhir bibir lembap alami',
      sampleUsp: 'Tahan 12 jam transferproof diperkaya vitamin E dan minyak jojoba'
    },
    {
      id: 'bty-organic',
      name: 'Skincare Herbal Alami & Sabun Organik',
      icon: '🌿',
      desc: 'Perawatan tubuh dan wajah berbahan dasar tumbuhan lokal tanpa kimia sintetis',
      sampleAudience: 'Penggemar clean beauty, ibu hamil/menyusui, dan pemilik kulit alergi parah',
      sampleUsp: 'Bebas paraben, sulfat, alkohol, dan SLS, 100% biodegradable ramah lingkungan'
    }
  ],
  saas: [
    {
      id: 'saas-prod',
      name: 'Aplikasi Manajemen Tugas & Kalender Tim',
      icon: '📱',
      desc: 'Software produktivitas harian untuk freelancer, remote worker, dan agensi',
      sampleAudience: 'Freelancer, digital nomad, dan manajer proyek tim kecil',
      sampleUsp: 'Simpel tanpa konfigurasi rumit, sinkronisasi kalender instan dalam 1 klik'
    },
    {
      id: 'saas-pos',
      name: 'Software POS Kasir & Inventori Toko Retail',
      icon: '💻',
      desc: 'Aplikasi kasir multi-cabang dengan laporan laba rugi otomatis',
      sampleAudience: 'Pemilik kedai kopi, resto, butik, dan minimarket retail',
      sampleUsp: 'Bisa beroperasi offline saat mati internet, dashboard owner via WhatsApp'
    },
    {
      id: 'saas-analytics',
      name: 'Platform Dashboard Analitik & Laporan Iklan',
      icon: '📊',
      desc: 'Otomasi agregasi data penjualan dari TikTok Shop, Shopee, dan Meta Ads',
      sampleAudience: 'Brand owner D2C dan media buyer agensi periklanan',
      sampleUsp: 'Tarik laporan multi-channel otomatis tiap jam tanpa export spreadsheet manual'
    },
    {
      id: 'saas-ai',
      name: 'Chatbot AI Customer Service & Lead Capture',
      icon: '🤖',
      desc: 'Asisten AI WhatsApp yang melayani pertanyaan pelanggan 24/7 dan close sales',
      sampleAudience: 'Toko online dan bisnis jasa dengan volume chat pelanggan tinggi',
      sampleUsp: 'Bahasa Indonesia natural dan sopan, terintegrasi cek ongkir & pembayaran QRIS'
    },
    {
      id: 'saas-lms',
      name: 'LMS Platform Kursus Online & Komunitas',
      icon: '🎓',
      desc: 'Platform hosting video edukasi berbayar dengan proteksi anti-bajak',
      sampleAudience: 'Edukator, kreator konten, coach, dan lembaga bimbingan belajar',
      sampleUsp: 'Streaming adaptif hemat kuota dengan sistem sertifikasi otomatis dan gamifikasi'
    }
  ],
  agency: [
    {
      id: 'agy-social',
      name: 'Jasa Kelola Konten & Reels Media Sosial',
      icon: '🎨',
      desc: 'End-to-end copywriting, produksi video pendek, desain feed, dan posting harian',
      sampleAudience: 'Owner bisnis sibuk yang ingin akun medsosnya aktif dan menghasilkan leads',
      sampleUsp: 'Tim khusus desainer & copywriter dengan garansi revisi sampai puas'
    },
    {
      id: 'agy-ads',
      name: 'Performance Marketing & Iklan Berbayar',
      icon: '📈',
      desc: 'Manajemen kampanye Meta Ads, Google Ads, dan TikTok Ads berbasis ROAS terukur',
      sampleAudience: 'Brand e-commerce dan klinik jasa yang butuh pertumbuhan omset terukur',
      sampleUsp: 'Formula testing kreatif berbasis data dengan target ROAS minimal 3.5x'
    },
    {
      id: 'agy-web',
      name: 'Jasa Pembuatan Website & Aplikasi Web',
      icon: '🌐',
      desc: 'Desain web landing page konversi tinggi dan portal perusahaan profesional',
      sampleAudience: 'Perusahaan B2B, konsultan profesional, dan startup',
      sampleUsp: 'Kecepatan loading Google PageSpeed 90+, SEO-ready, dan mobile responsive mutlak'
    },
    {
      id: 'agy-video',
      name: 'Produksi Foto Komersial & Video Promosi',
      icon: '📸',
      desc: 'Foto katalog produk, video profil perusahaan, dan materi iklan sinematik',
      sampleAudience: 'Brand retail, F&B, dan manufaktur yang ingin naik kelas premium',
      sampleUsp: 'Studio sendiri lengkap dengan model profesional dan tata cahaya standar sinema'
    },
    {
      id: 'agy-legal',
      name: 'Konsultasi Perizinan, HAKI & Pajak Bisnis',
      icon: '📑',
      desc: 'Pendirian PT/CV, pendaftaran merek dagang BPOM/Halal, dan pembukuan pajak',
      sampleAudience: 'Founder UMKM yang ingin usahanya legal, aman, dan siap ekspansi',
      sampleUsp: 'Transparan tanpa biaya tersembunyi, pendampingan legal full sampai terbit'
    }
  ],
  health: [
    {
      id: 'hlt-gym',
      name: 'Membership Gym & Private Personal Trainer',
      icon: '🏋️',
      desc: 'Pusat kebugaran lengkap dengan bimbingan pelatih fisik profesional berlisensi',
      sampleAudience: 'Pria dan wanita urban yang ingin membentuk tubuh ideal dan stamina prima',
      sampleUsp: 'Alat beban impor standar atletik internasional tanpa biaya pendaftaran tersembunyi'
    },
    {
      id: 'hlt-yoga',
      name: 'Studio Yoga, Pilates & Posture Correction',
      icon: '🧘‍♀️',
      desc: 'Kelas pemulihan postur tubuh, pernapasan, dan fleksibilitas tulang belakang',
      sampleAudience: 'Pekerja kantoran yang sering sakit pinggang, leher kaku, dan stres mental',
      sampleUsp: 'Kelas privat privat maksimal 4 orang dengan instruktur bersertifikasi internasional'
    },
    {
      id: 'hlt-nutrition',
      name: 'Konsultasi Gizi & Katering Diet Klinis',
      icon: '🥗',
      desc: 'Program pendampingan makan sehat untuk diabetes, kolesterol, dan fat-loss',
      sampleAudience: 'Individu dengan riwayat medis metabolik dan pejuang penurunan berat badan',
      sampleUsp: 'Dipantau langsung nutrisionis via WhatsApp setiap hari dengan menu lezat'
    },
    {
      id: 'hlt-supplement',
      name: 'Suplemen Kesehatan & Protein Shake',
      icon: '💊',
      desc: 'Whey protein, multivitamin, dan asam amino bersertifikasi BPOM & Halal',
      sampleAudience: 'Penggiat fitness, olahragawan, dan masyarakat yang peduli daya tahan tubuh',
      sampleUsp: 'Rasa enak tanpa pemanis buatan berbahaya, mudah larut tanpa gumpalan'
    }
  ],
  property: [
    {
      id: 'prp-interior',
      name: 'Jasa Desain Interior & Renovasi Rumah',
      icon: '🛋️',
      desc: 'Pembuatan kitchen set, custom wardrobe, dan desain ruang interior estetik',
      sampleAudience: 'Pemilik rumah baru, pasangan muda, dan pemilik unit apartemen sewa',
      sampleUsp: 'Visual 3D gratis, bahan kayu solid anti-rayap dengan garansi pengerjaan 1 tahun'
    },
    {
      id: 'prp-housing',
      name: 'Perumahan Cluster Minimalis Modern',
      icon: '🏡',
      desc: 'Hunian asri dengan sistem satu pintu (one gate system) dan fasilitas lengkap',
      sampleAudience: 'Keluarga muda first-home buyer yang mencari lokasi strategis dekat stasiun/tol',
      sampleUsp: 'DP 0%, cicilan ringan terjangkau bank BUMN, bebas biaya akad & surat-surat'
    },
    {
      id: 'prp-builder',
      name: 'Kontraktor Bangun Rumah Borongan Amanah',
      icon: '🧱',
      desc: 'Jasa arsitektur dan konstruksi bangun baru maupun tambah lantai',
      sampleAudience: 'Pemilik tanah kavling yang ingin membangun rumah impian bebas stres',
      sampleUsp: 'RAB transparan, mandor berpengalaman, laporan progres foto/video harian via WA'
    },
    {
      id: 'prp-kost',
      name: 'Sewa Kost Eksklusif & Co-Living Space',
      icon: '🏢',
      desc: 'Kamar sewa full-furnished dengan WiFi kencang, kamar mandi dalam, dan security 24 jam',
      sampleAudience: 'Mahasiswa dan karyawan kantoran perantau',
      sampleUsp: 'Lokasi jalan kaki ke perkantoran/kampus, bebas jam malam, bersih & nyaman'
    }
  ]
};

export const INDUSTRY_BRAND_TEMPLATES: IndustryTemplateMeta[] = [
  // 1. F&B - MIKRO
  {
    id: 'tpl-fnb-micro',
    name: 'Sambal Oma Hayati',
    industry: 'fnb',
    industryLabel: 'Kuliner & F&B',
    scale: 'micro',
    scaleLabel: 'Mikro / Solopreneur',
    scaleColor: '#059669',
    scaleDesc: 'Produsen sambal kemasan rumahan & frozen lauk siap saji via WhatsApp & marketplace',
    icon: '🌶️',
    accentColor: '#dc2626',
    tagline: 'Resep Asli Warisan Nenek Tanpa Pengawet Buatan',
    targetAudienceBrief: 'Ibu pekerja & anak kost yang rindu masakan rumah praktis',
    brand: {
      name: 'Sambal Oma Hayati',
      category: 'Kuliner Rumahan & Sambal Kemasan Artisan',
      industry: 'Kuliner & F&B',
      scale: 'micro',
      scaleLabel: 'Mikro / Solopreneur',
      product: 'Sambal Cumi Asin Pedas Manis, Sambal Bawang Klotok, & Paru Balado Frozen Kemasan Kaca',
      brandPromise: 'Menghadirkan kehangatan lauk rumah asli tanpa repot ngulek dan tanpa pengawet sintetis.',
      mission: 'Membantu keluarga sibuk dan perantau makan enak dan kenyang dalam 3 menit.',
      values: ['Bahan Segar Pasar Lokal', 'Tanpa MSG Berlebih', 'Pedas Gurih Bikin Nambah'],
      audience: 'Ibu bekerja 25-40 tahun, pekerja kantoran, dan mahasiswa perantau yang butuh lauk praktis siap santap',
      tone: 'Hangat, merangkul, ceplas-ceplos ramah seperti ibu sendiri yang senang melihat anaknya makan lahap',
      usp: 'Dibuat fresh setiap hari dengan minyak kelapa pilihan dan isian cumi/lauk yang melimpah bukan cuma cabai',
      cta: 'Pesan stok lauk minggu ini via WhatsApp di link bio kami!',
      color: '#dc2626',
      instagramHandle: '@sambal.omahayati',
      positioning: {
        weAre: 'Artisan Home-Cooked Sambal & Lauk Kemasan',
        forAudience: 'Anak kost dan ibu pekerja sibuk',
        whoNeed: 'Lauk pendamping nasi yang pedas gurih otentik tanpa perlu masak',
        becauseWhy: 'Dimasak lambat (slow-cooked) dengan resep keluarga turun-temurun 30 tahun',
        unlike: 'Sambal pabrikan kaleng yang asin kimiawi dan minim isian lauk',
        statement: 'Sambal Oma Hayati adalah penyelamat nafsu makan harian untuk orang sibuk yang rindu masakan rumah otentik.'
      },
      personalityVoice: {
        humanPersona: 'Oma atau Ibu yang hobi masak dan selalu memastikan tamu atau anaknya makan kenyang'
      },
      contentDNA: {
        pillars: [
          { name: 'Behind The Kitchen (Proses Masak)', percentage: 35, description: 'Proses cuci cumi segar, ngulek cabai, minyak mendidih yang menggugah selera (ASMR)' },
          { name: 'Ulasan & Mukbang Pelanggan', percentage: 30, description: 'Video jujur pembeli makan sambal campur telur ceplok dan nasi panas ngebul' },
          { name: 'Edukasi Penyimpanan & Tips Masak', percentage: 20, description: 'Cara simpan agar awet 1 bulan di freezer, ide kreasi nasi goreng sambal' },
          { name: 'Promo & Pengiriman Mingguan', percentage: 15, description: 'Slot batch masak baru, diskon ongkir, info restock' }
        ]
      }
    }
  },

  // 2. F&B - UMKM
  {
    id: 'tpl-fnb-smb',
    name: 'Kopi Senja Roastery',
    industry: 'fnb',
    industryLabel: 'Kuliner & F&B',
    scale: 'smb',
    scaleLabel: 'UMKM Berkembang',
    scaleColor: '#d97706',
    scaleDesc: 'Kedai kopi specialty lokal 2 cabang & roastery biji kopi arabika single origin',
    icon: '☕',
    accentColor: '#b45309',
    tagline: 'Kopi Specialty Jujur dari Petani Lokal, Ramah di Lambung & Kantong',
    targetAudienceBrief: 'Pekerja kreatif, remote worker, dan mahasiswa 20-38 tahun',
    brand: {
      name: 'Kopi Senja Roastery',
      category: 'Artisan Neighborhood Coffee Shop & Micro-Roastery',
      industry: 'Kuliner & F&B',
      scale: 'smb',
      scaleLabel: 'UMKM Berkembang',
      product: 'Biji Kopi Arabika Specialty Single Origin, Cold Brew Kaleng 250ml, & Kopi Susu Gula Aren Organik',
      brandPromise: 'Menikmati kopi specialty tanpa rasa terintimidasi istilah rumit dan tanpa bikin asam lambung kumat.',
      mission: 'Menghubungkan petani kopi lokal langsung ke cangkir pecinta kopi harian dengan harga masuk akal.',
      values: ['Fair Trade Petani Lokal', 'Roasting Batch Kecil Mingguan', 'Ruang Nyaman Tanpa Bising'],
      audience: 'Penikmat kopi harian, freelancer remote, dan pekerja kantoran yang mencari kopi arabika ramah lambung',
      tone: 'Hangat, santai, puitis tapi membumi, ramah layaknya barista langganan yang hafal pesanan Anda',
      usp: 'Biji kopi lokal 100% specialty di-roast mingguan dengan profil rasa manis alami buah tanpa perisa buatan',
      cta: 'Mampir ke kedai kami sore ini atau pesan beans segar via marketplace di bio!',
      color: '#b45309',
      instagramHandle: '@kopisenja.roastery',
      positioning: {
        weAre: 'Specialty Neighborhood Coffee Roastery',
        forAudience: 'Pecinta kopi harian yang sadar kualitas',
        whoNeed: 'Kopi nikmat yang aman diminum setiap hari tanpa perut mual',
        becauseWhy: 'Diproses dari biji petik merah arabika Nusantara dengan profil sangrai medium seimbang',
        unlike: 'Kopi sachet tinggi pengawet atau kafe waralaba mahal yang mengandalkan sirup buatan',
        statement: 'Kopi Senja adalah roastery ramah lingkungan untuk penikmat kopi yang mencari rasa jujur dan tempat teduh untuk berkarya.'
      }
    }
  },

  // 3. F&B - SCALE-UP
  {
    id: 'tpl-fnb-scaleup',
    name: 'Nusantara Rasa Boga',
    industry: 'fnb',
    industryLabel: 'Kuliner & F&B',
    scale: 'scaleup',
    scaleLabel: 'Scale-Up / Nasional',
    scaleColor: '#7c3aed',
    scaleDesc: 'Jaringan casual dining masakan Nusantara modern dengan 18 outlet di kota-kota besar',
    icon: '🍲',
    accentColor: '#0f766e',
    tagline: 'Eksplorasi Cita Rasa Autentik Rempah Nusantara dalam Suasana Modern',
    targetAudienceBrief: 'Keluarga modern, ekspatriat, dan profesional untuk jamuan makan & reuni',
    brand: {
      name: 'Nusantara Rasa Boga',
      category: 'Modern Indonesian Casual Dining Restaurant Group',
      industry: 'Kuliner & F&B',
      scale: 'scaleup',
      scaleLabel: 'Scale-Up / Nasional',
      product: 'Menu Signature Nusantara: Bebek Betutu Asap 12 Jam, Ikan Bakar Jimbaran, Rendang Tok Sengkel, Aneka Es Tradisional',
      brandPromise: 'Standar kualitas rasa rempah pusaka yang konsisten lezat di seluruh cabang dengan higienitas bintang lima.',
      mission: 'Mengangkat kuliner warisan Indonesia ke panggung gaya hidup modern berstandar internasional.',
      values: ['Konsistensi Rasa Standar Chef', 'Rempah Asli 34 Provinsi', 'Keramahan Budaya Indonesia'],
      audience: 'Keluarga mapan, eksekutif bisnis untuk jamuan klien, dan generasi muda penikmat kuliner berkelas',
      tone: 'Elegan, bangga akan budaya lokal, prestisius, namun tetap ramah dan mengundang selera',
      usp: 'Teknik masak tradisional kayu bakar dipadukan dengan standar dapur central kitchen bersertifikasi halal & ISO',
      cta: 'Reservasi meja keluarga Anda untuk akhir pekan ini via link reservasi online di bio!',
      color: '#0f766e',
      instagramHandle: '@nusantararasaboga',
      positioning: {
        weAre: 'Modern Indonesian Casual Dining Group',
        forAudience: 'Keluarga dan profesional Indonesia',
        whoNeed: 'Tempat jamuan makan masakan Nusantara yang representatif, nyaman, dan konsisten lezat',
        becauseWhy: 'Memiliki tim kurasi chef kuliner daerah dan standar bahan baku rempah langsung dari perkebunan binaan',
        unlike: 'Restoran tradisional biasa yang minim kenyamanan atau resto modern yang rasanya sudah tidak otentik',
        statement: 'Nusantara Rasa Boga adalah destinasi utama kuliner warisan Indonesia untuk merayakan momen kebersamaan berharga.'
      }
    }
  },

  // 4. FASHION - MIKRO
  {
    id: 'tpl-fashion-micro',
    name: 'Benang Lokal Rework',
    industry: 'fashion',
    industryLabel: 'Fashion & Retail',
    scale: 'micro',
    scaleLabel: 'Mikro / Solopreneur',
    scaleColor: '#059669',
    scaleDesc: 'Brand streetwear upcycling kustom 1-of-1 karya perancang mandiri di Instagram & TikTok',
    icon: '🧵',
    accentColor: '#0284c7',
    tagline: 'Pakaian Reworked 1-of-1: Gaya Unik Tanpa Menimbun Sampah Tekstil',
    targetAudienceBrief: 'Gen-Z & milenial penyuka streetwear alternatif yang anti pakaian pasaran',
    brand: {
      name: 'Benang Lokal Rework',
      category: 'Upcycled Streetwear & Custom Rework Apparel',
      industry: 'Fashion & Retail',
      scale: 'micro',
      scaleLabel: 'Mikro / Solopreneur',
      product: 'Jaket Denim Patchwork Vintage, Tote Bag Kain Sisa Kanvas, & Kemeja Flannel Sambung Dual-Tone',
      brandPromise: 'Pakaian unik yang tidak ada kembarannya di dunia, ramah bumi dan berkarakter kuat.',
      mission: 'Mengubah kain sisa dan pakaian vintage berkualitas menjadi karya seni streetwear fungsional.',
      values: ['Zero Fast-Fashion Waste', '1-of-1 Exclusivity', 'Jahitan Tangan Penuh Cerita'],
      audience: 'Gen Z dan Milenial usia 18-28 tahun yang menyukai estetika streetwear, thrift culture, dan gaya autentik',
      tone: 'Kreatif, santai, ekspresif, berani beda, dan berbicara dengan bahasa pop anak muda skena kreatif',
      usp: 'Setiap artikel baju hanya ada 1 piece di dunia, dibuat secara handmade dari material vintage pilihan',
      cta: 'Aktifkan notifikasi drop mingguan kami setiap Jumat malam di bio!',
      color: '#0284c7',
      instagramHandle: '@benanglokal.rework'
    }
  },

  // 5. FASHION - UMKM
  {
    id: 'tpl-fashion-smb',
    name: 'Sora Linen Everyday',
    industry: 'fashion',
    industryLabel: 'Fashion & Retail',
    scale: 'smb',
    scaleLabel: 'UMKM Berkembang',
    scaleColor: '#d97706',
    scaleDesc: 'Brand fashion linen minimalis untuk wanita karier & ibu muda dengan omset ratusan juta per bulan',
    icon: '👗',
    accentColor: '#854d0e',
    tagline: 'Kenyamanan Serat Alami Linen untuk Hari Aktif yang Elegan',
    targetAudienceBrief: 'Wanita 23-38 tahun, working mom & profesional yang butuh baju adem & rapi',
    brand: {
      name: 'Sora Linen Everyday',
      category: 'Minimalist Sustainable Linen Apparel',
      industry: 'Fashion & Retail',
      scale: 'smb',
      scaleLabel: 'UMKM Berkembang',
      product: 'Kemeja Linen Oversized Breathable, Kulot Linen Tali, Dress Santai Bumi, & Blazer Kasual Tanpa Furing',
      brandPromise: 'Pakaian yang terasa seringan angin tropis di kulit, awet bertahun-tahun, dan elegan tanpa ribet disetrika kaku.',
      mission: 'Menemani wanita Indonesia merasa nyaman dan percaya diri dalam potongan pakaian yang bernapas.',
      values: ['Serat Alami Ramah Kulit', 'Potongan Timeless Versatile', 'Jahitan Butik Rapi'],
      audience: 'Wanita modern usia 24-40 tahun, wanita karier WFH/hybrid, ibu muda yang menyukai estetika warna bumi (earth tone)',
      tone: 'Tenang, meneduhkan, anggun, bersahabat, menghargai keheningan dan kenyamanan hidup sederhana',
      usp: 'Dibuat dari 100% pure European linen yang diproses pre-wash sehingga tidak menciut dan makin lembut tiap dicuci',
      cta: 'Cek katalog koleksi kapsul terbaru kami di website atau Shopee bio!',
      color: '#854d0e',
      instagramHandle: '@soralinen'
    }
  },

  // 6. FASHION - SCALE-UP
  {
    id: 'tpl-fashion-scaleup',
    name: 'Aksara Hijab Official',
    industry: 'fashion',
    industryLabel: 'Fashion & Retail',
    scale: 'scaleup',
    scaleLabel: 'Scale-Up / Nasional',
    scaleColor: '#7c3aed',
    scaleDesc: 'Brand modest fashion & hijab skala nasional dengan 12 store mall & 80.000+ pelanggan aktif',
    icon: '🧕',
    accentColor: '#9333ea',
    tagline: 'Kemewahan Modest Wear yang Anggun, Praktis, & Mencerahkan Siluet Muslimah',
    targetAudienceBrief: 'Muslimah urban kelas menengah-atas untuk kebutuhan harian hingga hari raya',
    brand: {
      name: 'Aksara Hijab Official',
      category: 'Premium Modest Fashion & Lifestyle Brand',
      industry: 'Fashion & Retail',
      scale: 'scaleup',
      scaleLabel: 'Scale-Up / Nasional',
      product: 'Voal Miracle Hijab Ironless, Abaya Silk Monogram, Dress Brokat Syari Pesta, & Koleksi Sarimbit Keluarga',
      brandPromise: 'Tampil anggun mempesona dalam balutan busana santun dengan bahan premium yang sejuk dan tidak menerawang.',
      mission: 'Memberdayakan muslimah untuk mengekspresikan jati diri dan keanggunan iman melalui mode yang berkelas.',
      values: ['Kepatuhan Syariah yang Modis', 'Kualitas Jahitan Butik Skala Besar', 'Inovasi Kain Anti-Kusut'],
      audience: 'Muslimah aktif usia 22-48 tahun, ibu muda, mahasiswi dan profesional berhijab di seluruh Indonesia & Malaysia',
      tone: 'Inspiratif, santun, memancarkan kehangatan ukhuwah, anggun, berkelas seperti sahabat hijrah yang saling menyemangati',
      usp: 'Teknologi kain Ultrafine Voal eksklusif berteknologi laser-cut rapi dan wangi nano-perfume yang tahan seharian',
      cta: 'Koleksi edisi terbatas lebaran sudah tersedia di web & toko resmi mall terdekat!',
      color: '#9333ea',
      instagramHandle: '@aksarahijab.official'
    }
  },

  // 7. BEAUTY - MIKRO
  {
    id: 'tpl-beauty-micro',
    name: 'Botanica Soapworks',
    industry: 'beauty',
    industryLabel: 'Kecantikan & Skincare',
    scale: 'micro',
    scaleLabel: 'Mikro / Solopreneur',
    scaleColor: '#059669',
    scaleDesc: 'Sabun batang cold-process vegan & body oil buatan tangan untuk kulit sensitif & eksim',
    icon: '🧼',
    accentColor: '#059669',
    tagline: 'Sabun Mandi Artisan 100% Minyak Nabati, Sahabat Kulit Kering & Sensitif',
    targetAudienceBrief: 'Orang dengan kulit sensitif, ibu menyusui, dan pecinta produk natural',
    brand: {
      name: 'Botanica Soapworks',
      category: 'Artisan Natural Cold-Process Soap & Bodycare',
      industry: 'Kecantikan & Skincare',
      scale: 'micro',
      scaleLabel: 'Mikro / Solopreneur',
      product: 'Sabun Batang Oat Milk & Madu Lokal, Calendula Body Oil, & Lip Balm Cocoa Butter Tanpa Pewangi Sintetis',
      brandPromise: 'Kulit bersih lembap bebas gatal tanpa detergen kimia SLS atau paraben yang merusak barrier kulit.',
      mission: 'Menghadirkan ritual mandi yang merawat dan menenangkan jiwa dengan bahan-bahan pangan alami.',
      values: ['No SLS/SLES', 'Biodegradable & Palm-Free', 'Handcrafted in Small Batches'],
      audience: 'Penderita dermatitis/eksim, ibu hamil & menyusui, pecinta eco-living yang peduli kesehatan kulit',
      tone: 'Lembut, edukatif, jujur, mengayomi, mengedepankan keamanan dan kesehatan kulit jangka panjang',
      usp: 'Sabun diperam (curing) alami 6 minggu dari minyak zaitun murni dan susu oat segar tanpa pengharum buatan',
      cta: 'Pilih sabun alami yang sesuai jenis kulit Anda di marketplace link bio!',
      color: '#059669',
      instagramHandle: '@botanica.soapworks'
    }
  },

  // 8. BEAUTY - UMKM
  {
    id: 'tpl-beauty-smb',
    name: 'GlowLab D2C Skincare',
    industry: 'beauty',
    industryLabel: 'Kecantikan & Skincare',
    scale: 'smb',
    scaleLabel: 'UMKM Berkembang',
    scaleColor: '#d97706',
    scaleDesc: 'Brand skincare dermatologi lokal terjangkau fokus mengatasi jerawat & skin barrier rusak',
    icon: '✨',
    accentColor: '#db2777',
    tagline: 'Skincare Berbasis Sains Nyata, Efektif Tuntaskan Jerawat Tanpa Janji Palsu',
    targetAudienceBrief: 'Remaja & dewasa muda 18-30 tahun pejuang jerawat & bruntusan',
    brand: {
      name: 'GlowLab D2C Skincare',
      category: 'Clinical Dermatology & Active-Ingredient Skincare',
      industry: 'Kecantikan & Skincare',
      scale: 'smb',
      scaleLabel: 'UMKM Berkembang',
      product: 'Serum Salicylic Acid 2% + Zinc, Gel Pelembap Ceramide 5x Barrier Repair, & Sunscreen Hybrid SPF 50 PA++++',
      brandPromise: 'Kulit bersih dari jerawat meradang dalam 14 hari dengan formula aman BPOM dan harga ramah dompet.',
      mission: 'Mendemokratisasi akses skincare berkualitas dermatologi untuk generasi muda Indonesia.',
      values: ['Transparansi Persentase Zat Aktif', 'Bebas Alkohol & Parfum', 'Teruji Klinis BPOM & Halal'],
      audience: 'Acne fighter, mahasiswa, dan fresh graduate usia 17-29 tahun yang bingung memilih skincare efektif',
      tone: 'Cerdas berbasis data sains, ramah, to the point, empatik pada rasa minder akibat masalah jerawat',
      usp: 'Kombinasi bahan aktif klinis dengan ekstrak centella lokal yang menenangkan kemerahan tanpa bikin kulit kering mengelupas',
      cta: 'Coba Trial Kit 14 Hari Pejuang Jerawat sekarang via official store di bio!',
      color: '#db2777',
      instagramHandle: '@glowlab.skin'
    }
  },

  // 9. BEAUTY - SCALE-UP
  {
    id: 'tpl-beauty-scaleup',
    name: 'Dermacura Aesthetics & Clinic',
    industry: 'beauty',
    industryLabel: 'Kecantikan & Skincare',
    scale: 'scaleup',
    scaleLabel: 'Scale-Up / Nasional',
    scaleColor: '#7c3aed',
    scaleDesc: 'Jaringan klinik estetika medis 15 cabang dengan produk skincare dokter tersertifikasi BPOM',
    icon: '💎',
    accentColor: '#4f46e5',
    tagline: 'Perawatan Kulit Presisi Dokter Spesialis & Teknologi Estetika Terdepan Dunia',
    targetAudienceBrief: 'Pria & wanita 25-55 tahun yang mendambakan anti-aging & kulit glowing presisi',
    brand: {
      name: 'Dermacura Aesthetics & Clinic',
      category: 'Medical Aesthetics Clinic & Physician Skincare Line',
      industry: 'Kecantikan & Skincare',
      scale: 'scaleup',
      scaleLabel: 'Scale-Up / Nasional',
      product: 'Perawatan Laser Pico Rejuvenation, Skin Booster Salmon DNA, Botulinum & Skincare Medis Custom Dokter',
      brandPromise: 'Transformasi kulit sehat glowing dan awet muda di bawah pengawasan langsung dokter spesialis dermatologi.',
      mission: 'Memberikan solusi estetika medis yang aman, beretika, dan berbasis bukti ilmiah terverifikasi.',
      values: ['Keamanan Pasien Utama', 'Teknologi FDA-Approved', 'Hasil Alami Tanpa Ketergantungan'],
      audience: 'Profesional karier, pengusaha, ibu rumah tangga mapan usia 25-55 tahun yang mengutamakan hasil nyata bergaransi medis',
      tone: 'Otoritatif, menenangkan, terpercaya, elegan, mengedepankan edukasi medis yang kredibel',
      usp: 'Seluruh dokter telah tersertifikasi internasional dan alat laser langsung berlisensi FDA Amerika Serikat',
      cta: 'Jadwalkan konsultasi dokter gratis pertama Anda di cabang klinik terdekat via bio!',
      color: '#4f46e5',
      instagramHandle: '@dermacuraclinic'
    }
  },

  // 10. SAAS & TEKNOLOGI - MIKRO
  {
    id: 'tpl-saas-micro',
    name: 'Trajecto Focus OS',
    industry: 'saas',
    industryLabel: 'Teknologi & SaaS',
    scale: 'micro',
    scaleLabel: 'Mikro / Solopreneur',
    scaleColor: '#059669',
    scaleDesc: 'Aplikasi web time-blocking & agile sprint personal karya solo indie-hacker untuk freelancer',
    icon: '⚡',
    accentColor: '#0284c7',
    tagline: 'Sprint 1-Hari & Time Blocking: Kerja Beres Sebelum Jam 5 Sore',
    targetAudienceBrief: 'Freelancer, remote worker, dan solopreneur yang lelah to-do list berantakan',
    brand: {
      name: 'Trajecto',
      category: 'Aplikasi Produktivitas & Life Planner Digital',
      industry: 'Teknologi & SaaS',
      scale: 'micro',
      scaleLabel: 'Mikro / Solopreneur',
      product: 'Personal Agile Sprint Browser App, Interactive Visual Time-Blocker, & Weekly Review Automation',
      brandPromise: 'Menyelesaikan 3 tugas prioritas terpenting hari ini tanpa stres dan tanpa repot setup database Notion berjam-jam.',
      mission: 'Membebaskan kreator mandiri dari ilusi produktif menuju eksekusi nyata yang tenang.',
      values: ['Zero-Setup Bloatware', 'Eksekusi > Estetika Semu', 'Kerja Beres, Hidup Tenang'],
      audience: 'Freelancer, UI/UX designer, software engineer, dan kreator konten mandiri usia 22-35 tahun',
      tone: 'Santai, lugas, jujur (no-BS), relatable seperti rekan kerja pintar yang benci rapat bertele-tele',
      usp: 'Buka browser langsung pakai dalam 10 detik, bayar sekali via QRIS tanpa kartu kredit luar negeri',
      cta: 'Coba sprint gratis pertama lo hari ini di trajecto.web.app!',
      color: '#0284c7',
      instagramHandle: '@trajecto.app'
    }
  },

  // 11. SAAS & TEKNOLOGI - UMKM
  {
    id: 'tpl-saas-smb',
    name: 'KasirKilat Cloud POS',
    industry: 'saas',
    industryLabel: 'Teknologi & SaaS',
    scale: 'smb',
    scaleLabel: 'UMKM Berkembang',
    scaleColor: '#d97706',
    scaleDesc: 'Aplikasi kasir online & manajemen stok untuk toko retail, kafe, dan barbershop',
    icon: '🧾',
    accentColor: '#0284c7',
    tagline: 'Pantau Omset Toko & Stok Habis Otomatis dari HP, Bebas Kebocoran Kasir',
    targetAudienceBrief: 'Pemilik toko retail, coffee shop, laundry, dan bisnis kuliner lokal',
    brand: {
      name: 'KasirKilat Cloud POS',
      category: 'Cloud Point of Sale & Inventory Management for SMBs',
      industry: 'Teknologi & SaaS',
      scale: 'smb',
      scaleLabel: 'UMKM Berkembang',
      product: 'Aplikasi Android/iOS Kasir POS, Dashboard Laporan Laba Rugi Realtime, & Notifikasi WhatsApp Stok Menipis',
      brandPromise: 'Kelola kasir banyak cabang dari mana saja tanpa takut kasir curang dan tanpa pusing hitung stok manual.',
      mission: 'Memberikan teknologi manajemen toko modern yang mudah dioperasikan staf dalam 5 menit.',
      values: ['Mudah Dipakai Karyawan Baru', 'Dukungan Pelanggan 24/7', 'Aman dari Manipulasi Kasir'],
      audience: 'Pemilik UMKM toko fisik, resto kecil, kafe, dan barbershop usia 25-50 tahun yang sering tidak di toko',
      tone: 'Praktis, solusi bisnis nyata, meyakinkan, suportif terhadap perjuangan pengusaha lokal',
      usp: 'Bisa tetap transaksi saat internet mati (offline mode) dan terintegrasi QRIS dinamis instan tanpa biaya mesin sewa',
      cta: 'Daftar demo gratis 14 hari sekarang tanpa komitmen di link bio!',
      color: '#0284c7',
      website: 'https://kasirkilat.id'
    }
  },

  // 12. SAAS & TEKNOLOGI - SCALE-UP
  {
    id: 'tpl-saas-scaleup',
    name: 'TalentaHub Enterprise HRIS',
    industry: 'saas',
    industryLabel: 'Teknologi & SaaS',
    scale: 'scaleup',
    scaleLabel: 'Scale-Up / Nasional',
    scaleColor: '#7c3aed',
    scaleDesc: 'Platform HRIS & otomatisasi payroll end-to-end yang melayani 400+ korporasi & startup',
    icon: '👥',
    accentColor: '#1d4ed8',
    tagline: 'Platform Human Capital Terintegrasi: Penggajian, Pajak PPh21, & Performa Karyawan Presisi',
    targetAudienceBrief: 'Direktur HR, CFO, dan HR Manager perusahaan 100 - 5.000 karyawan',
    brand: {
      name: 'TalentaHub Enterprise',
      category: 'Enterprise Human Resource Information System (HRIS)',
      industry: 'Teknologi & SaaS',
      scale: 'scaleup',
      scaleLabel: 'Scale-Up / Nasional',
      product: 'Modul Payroll Terintegrasi BPJS & PPh21, Absensi Geotagging WFH/WFO, & Performance Review KPI 360',
      brandPromise: 'Memangkas waktu proses payroll bulanan dari 5 hari menjadi 15 menit dengan akurasi kepatuhan pajak 100%.',
      mission: 'Mengotomatisasi beban administrasi HR agar pemimpin perusahaan dapat fokus mengembangkan talenta manusia.',
      values: ['Keamanan Data ISO 27001', 'Kepatuhan Regulasi Ketenagakerjaan RI', 'Akurasi Finansial Tanpa Cacat'],
      audience: 'CHRO, HR Director, Finance Manager, dan CEO perusahaan bertumbuh dan korporasi menengah-besar',
      tone: 'Korporat profesional, kredibel, berbasis bukti regulasi, solutif terhadap efisiensi biaya operasional',
      usp: 'Satu-satunya HRIS lokal yang terhubung langsung dengan core-banking bank BUKU IV untuk pencairan gaji instan 1 klik',
      cta: 'Jadwalkan sesi konsultasi sistem & live demo eksklusif bersama tim konsultan kami di bio!',
      color: '#1d4ed8',
      website: 'https://talentahub.co.id'
    }
  },

  // 13. AGENSI & JASA B2B - MIKRO
  {
    id: 'tpl-agency-micro',
    name: 'VisualCraft Studio',
    industry: 'agency',
    industryLabel: 'Jasa & Agensi B2B',
    scale: 'micro',
    scaleLabel: 'Mikro / Solopreneur',
    scaleColor: '#059669',
    scaleDesc: 'Freelance desainer visual identity & landing page konversi tinggi untuk founder startup',
    icon: '🎨',
    accentColor: '#d97706',
    tagline: 'Desain Brand Identity & Landing Page Bersih yang Mengubah Pengunjung Jadi Pembeli',
    targetAudienceBrief: 'Founder startup rintisan, solopreneur, dan pemilik bisnis digital',
    brand: {
      name: 'VisualCraft Studio',
      category: 'Boutique Brand Identity & Web UI/UX Design',
      industry: 'Jasa & Agensi B2B',
      scale: 'micro',
      scaleLabel: 'Mikro / Solopreneur',
      product: 'Paket Brand Identity Lengkap (Logo, Color, Font Guidelines), Desain Web Landing Page Figma, & Pitch Deck Desain',
      brandPromise: 'Tampilan visual brand premium berkelas dunia yang selesai dalam 14 hari kerja tanpa drama revisi berlarut.',
      mission: 'Membantu founder lokal memiliki wajah brand profesional yang setara dengan startup Silicon Valley.',
      values: ['Fokus Pada Konversi Bisnis', 'Estetika Bersih Modern', 'Komunikasi Terbuka & Tepat Waktu'],
      audience: 'Founder startup tahap awal, kreator produk digital, dan agensi yang membutuhkan bantuan desainer spesialis',
      tone: 'Kreatif, tajam, profesional tapi santai, mengerti bahasa metrik bisnis dan estetika visual',
      usp: 'Desain tidak hanya cantik tapi diuji berdasarkan psikologi eye-tracking dan hierarki konversi penjualan',
      cta: 'Lihat portofolio case study kami dan amankan slot sprint desain bulan ini di bio!',
      color: '#d97706',
      website: 'https://visualcraft.id'
    }
  },

  // 14. AGENSI & JASA B2B - UMKM
  {
    id: 'tpl-agency-smb',
    name: 'GrowthForge Studio',
    industry: 'agency',
    industryLabel: 'Jasa & Agensi B2B',
    scale: 'smb',
    scaleLabel: 'UMKM Berkembang',
    scaleColor: '#d97706',
    scaleDesc: 'Creative performance marketing agency spesialis iklan video TikTok & Reels berkonversi tinggi',
    icon: '🚀',
    accentColor: '#7c3aed',
    tagline: 'Framework Creative Testing Video Pendek: Hasilkan 4x ROAS Iklan Berkelanjutan',
    targetAudienceBrief: 'Pemilik brand D2C lokal, e-commerce, dan Head of Marketing dengan budget iklan bulanan Rp 20jt-200jt',
    brand: {
      name: 'GrowthForge Studio',
      category: 'Creative Performance & Short-Form Video Ads Agency',
      industry: 'Jasa & Agensi B2B',
      scale: 'smb',
      scaleLabel: 'UMKM Berkembang',
      product: 'Produksi 30 Video Iklan UGC Kreatif per Bulan, Media Buying Meta & TikTok Ads, serta Audit Funnel Konversi',
      brandPromise: 'Menghentikan pemborosan budget iklan dengan iklan video yang memicu checkout nyata bukan sekadar views semu.',
      mission: 'Menjadi akselerator pertumbuhan pendapatan bagi 100+ brand lokal kebanggaan Indonesia.',
      values: ['Data-Driven Creative Iteration', 'ROAS Nyata > Vanity Metrics', 'Transparansi Budget Iklan'],
      audience: 'Founder brand e-commerce, Chief Marketing Officer, dan pemilik brand fesyen/skincare yang ingin scale-up omset',
      tone: 'Percaya diri, data-driven, tajam, berani, solutif, membenci teori branding tanpa dampak omset',
      usp: 'Memiliki studio riset in-house dengan database 5.000+ hook video viral yang siap diadaptasi ke produk Anda',
      cta: 'Klaim sesi audit performa iklan 30 menit gratis bersama tim strategist kami di bio!',
      color: '#7c3aed',
      website: 'https://growthforge.agency'
    }
  },

  // 15. KESEHATAN & WELLNESS - MIKRO & UMKM
  {
    id: 'tpl-health-smb',
    name: 'FitBites Healthy Kitchen',
    industry: 'health',
    industryLabel: 'Kebugaran & Wellness',
    scale: 'smb',
    scaleLabel: 'UMKM Berkembang',
    scaleColor: '#d97706',
    scaleDesc: 'Katering makanan sehat harian terukur kalori & nutrisi dengan langganan mingguan ke kantor',
    icon: '🥗',
    accentColor: '#16a34a',
    tagline: 'Makan Sehat Kalori Terukur yang Beneran Enak, Turun Berat Badan Tanpa Kelaparan',
    targetAudienceBrief: 'Pekerja kantor dan individu 22-45 tahun yang ingin diet sehat tanpa repot masak',
    brand: {
      name: 'FitBites Healthy Kitchen',
      category: 'Healthy Meal Prep & Nutrition Catering',
      industry: 'Kebugaran & Wellness',
      scale: 'smb',
      scaleLabel: 'UMKM Berkembang',
      product: 'Paket Katering Diet Fat Loss (350-450 kalori), Paket Muscle Gain Tinggi Protein, & Salad Box Saus Buah Alami',
      brandPromise: 'Turun 2-4 kg dalam sebulan dengan makanan lezat yang dimasak chef berpengalaman tanpa rasa hambar.',
      mission: 'Mengubah stigma makanan sehat itu hambar menjadi pengalaman makan yang dinanti-nanti setiap hari.',
      values: ['Perhitungan Makronutrisi Presisi', 'Bahan Segar Tanpa Minyak Jenuh', 'Pengantaran Tepat Waktu'],
      audience: 'Karyawan kantor, ibu muda pasca melahirkan, dan pegiat gym yang tidak punya waktu memasak menu diet',
      tone: 'Menyemangati, energik, edukatif soal nutrisi, hangat tanpa menghakimi bentuk tubuh pelanggan',
      usp: 'Setiap menu dihitung langsung oleh ahli gizi bersertifikat dan dimasak tanpa deep-fry dengan rasa rempah kaya',
      cta: 'Daftar meal plan Senin depan sebelum kuota batch dapur penuh di link bio!',
      color: '#16a34a',
      instagramHandle: '@fitbites.kitchen'
    }
  },

  // 16. PROPERTI & INTERIOR - UMKM
  {
    id: 'tpl-property-smb',
    name: 'RuangNol Interior & Build',
    industry: 'property',
    industryLabel: 'Properti & Interior',
    scale: 'smb',
    scaleLabel: 'UMKM Berkembang',
    scaleColor: '#d97706',
    scaleDesc: 'Studio desain interior & kontraktor renovasi rumah/apartemen estetik konsep Japandi & Modern Tropis',
    icon: '🏡',
    accentColor: '#0f766e',
    tagline: 'Ubah Rumah Impian Jadi Kenyataan: Desain Japandi Nyaman & Garansi Pengerjaan Tepat Waktu',
    targetAudienceBrief: 'Pasangan muda milenial baru menikah & pemilik rumah pertama',
    brand: {
      name: 'RuangNol Interior & Build',
      category: 'Residential Interior Design & Custom Furniture Contractor',
      industry: 'Properti & Interior',
      scale: 'smb',
      scaleLabel: 'UMKM Berkembang',
      product: 'Paket Desain Interior 3D Realistis, Pembuatan Kitchen Set Custom HPL/Duco, & Renovasi Total Rumah Tinggal',
      brandPromise: 'Mewujudkan hunian yang rapi, luas, dan menenangkan dengan transparansi anggaran tanpa biaya siluman.',
      mission: 'Membantu keluarga muda memiliki rumah yang menjadi tempat pulang ternyaman setelah lelah bekerja.',
      values: ['Transparansi Rencana Anggaran Biaya (RAB)', 'Garansi Konstruksi 12 Bulan', 'Pemanfaatan Ruang Cerdas'],
      audience: 'Pasangan baru menikah, pemilik rumah cluster baru, dan profesional usia 26-42 tahun di kota satelit',
      tone: 'Menghargai keindahan rumah, terpercaya, mendengarkan kebutuhan keluarga, solutif terhadap anggaran',
      usp: 'Menyediakan visualisasi 3D VR interaktif sebelum pengerjaan dan workshop mebel in-house dengan kontrol kualitas ketat',
      cta: 'Konsultasikan denah rumah Anda secara gratis dan dapatkan estimasi RAB awal di bio kami!',
      color: '#0f766e',
      website: 'https://ruangnol.id'
    }
  }
];
