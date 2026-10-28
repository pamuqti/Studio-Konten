import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Find differences in PlannerView or table
const idx = html.indexOf('Tipe Placement');
if (idx !== -1) {
  console.log('--- SNIPPET AROUND Tipe Placement ---');
  console.log(html.slice(Math.max(0, idx - 200), idx + 800));
}

// Find onHandoff in html
const handoffs = html.match(/onHandoff[^}]{1,200}/g);
console.log('Handoffs:', handoffs);
