import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Find start of bbx utilities
const startIdx = html.indexOf('const bbxH=');
const endIdx = html.indexOf('const bbxPanel=', startIdx);
const endPanelIdx = html.indexOf('const bbsKey=', endIdx);
const endBbsIdx = html.indexOf('const bbsShortcuts=', endPanelIdx);
const endAllIdx = html.indexOf('const jh=', endBbsIdx);

console.log('--- BBX UTILITIES ---');
console.log(html.slice(startIdx, endIdx));

console.log('\n--- BBX PANEL ---');
console.log(html.slice(endIdx, endPanelIdx));

console.log('\n--- BBS STORAGE & FORM ---');
console.log(html.slice(endPanelIdx, endBbsIdx));

console.log('\n--- BBS SHORTCUTS ---');
console.log(html.slice(endBbsIdx, endAllIdx));
