import fs from 'fs';

const f1 = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

const idx = f1.indexOf('Ze={plan:{');
if (idx !== -1) {
  console.log('--- Ze (MODULE_SPECS) ---');
  console.log(f1.slice(idx, idx + 1200));
}
