import { SocialPlatformKey } from '../types';

export interface PlatformMeta {
  key: SocialPlatformKey;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  defaultTime: string;
  specs: {
    maxCaptionLength: number;
    recommendedAspectRatio: string[];
    maxVideoDurationSec: number;
    supportedMedia: ('image' | 'video' | 'carousel')[];
    nativeScheduleSupported: boolean;
  };
}

export const PLATFORMS_META: Record<SocialPlatformKey, PlatformMeta> = {
  instagram: {
    key: 'instagram',
    name: 'Instagram',
    shortName: 'IG',
    icon: '📸',
    color: '#e1306c',
    badgeBg: 'bg-pink-50',
    badgeBorder: 'border-pink-200',
    badgeText: 'text-pink-700',
    defaultTime: '19:00',
    specs: {
      maxCaptionLength: 2200,
      recommendedAspectRatio: ['9:16', '1:1', '4:5'],
      maxVideoDurationSec: 900,
      supportedMedia: ['image', 'video', 'carousel'],
      nativeScheduleSupported: false
    }
  },
  tiktok: {
    key: 'tiktok',
    name: 'TikTok',
    shortName: 'TT',
    icon: '🎵',
    color: '#000000',
    badgeBg: 'bg-slate-900/10',
    badgeBorder: 'border-slate-300',
    badgeText: 'text-slate-900',
    defaultTime: '20:30',
    specs: {
      maxCaptionLength: 2200,
      recommendedAspectRatio: ['9:16'],
      maxVideoDurationSec: 600,
      supportedMedia: ['video', 'image'],
      nativeScheduleSupported: false
    }
  },
  youtube: {
    key: 'youtube',
    name: 'YouTube (Shorts & Video)',
    shortName: 'YT',
    icon: '▶️',
    color: '#ff0000',
    badgeBg: 'bg-red-50',
    badgeBorder: 'border-red-200',
    badgeText: 'text-red-700',
    defaultTime: '17:00',
    specs: {
      maxCaptionLength: 5000,
      recommendedAspectRatio: ['9:16', '16:9'],
      maxVideoDurationSec: 43200,
      supportedMedia: ['video'],
      nativeScheduleSupported: true
    }
  },
  threads: {
    key: 'threads',
    name: 'Threads',
    shortName: 'TH',
    icon: '🧵',
    color: '#7c3aed',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700',
    defaultTime: '08:30',
    specs: {
      maxCaptionLength: 500,
      recommendedAspectRatio: ['1:1', '9:16', '16:9'],
      maxVideoDurationSec: 300,
      supportedMedia: ['image', 'video', 'carousel'],
      nativeScheduleSupported: false
    }
  },
  facebook: {
    key: 'facebook',
    name: 'Facebook Page',
    shortName: 'FB',
    icon: '👥',
    color: '#1877f2',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
    defaultTime: '12:00',
    specs: {
      maxCaptionLength: 63206,
      recommendedAspectRatio: ['1:1', '4:5', '9:16', '16:9'],
      maxVideoDurationSec: 14400,
      supportedMedia: ['image', 'video', 'carousel'],
      nativeScheduleSupported: true
    }
  }
};

export interface PlatformInfo {
  name: string;
  key: string;
  icon: string;
  badgeClass: string;
  accentColor: string;
  algorithmFocus: string;
  defaultFormats: string[];
  defaultTimes: string[];
  suggestedGoals: string[];
  topicPlaceholder: string;
}

