import fs from 'fs';

const f1 = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Search around "brand-brain-form"
const idx = f1.indexOf('brand-brain-form');
if (idx !== -1) {
  console.log('--- SNIPPET AROUND brand-brain-form ---');
  console.log(f1.slice(Math.max(0, idx - 500), Math.min(f1.length, idx + 1500)));
}

// Search for modal tabs or sections
const idx2 = f1.indexOf('Brand Brain');
if (idx2 !== -1) {
  console.log('--- SNIPPET AROUND Brand Brain ---');
  console.log(f1.slice(Math.max(0, idx2 - 200), Math.min(f1.length, idx2 + 1000)));
}
