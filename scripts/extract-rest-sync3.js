import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

const needle = '1x Instagram Story dengan stiker tautan langsu';
const idx = html.indexOf(needle);
if (idx !== -1) {
  console.log(html.slice(idx, idx + 4000));
}
