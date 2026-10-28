import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Search for sidebar buttons or navigation items
// In React JSX minified, it might be {id:"plan",label: or similar
const idx = html.indexOf('Jadwal & Kalender Induk');
if (idx !== -1) {
  console.log('--- SNIPPET AROUND Jadwal & Kalender Induk ---');
  console.log(html.slice(Math.max(0, idx - 400), Math.min(html.length, idx + 800)));
}