export const platformsData: Record<string, PlatformInfo> = {
  Instagram: {
    name: "Instagram",
    key: "instagram",
    icon: "📸",
    badgeClass: "bg-pink-50 text-pink-700 border-pink-200",
    accentColor: "#e1306c",
    algorithmFocus: "Prioritas: Saves, Shares, dan Retensi Slide Carousel / Watch-time Reels. Estetika grid yang harmonis.",
    defaultFormats: ["Carousel Edukasi", "Reels / Video Pendek", "Single Feed / Infografis", "Story"],
    defaultTimes: ["12:00 WIB", "19:00 WIB", "20:30 WIB"],
    suggestedGoals: [
      "Saves & Shares (Edukasi)",
      "Profile Visits & Followers",
      "Interaksi Story & DM",
      "Konversi Penjualan / Bio Link",
      "Brand Awareness & Visual Grid"
    ],
    topicPlaceholder: "Contoh: 5 Langkah Membangun Brand Identity yang Konsisten"
  },
  TikTok: {
    name: "TikTok",
    key: "tiktok",
    icon: "🎵",
    badgeClass: "bg-slate-900/10 text-slate-800 border-slate-300",
    accentColor: "#000000",
    algorithmFocus: "Prioritas: Hook detik 0-3, completion rate (tonton sampai tuntas), dan pemicu komentar spontan.",
    defaultFormats: ["Short Video (POV / Tren)", "Edukasi Cepat 30s", "Behind the Scene / Buka-bukaan"],
    defaultTimes: ["13:00 WIB", "18:00 WIB", "21:00 WIB"],
    suggestedGoals: [
      "Masuk FYP (Virality)",
      "Watch Time & Retensi Penuh",
      "Edukasi & Tips Cepat 30s",
      "Konversi TikTok Shop / Bio",
      "Interaksi & Diskusi Komentar"
    ],
    topicPlaceholder: "Contoh: 3 Tanda Bisnismu Butuh Sistem Baru (POV & Solusi Cepat)"
  },
  Threads: {
    name: "Threads / X",
    key: "threads",
    icon: "🧵",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    accentColor: "#7c3aed",
    algorithmFocus: "Prioritas: Teks murni, diskusi hangat di kolom reply, repost, dan sudut pandang kontrarian yang relatable.",
    defaultFormats: ["Naskah Thread 5 Post", "Opini Kontrarian", "Curhat Relatable Pendek"],
    defaultTimes: ["08:30 WIB", "12:30 WIB", "21:30 WIB"],
    suggestedGoals: [
      "Diskusi Hangat (Replies)",
      "Repost & Virality Teks",
      "Pembangunan Otoritas Opini",
      "Traffic Link & Bio",
      "Curhat Relatable Industri"
    ],
    topicPlaceholder: "Contoh: Opini kontrarian tentang jebakan toxic productivity di dunia kerja"
  },
  LinkedIn: {
    name: "LinkedIn",
    key: "linkedin",
    icon: "💼",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    accentColor: "#0077b5",
    algorithmFocus: "Prioritas: Dwell time membaca dokumen PDF/Carousel, komentar berbobot antar-profesional, dan wawasan B2B teruji.",
    defaultFormats: ["Thought Leadership / Studi Kasus", "Carousel Dokumen PDF", "Teks Edukasi Industri"],
    defaultTimes: ["08:00 WIB", "11:45 WIB", "16:00 WIB"],
    suggestedGoals: [
      "Thought Leadership & Otoritas",
      "Lead Generation B2B",
      "Studi Kasus & Transformasi",
      "Networking & Diskusi Industri",
      "Employer Branding"
    ],
    topicPlaceholder: "Contoh: Studi Kasus: Bagaimana Kami Mengurangi Churn Rate 35% dalam 90 Hari"
  },
  YouTube: {
    name: "YouTube",
    key: "youtube",
    icon: "▶️",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    accentColor: "#ff0000",
    algorithmFocus: "Prioritas: CTR (Click-Through Rate) Thumbnail/Judul, audience retention, dan engagement likes/subscribe.",
    defaultFormats: ["YouTube Shorts (Vertikal)", "Video Tutorial / Demo", "Community Post"],
    defaultTimes: ["17:00 WIB", "19:30 WIB"],
    suggestedGoals: [
      "Subscribers & Watch Time",
      "Click-Through Rate (CTR)",
      "Edukasi Mendalam / Tutorial",
      "Shorts Viral Reach",
      "Community Poll & Interaksi"
    ],
    topicPlaceholder: "Contoh: Tutorial Lengkap Strategi Konten untuk Pemula dari Nol"
  },
  Facebook: {
    name: "Facebook",
    key: "facebook",
    icon: "👥",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    accentColor: "#1877f2",
    algorithmFocus: "Prioritas: Berbagi ke grup (shareable content), komentar antar-teman/keluarga, dan album visual bercerita.",
    defaultFormats: ["Post Gambar + Tautan", "Video Diskusi Komunitas", "Album Promo"],
    defaultTimes: ["10:00 WIB", "19:00 WIB"],
    suggestedGoals: [
      "Jangkauan Grup Komunitas",
      "Shareable Storytelling",
      "Klik Tautan & Penjualan",
      "Diskusi Kasual Komunitas",
      "Album Promo Produk"
    ],
    topicPlaceholder: "Contoh: Kisah Nyata di Balik Layar & Tips Praktis Keseharian"
  }
};

