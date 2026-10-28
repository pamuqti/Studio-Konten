import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Find where this master sync function begins
const needle = 'Otomatis disinkronkan dari Kalender Konten';
const idx = html.indexOf(needle);
if (idx !== -1) {
  // Look back to where the function starts
  const startIdx = html.lastIndexOf('const ', idx - 500);
  console.log('--- MASTER SYNC FUNCTION ---');
  console.log(html.slice(startIdx, idx + 3500));
}
