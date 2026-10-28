# Studio Konten — Content Planner & Auto-Publisher (5 Platform)

Aplikasi terpadu (*All-in-One Content Suite*) untuk merancang rencana konten editorial dengan **Gemini AI**, mengelola proses produksi naskah/brief, dan mempublikasikan jadwal secara otomatis ke **5 platform sosial media**: **Facebook, Instagram, Threads, TikTok, dan YouTube** menggunakan **Cloudflare R2 (Free Tier)** untuk hosting media tanpa biaya bandwidth keluar (*Zero Egress*).

---

## 🌟 Fitur Utama

1. **📋 Ruang Rencana (Pre-Production Studio):**
   - **Brand Brain DNA:** Fondasi suara brand, positioning, pilar, dan persona audiens.
   - **AI Content Generator & Strategist:** Rancang rencana konten 30 hari dalam hitungan detik.
   - **Editor Naskah & Brief:** Hook 0-3 detik, sudut konten, naskah narasi/caption, dan brief visual.
   - **Cetak Brief Produksi:** Export HTML / PDF satu klik untuk tim shooting & desainer.

2. **⚡ Jembatan Jeda Produksi (Staging Area):**
   - **Kantong Naskah Siap Tayang (Content Pool):** Konten yang disetujui (*Approved*) otomatis masuk ke kantong antrean selagi tim menyelesaikan syuting atau editing video di CapCut/Premiere/Canva.

3. **📅 Ruang Tayang & Auto-Publisher (Post-Production & Distribusi):**
   - **Kalender Visual Bulanan:** Menampilkan jadwal tayang presisi (WIB), indikator platform, dan status eksekusi API.
   - **Cloudflare R2 Media Studio (Free Tier):** Upload video `.mp4` / gambar `.jpg` via Presigned URL (gratis 10GB storage/bulan & gratis bandwidth keluar).
   - **Target 5 Platform (Cross-Posting):** Facebook, Instagram, Threads, TikTok, dan YouTube.
   - **Pre-Flight Spec Validator:** Peringatan otomatis batas karakter & rasio video 9:16.
   - **Hybrid Publishing Engine:**
     - **YouTube Native Schedule:** Otomatis masuk ke *YouTube Studio Scheduled* via `publishAt`.
     - **Facebook Native Schedule:** Otomatis masuk ke daftar *Scheduled Posts* Meta Business Suite.
     - **TikTok Inbox Draft:** Draf video langsung dikirim ke notifikasi aplikasi TikTok di HP kreator (bisa tambah sound viral).
     - **Instagram & Threads:** Auto-Queue container publisher saat jam tayang tiba.

---

## 🛠️ Menjalankan Secara Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server lokal
npm run dev
```

Buka browser di **`http://localhost:3000`**.

---

## 🚀 Deploy ke Web (Firebase Hosting)

Aplikasi ini siap di-deploy ke Firebase Hosting:

```bash
# Build dan deploy ke Firebase
npm run deploy
```

Atau manual:
```bash
npm run build
npx firebase-tools deploy --only hosting
```

---

## ⚙️ Variabel Lingkungan (.env)

Buat file `.env` untuk mengaktifkan fitur server AI & Cloudflare R2:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key

# Cloudflare R2 (Gratis 10GB & Zero Egress)
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=ruang-konten-media
R2_PUBLIC_URL=https://pub-xxxxxxxxxxxx.r2.dev
```

