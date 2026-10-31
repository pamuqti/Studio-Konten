# Panduan Desain & Pengembangan Studio Konten (Global Rules)

## 1. Prinsip Desain UI: Anti-Clutter & Visual Breathing Room
**Prinsip Utama: JANGAN SUKA MENGUMPULKAN ATAU MENUMPUK TAMPILAN SECARA BERLEBIHAN.**

1. **Tata Letak Tidak Menumpuk (Anti-Clutter)**:
   - Hindari menumpuk terlalu banyak kartu, tombol, atau navigasi dalam satu kolom sempit.
   - Hindari tab horizontal yang sempit dan berhimpitan jika itemnya banyak. Gunakan tata letak **Master-Detail (dua kolom)**: navigasi vertikal di kiri, konten kerja lega di kanan.
   - Kurangi kotak-dalam-kotak (*card nesting*) yang berlebihan. Berikan ruang bernapas (*generous whitespace*).

2. **Pengalaman Pengguna (UX)**:
   - Status koneksi (seperti pada 5 platform sosial & Cloudflare R2) harus langsung terbaca jelas tanpa perlu mencari-cari.
   - Pisahkan field input secara logis (Identitas Akun vs Kredensial Rahasia).
   - Pastikan teks panduan ringkas, rapi, dan tidak memadati layar.

---

## 2. Standar Format Global: Brand Brain (`brand-brain`)
**Acuan Tunggal untuk Semua Aplikasi Sekarang & Selanjutnya** (Detail lengkap tersedia di skill global `brand-brain`: `C:\Users\COMP\.gemini\config\skills\brand-brain\SKILL.md`).

Setiap aplikasi yang dibuat atau dikembangkan (baik aplikasi utama Ruang Konten maupun aplikasi standalone seperti Konsep Feed & Grid, Slide Carousel, Storyboard Video, Brief KOL & Kreator, Studio Threads, Scriptwriter, dll.) **WAJIB** menggunakan format standar Brand Brain dari `kalender_konten_planner (3).html`:

1. **Model Data 14 Bagian (`BrandBrain` / `bbxSecs`)**:
   - `identity` (🏛️ Identitas & Fondasi — *locked/wajib*): `name`, `category`, `product`, `brandPromise`, `mission`, `vision`, `values`, `audience`, `usp`, `tone`, `cta`, `color`, `website`, `instagramHandle`, `platformAccounts` (`instagram`, `tiktok`, `threads`, `linkedin`, `youtube`, `facebook`)
   - `positioning` (🧭 Positioning): `weAre`, `forAudience`, `whoNeed`, `becauseWhy`, `unlike`, `statement`
   - `market` (⚔️ Kompetitor & Pasar): `competitorContext` (`directCompetitors`, `indirectCompetitors`, `competitorWeakness`, `whatWeWillNeverDo`)
   - `audience` (🎯 Audience DNA): `audienceDNA` (`primary`, `demographics`, `psychographics` [`painPoints`, `desires`, `fears`, `objections`], `contentBehavior` [`scrollStoppers`, `commentTriggers`, `purchaseTriggers`])
   - `offer` (💎 Penawaran & Konversi): `offerConversionDNA` (`mainOffer`, `entryOffer`, `priceRange`, `riskReversal`, `purchasePath`)
   - `proof` (🏆 Bukti & Kredibilitas): `proofCredibility` (`hardProofPoints`, `caseTransformations`, `customerVoiceRaw`)
   - `voice` (🎭 Karakter & Suara): `personalityVoice` (`spectrum` [`formality`, `playfulness`, `approach`, `positioningTier`, `energy`], `humanPersona`, `voiceDo`, `voiceDont`, `signatureWords`, `forbiddenWords`)
   - `visual` (🎨 Visual DNA): `visualDNA` (`palette` [`primary`, `secondary`, `accent`, `background`], `photographyStyle`, `visualDoNotUse`)
   - `content` (📊 Content DNA): `contentDNA` (`pillars`, `contentRatio`, `funnelCTA`)
   - `memory` (🧠 Brand Memory & Guardrails): `brandMemory` (`alwaysSay`, `neverSay`, `signatureStories`, `claimsGuardrail` [`allowed`, `forbidden`])
   - `directives` (📜 Aturan Kustom AI): `customDirectives`
   - `blocks` (🧩 Blok Acuan Modular): `customBlocks` (`id`, `title`, `category`, `content`, `isActive`)
   - `knowledge` (📚 Basis Pengetahuan Bebas): `customKnowledge`
   - `persona` (🤖 Persona AI): `aiPersonaInstructions`

2. **Format Pertukaran JSON Antar-Aplikasi (`brand-brain-connector` v1.0)**:
   - Setiap aplikasi standalone wajib dapat mengekspor dan mengimpor JSON dengan header `"schema": "brand-brain-connector"`, `"schema_version": "1.0"`.
   - Struktur key konektor selalu tetap (*fixed schema*): `brand`, `positioning`, `audience_profile`, `competition`, `voice`, `visual`, `guardrails`, `content_strategy`, `funnel.stages` (`awareness` [TOFU], `consideration` [MOFU], `conversion` [BOFU], `retention` [RETENTION]), dan `knowledge`.
   - Importer (`bbiParse` & `bbiFromConn`) wajib menerima 3 format sekaligus: **Konektor Funnel** (`schema: "brand-brain-connector"`), **Backup JSON** (`type: "brand-brain-export"`), dan **Generic JSON** (`brand` / `data` / `dna` / objek langsung), dengan pilihan mode **Timpa (`replace`)** dan **Gabung (`fill`)**.

3. **Kompilasi Prompt AI Standar (`compileBrandBrainPrompt`)**:
   - Seluruh pemanggilan AI di aplikasi mana pun wajib menyertakan konteks Brand Brain dengan format blok `=== BRAND BRAIN: SATU SUMBER KEBENARAN STRATEGIS === ... === AKHIR BRAND BRAIN ===`.
