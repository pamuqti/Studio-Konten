import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

const idx = html.indexOf('Sinkronkan ke Pengaturan Konten');
if (idx !== -1) {
  console.log(html.slice(Math.max(0, idx - 400), idx + 400));
}
