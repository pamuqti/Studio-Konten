import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Find all occurrences of bbx or bbs
const idx = html.indexOf('const bbx');
if (idx !== -1) {
  console.log('--- bbx definition ---');
  console.log(html.slice(idx, idx + 4000));
} else {
  const idx2 = html.indexOf('bbxSecs');
  if (idx2 !== -1) {
    console.log('--- bbxSecs ---');
    console.log(html.slice(Math.max(0, idx2 - 500), idx2 + 3500));
  }
}
