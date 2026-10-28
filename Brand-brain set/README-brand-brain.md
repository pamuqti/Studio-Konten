# Brand Brain: kode hasil ekstraksi

Sumber: `kalender_konten_planner__3_.html` (aplikasi "Ruang Konten", bundle Vite yang sudah di-minify).
Semua file di bawah diambil dari bundle itu dengan parser AST (bukan regex), lalu dirapikan dengan Prettier.
Semua file JS sudah dicek sintaksnya valid.

| File | Isi |
|---|---|
| `01-brand-brain-core.js` | Contoh brand Trajecto (`Fb`), kompilasi Brand Brain jadi teks acuan AI (`ot`), skor kelengkapan (`Qb`), pembuat blok acuan (`Xb`) |
| `02-brand-brain-export.js` | Fitur Export: 6 format (Prompt AI, Backup JSON, Brand Guide .md, Konektor Funnel, Template Kosong, Brand Sheet .html), panel Export, menu Export cepat |
| `03-brand-brain-import.js` | Fitur Import: parser Backup JSON / Konektor Funnel / JSON generik / .md, mode "ganti" vs "isi yang kosong", modal Import |
| `04-brand-brain-ai.js` | Ekstraksi Brand Brain otomatis dari teks produk via Gemini, dan "Perinci via AI" untuk blok acuan |
| `05-brand-brain-modal.js` | Komponen React modal Brand Brain (semua tab). Ini hasil kompilasi JSX, jadi berisi `n.jsx(...)` |
| `06-brand-brain-shortcuts.js` | Pintasan alat di sidebar dan tombol "Sambungkan Brand Brain" (unduh/salin JSON konektor) |
| `07-brand-brain-shared-helpers.js` | Helper bersama: Gemini API key & pemanggil model, brand kosong default, unduh/salin |
| `brand-brain.css` | CSS kustom `bbx-*`, `bbs-*`, `bbm-*`, `bbi-*` |

## Catatan penting

- **Nama variabel masih hasil minify** (`c`, `d`, `u`, `ot`, `Qb`, ...). Nama yang terbaca (`bbx*`, `bbi*`, `bbs*`) memang ditulis begitu di sumbernya.
- **Belum standalone.** Tiap file punya header "Bergantung pada" yang menyebut simbol dari bundle yang tidak ikut, terutama `G` (React), `n` (jsx runtime), ikon lucide-react (`jn`, `ut`, `ze`, ...) dan komponen/data lain di app.
- Format "Konektor Funnel" memakai `schema: "brand-brain-connector"`, dan Backup JSON memakai `type: "brand-brain-export"`. Dua penanda ini yang dibaca oleh fitur Import.
- Gemini API key dibaca dari localStorage browser atau dari environment canvas (lihat `ku` di file 07).
