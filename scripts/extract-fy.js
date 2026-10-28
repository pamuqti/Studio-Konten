import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

const needle = 'allDocs:E,activeDocIdMap:L}';
const idx = html.indexOf(needle);
if (idx !== -1) {
  console.log(html.slice(idx, idx + 2500));
}
