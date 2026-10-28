import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

const idx = html.indexOf('onSyncAllToStudios');
if (idx !== -1) {
  // Let's search inside PlannerView (Ry) for where `b` (the prop name for onSyncAllToStudios) is used
  const ryIdx = html.indexOf('Ry=({');
  const ryEnd = html.indexOf('Oy=({', ryIdx);
  const ryBlock = html.slice(ryIdx, ryEnd);
  
  // Find occurrences of b( or b && or onSyncAllToStudios
  console.log('--- USAGE IN PLANNERVIEW ---');
  let searchPos = 0;
  while (true) {
    const p = ryBlock.indexOf('b()', searchPos);
    if (p === -1) break;
    console.log(ryBlock.slice(Math.max(0, p - 300), p + 200));
    searchPos = p + 3;
  }
}