export interface PlacementTypeInfo {
  id: string;
  name: string;
  icon: string;
  badgeClass: string;
  targetPlacements: string[];
  description: string;
  spec: string;
}

export const placementTypesData: Record<string, PlacementTypeInfo> = {
  "Video Pendek": {
    id: "video_pendek",
    name: "Video Pendek",
    icon: "🎬",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    targetPlacements: ["TikTok", "Instagram Reels", "YouTube Shorts", "Facebook Reels"],
    description: "Video vertikal 9:16 (<60 detik) dengan hook 0-3 detik penahan scroll & narasi dinamis",
    spec: "Vertikal 9:16 • 15-45 detik • Hook detik 0-3"
  },
  "Carousel": {
    id: "carousel",
    name: "Carousel",
    icon: "📑",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    targetPlacements: ["Instagram Carousel", "LinkedIn Dokumen PDF"],
    description: "Multi-slide edukasi (5-8 slide) dengan retensi swipe tinggi & dokumen wawasan industri",
    spec: "Slide 1:1 atau 4:5 • 5-8 slide • Dokumen PDF"
  },
  "Post Gambar": {
    id: "post_gambar",
    name: "Post Gambar",
    icon: "🖼️",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
    targetPlacements: ["Instagram Feed", "Facebook Feed", "LinkedIn Post"],
    description: "Single visual, infografis komparasi, foto produk editorial, atau quote berbobot",
    spec: "Rasio 1:1 / 4:5 • Single image resolusi tinggi"
  },
  "Story": {
    id: "story",
    name: "Story Harian",
    icon: "⚡",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    targetPlacements: ["Instagram Story", "Facebook Story"],
    description: "Update harian interaktif 24 jam (behind the scenes, polling, Q&A, reminder)",
    spec: "Vertikal 9:16 • 3-5 frame interaktif • Stiker polling/Q&A"
  },
  "Threads": {
    id: "threads",
    name: "Threads / Microblog",
    icon: "🧵",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    targetPlacements: ["Threads", "LinkedIn Thought Post", "X (Twitter)"],
    description: "Microblogging serial 3-5 postingan terhubung, opini kontrarian, atau curhat praktisi",
    spec: "Serial teks 3-5 post • Karakter ringkas bernas"
  },
  "Video Panjang": {
    id: "video_panjang",
    name: "Video Panjang",
    icon: "🎥",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
    targetPlacements: ["YouTube Video", "Facebook Watch", "LinkedIn Video"],
    description: "Video horizontal 16:9 berdurasi 8-12 menit: tutorial mendalam, studi kasus, dan storytelling dengan struktur bab",
    spec: "Horizontal 16:9 • 8-12 menit • Struktur bab + thumbnail"
  }
};

export const funnelStagesData: Record<string, {
  label: string;
  short: string;
  key: 'awareness' | 'consideration' | 'conversion' | 'retention';
  icon: string;
  title: string;
  goal: string;
  ex: string;
}> = {
  tofu: {
    label: "TOFU · Awareness",
    short: "Awareness",
    key: "awareness",
    icon: "👀",
    title: "Awareness (TOFU)",
    goal: "Dikenal & menarik perhatian audiens baru",
    ex: "Hook relatable, edukasi ringan, konten viral"
  },
  mofu: {
    label: "MOFU · Consideration",
    short: "Consideration",
    key: "consideration",
    icon: "🤔",
    title: "Consideration (MOFU)",
    goal: "Membangun percaya & membandingkan solusi",
    ex: "Edukasi mendalam, studi kasus, mitos vs fakta"
  },
  bofu: {
    label: "BOFU · Conversion",
    short: "Conversion",
    key: "conversion",
    icon: "🛒",
    title: "Conversion (BOFU)",
    goal: "Mendorong aksi: coba, daftar, beli",
    ex: "Demo produk, bukti hasil, penawaran & CTA tegas"
  },
  ret: {
    label: "Retention · Loyalty",
    short: "Retention",
    key: "retention",
    icon: "💚",
    title: "Retention (Loyalty)",
    goal: "Menjaga pengguna tetap aktif & merekomendasikan",
    ex: "Komunitas, tips lanjutan, cerita pengguna"
  }
};

