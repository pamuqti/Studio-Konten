import fs from 'fs';

const f1 = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Find MODULE_SPECS
const idx = f1.indexOf('Kalender Konten');
if (idx !== -1) {
  console.log('--- SNIPPET AROUND Kalender Konten ---');
  console.log(f1.slice(idx - 100, idx + 1000));
}

// Check sidebar module list
const sbIdx = f1.indexOf('sidebarContent');
if (sbIdx !== -1) {
  console.log('--- SNIPPET AROUND sidebarContent ---');
  console.log(f1.slice(sbIdx - 100, sbIdx + 1000));
} else {
  // search for id:"plan"
  const planIdx = f1.indexOf('{id:"plan",icon:');
  if (planIdx !== -1) {
    console.log('--- SNIPPET AROUND {id:"plan",icon: ---');
    console.log(f1.slice(planIdx - 50, planIdx + 400));
  }
}
