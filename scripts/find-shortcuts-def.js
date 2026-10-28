import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

const regex = /(?:function\s+bbsShortcuts|const\s+bbsShortcuts|var\s+bbsShortcuts|let\s+bbsShortcuts|bbsShortcuts\s*=)/;
const match = html.match(regex);
if (match) {
  const idx = match.index;
  console.log(html.slice(idx, idx + 2500));
} else {
  console.log('No direct match, let us search for bbsShortcuts index');
  const idx = html.indexOf('bbsShortcuts');
  console.log(html.slice(Math.max(0, idx - 500), idx + 500));
}
