import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

const ryIdx = html.indexOf('Ry=({');
const ryEnd = html.indexOf('Oy=({', ryIdx);
const ryBlock = html.slice(ryIdx, ryEnd);

// Search for any button text related to sync in Ry
const matches = ryBlock.match(/children:\[?\"([^\"]*Sinkron[^\"]*)\"/g);
console.log('Sync text in PlannerView:', matches);

const allBtn = ryBlock.match(/onClick:([^,}]+)/g);
console.log('OnClicks in PlannerView:', allBtn?.filter(x => x.includes('b')));
