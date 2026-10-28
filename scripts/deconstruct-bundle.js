import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Let's find all function definitions or react component patterns in the script
// In Vite singlefile bundle, esbuild/rollup bundles modules into functions or variables.
// Let's search for occurrences of:
// 1. Sidebar labels and items
// 2. PlannerView / Table modifications
// 3. BrandModal / Brand Brain tabs
// 4. Any new studio views or new modals

console.log('--- SIDEBAR SECTION ---');
const sbMatch = html.match(/modules:\[\{id:\"plan\"[\s\S]*?\]/);
if (sbMatch) {
  console.log(sbMatch[0]);
}

console.log('--- MODULE_SPECS SECTION ---');
const msMatch = html.match(/Ze=\{plan:\{[\s\S]*?\}\};/);
if (msMatch) {
  console.log(msMatch[0]);
}

console.log('--- BRAND BRAIN TABS ---');
const bbMatch = html.match(/\[\{id:\"foundation\"[\s\S]*?\]/);
if (bbMatch) {
  console.log(bbMatch[0]);
}
