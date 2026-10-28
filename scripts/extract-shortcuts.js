import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

const idx = html.indexOf('bbsShortcuts');
if (idx !== -1) {
  console.log('--- bbsShortcuts definition ---');
  // find function or variable definition of bbsShortcuts
  console.log(html.slice(Math.max(0, idx - 1500), Math.min(html.length, idx + 200)));
} else {
  console.log('bbsShortcuts not found directly');
}