export const defaultPillars = [
  { name: "Edukasi & Tips", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { name: "Brand Story & Nilai", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { name: "Interaksi & Komunitas", color: "bg-sky-50 text-sky-800 border-sky-200" },
  { name: "Produk & Konversi", color: "bg-rose-50 text-rose-800 border-rose-200" },
  { name: "Proses & Di Balik Layar", color: "bg-indigo-50 text-indigo-800 border-indigo-200" }
];

export const editorialPatterns = [
  {
    pilar: "Edukasi & Tips",
    hook: "Kesalahan kecil yang sering terulang tanpa disadari",
    angle: "Sorot satu kebiasaan keliru audiens dan berikan alternatif yang lebih efektif serta terbukti",
    visual: "Split comparison layout: Cara umum (salah) vs Cara efektif (rekomendasi brand)"
  },
  {
    pilar: "Brand Story & Nilai",
    hook: "Kenapa kami menolak jalan pintas ini sejak awal",
    angle: "Bongkar prinsip idealisme brand dalam memilih bahan, proses, atau standar pengerjaan",
    visual: "Foto hitam-putih atau natural candid pendiri saat memeriksa bahan baku dengan kutipan tipografi bersih"
  },
  {
    pilar: "Interaksi & Komunitas",
    hook: "Kalau harus memilih satu, kamu tim yang mana?",
    angle: "Debat santai dan relevan dengan preferensi harian target audiens",
    visual: "Two-panel split visual dengan pilihan A vs B berkontras warna seimbang"
  },
  {
    pilar: "Produk & Konversi",
    hook: "Satu detail tersembunyi yang jarang diperhatikan",
    angle: "Bedah keunggulan teknis atau material produk dengan bahasa sederhana dan bukti visual",
    visual: "Macro close-up shot pada tekstur atau detail finishing produk dengan garis penunjuk (annotation pin)"
  },
  {
    pilar: "Edukasi & Tips",
    hook: "3 Tanda kamu butuh solusi ini sekarang juga",
    angle: "Identifikasi gejala masalah yang dialami audiens sebelum menawarkan produk",
    visual: "Tampilan infografis minimalis 3 poin dengan nomor tebal beraksen palet brand"
  },
  {
    pilar: "Proses & Di Balik Layar",
    hook: "Apa yang sebenarnya terjadi sebelum pesanan kamu dikirim?",
    angle: "Tunjukkan quality control teliti dan sentuhan personal tim",
    visual: "Kolase 3 langkah proses pengecekan kualitas dan pengemasan rapi tanpa plastik berlebih"
  },
  {
    pilar: "Produk & Konversi",
    hook: "Siapa saja yang paling cocok menggunakan ini?",
    angle: "Segmentasi kebutuhan spesifik agar calon pembeli merasa produk ini dibuat khusus untuk mereka",
    visual: "Foto flat-lay produk di samping perlengkapan kerja atau tas harian target audiens"
  },
  {
    pilar: "Edukasi & Tips",
    hook: "Mitos vs Fakta yang paling sering disalahpahami",
    angle: "Luruskan informasi simpang siur di industri dengan fakta objektif",
    visual: "Kartu Q&A dengan tag Mitos warna merah lembut dan Fakta warna hijau segar"
  },
  {
    pilar: "Interaksi & Komunitas",
    hook: "Bantu kami menentukan produk/fitur batch berikutnya",
    angle: "Libatkan pelanggan setia dalam pengambilan keputusan desain atau varian baru",
    visual: "Mockup 2 pilihan sketsa desain/rasa dengan nomor voting yang jelas"
  },
  {
    pilar: "Brand Story & Nilai",
    hook: "Momen hampir menyerah yang justru membentuk kami hari ini",
    angle: "Cerita kegagalan nyata di masa awal yang membuahkan perbaikan standar mutu",
    visual: "Foto autentik suasana bengkel pengerjaan/dapur pertama kali didirikan"
  }
];
