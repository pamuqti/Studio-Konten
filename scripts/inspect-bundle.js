import fs from 'fs';

const f1 = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Check for sourcemap
const hasSourceMap = f1.includes('sourceMappingURL');
console.log('Has sourceMappingURL:', hasSourceMap);

// Check size of the script tag
const scriptMatch = f1.match(/<script type="module">([\s\S]*?)<\/script>/);
if (scriptMatch) {
  console.log('Script length:', scriptMatch[1].length);
}

// Let's search for all section headers, modal titles, or UI labels
const headings = f1.match(/children:\"([A-Za-z0-9\s&•—\(\)\/\.]{5,60})\"/g);
if (headings) {
  const uniqueHeadings = [...new Set(headings.map(h => h.replace(/children:\"|\"/g, '')))];
  console.log('\nSample UI Headings in f1:');
  console.log(uniqueHeadings.slice(0, 50));
}
