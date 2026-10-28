import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Find bbxBuild function
const idx = html.indexOf('const bbxBuild=');
if (idx !== -1) {
  console.log('--- bbxBuild ---');
  console.log(html.slice(idx, idx + 3500));
} else {
  const idx2 = html.indexOf('bbxBuild');
  console.log('bbxBuild at:', idx2);
  if (idx2 !== -1) console.log(html.slice(idx2, idx2 + 2000));
}
