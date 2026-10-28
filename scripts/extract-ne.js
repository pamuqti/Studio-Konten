import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Find function Ne or onSyncAllToStudios implementation
const idx = html.indexOf('onSyncAllToStudios:()=>Ne(');
if (idx !== -1) {
  console.log('--- AROUND onSyncAllToStudios:()=>Ne( ---');
  // Look backward to find Ne definition
  console.log(html.slice(Math.max(0, idx - 1500), idx + 100));
}
