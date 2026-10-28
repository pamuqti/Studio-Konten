import fs from 'fs';

const f1 = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Look for component names or major sections in f1
// Let's search for "Studio" or navigation tab items
const matches = f1.match(/([a-zA-Z0-9_$]+View|[a-zA-Z0-9_$]+Modal|[a-zA-Z0-9_$]+Step)/g);
console.log('Component-like names in f1:');
console.log([...new Set(matches)]);

// Let's check navigation or modules
const navRegex = /id:\s*"([a-z0-9_-]+)"/g;
let m;
const ids = new Set();
while ((m = navRegex.exec(f1)) !== null) {
  ids.add(m[1]);
}
console.log('\nIDs found:');
console.log([...ids]);
