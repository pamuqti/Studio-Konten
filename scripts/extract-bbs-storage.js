import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Check CSS rules added
const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
if (styleMatch) {
  console.log('--- CUSTOM STYLE IN HTML ---');
  console.log(styleMatch[1].slice(0, 2000));
}

// Find all code related to bbs (bbsLoad, bbsSave, etc.)
const idx = html.indexOf('bbsLoad');
if (idx !== -1) {
  console.log('\n--- bbs STORAGE AND DEFAULTS ---');
  console.log(html.slice(Math.max(0, idx - 400), idx + 2500));
}
