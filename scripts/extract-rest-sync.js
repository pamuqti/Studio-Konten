import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

const needle = 'Slide 6 · Rangkuman & Key Takeaway';
const idx = html.indexOf(needle);
if (idx !== -1) {
  console.log(html.slice(idx, idx + 4000));
}
