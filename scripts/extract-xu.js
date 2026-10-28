import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Find function xu
const idx = html.indexOf('function xu(');
if (idx !== -1) {
  // find end of function xu
  const endIdx = html.indexOf('function Fy(', idx);
  console.log('--- FUNCTION xu ---');
  console.log(html.slice(idx, endIdx));
}
