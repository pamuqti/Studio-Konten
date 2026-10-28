import fs from 'fs';

const f1 = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');
const f2 = fs.readFileSync('gemini-canvas-v3-patched.html', 'utf-8');

// Find strings containing Indonesian letters or words
const re = /"([^"\\]{10,250})"/g;
let m;
const s1 = new Set();
while ((m = re.exec(f1)) !== null) {
  s1.add(m[1]);
}
const s2 = new Set();
while ((m = re.exec(f2)) !== null) {
  s2.add(m[1]);
}

const diffIndo = [];
for (const str of s1) {
  if (!s2.has(str)) {
    // Check if it looks like human text
    if (/[a-zA-Z\s]{15,}/.test(str) && !str.includes('function') && !str.includes('return') && !str.includes('throw') && !str.includes('typeof')) {
      diffIndo.push(str);
    }
  }
}

console.log('Total human text diffs:', diffIndo.length);
diffIndo.slice(0, 50).forEach((s, i) => console.log(`${i + 1}. ${s}`));
