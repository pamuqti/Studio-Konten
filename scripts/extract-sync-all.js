import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

const idx = html.indexOf('onSyncAllToStudios');
if (idx !== -1) {
  console.log('--- onSyncAllToStudios snippet 1 ---');
  console.log(html.slice(Math.max(0, idx - 400), idx + 800));
}

const idx2 = html.lastIndexOf('onSyncAllToStudios');
if (idx2 !== -1 && idx2 !== idx) {
  console.log('--- onSyncAllToStudios snippet 2 ---');
  console.log(html.slice(Math.max(0, idx2 - 400), idx2 + 800));
}
