import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourcePath = path.join(rootDir, 'dist-canvas', 'index.html');
const v3PatchedPath = path.join(rootDir, 'gemini-canvas-v3-patched.html');

const downloadsDir = 'C:\\Users\\COMP\\Downloads';
const downloadTargetV3 = path.join(downloadsDir, 'gemini-canvas-v3-patched.html');

if (!fs.existsSync(sourcePath)) {
  console.error('Error: dist-canvas/index.html tidak ditemukan. Jalankan vite build terlebih dahulu.');
  process.exit(1);
}

let content = fs.readFileSync(sourcePath, 'utf-8');

// 1. Ensure clean API key state (no hardcoded keys)
content = content.replace(
  /window\.__GEMINI_API_KEY__\s*=\s*window\.__GEMINI_API_KEY__\s*\|\|\s*["'][^"']*["'];/g,
  'window.__GEMINI_API_KEY__ = window.__GEMINI_API_KEY__ || "";'
);

// 2. Inject sandbox canvas initialization, localStorage safe polyfill, and API routing
const canvasInitScript = `
    <script id="gemini-canvas-init">
      window.__GEMINI_CANVAS__ = true;
      window.CANVAS_MODE = true;
      window.__GEMINI_API_KEY__ = window.__GEMINI_API_KEY__ || "";

      // In-memory fallback for localStorage in sandboxed iframes or restricted file:/// environments
      try {
        window.localStorage && window.localStorage.getItem('__ruangkonten_test__');
      } catch (_) {
        var _memStorage = {};
        try {
          Object.defineProperty(window, 'localStorage', {
            value: {
              getItem: function(k) { return _memStorage[k] !== undefined ? _memStorage[k] : null; },
              setItem: function(k, v) { _memStorage[k] = String(v); },
              removeItem: function(k) { delete _memStorage[k]; },
              clear: function() { _memStorage = {}; },
              key: function(i) { return Object.keys(_memStorage)[i] || null; },
              get length() { return Object.keys(_memStorage).length; }
            },
            writable: true,
            configurable: true
          });
        } catch (e) {}
      }

      // Intercept any local backend /api/* calls in canvas sandbox environment and fallback immediately to direct client Gemini API
      var _nativeFetch = window.fetch;
      window.fetch = function(url, options) {
        if (typeof url === 'string' && (url.startsWith('/api/') || url.includes('/api/'))) {
          return Promise.reject(new Error('canvas-no-backend'));
        }
        return _nativeFetch.apply(this, arguments);
      };
    </script>
`;

if (!content.includes('id="gemini-canvas-init"')) {
  content = content.replace('<head>', '<head>\n' + canvasInitScript);
}

// 3. Write New Version: gemini-canvas-v3-patched.html
fs.writeFileSync(v3PatchedPath, content, 'utf-8');

// 4. Copy to user Downloads folder if available
if (fs.existsSync(downloadsDir)) {
  try {
    fs.copyFileSync(v3PatchedPath, downloadTargetV3);
    console.log(`📋 Berhasil disinkronkan ke folder Downloads:`);
    console.log(`   -> ${downloadTargetV3}`);
  } catch (err) {
    console.warn('Peringatan: Gagal menyalin ke Downloads:', err.message);
  }
}

const stats = fs.statSync(v3PatchedPath);
const sizeKb = (stats.size / 1024).toFixed(1);

console.log('====================================================');
console.log('✅ EXPORT GEMINI CANVAS RUANG KONTEN (V3) BERHASIL!');
console.log(`📁 File Baru: ${v3PatchedPath}`);
console.log(`📦 Ukuran: ${sizeKb} KB (100% Self-contained single HTML)`);
console.log('⚡ API Canvas Engine: Real Gemini API calls (gemini-3-flash-preview & gemini-2.5-flash)');
console.log('🗓️ Kalender Konten: Unified Master Calendar per Akun Platform (IG, TikTok, Threads, LinkedIn, YT, FB)');
console.log('🧠 Brand Brain: 12 Pilar Lengkap + Multi-Platform Social Accounts');
console.log('🔒 Master V2 Status: gemini-canvas-v2-patched.html tetap utuh tanpa disentuh.');
console.log('====================================================');

