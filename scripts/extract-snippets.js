import fs from 'fs';

const f1 = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Search for snippets around "customDirectives" or "Trajecto"
const idx = f1.indexOf('customDirectives');
if (idx !== -1) {
  console.log('--- SNIPPET AROUND customDirectives ---');
  console.log(f1.slice(Math.max(0, idx - 400), Math.min(f1.length, idx + 1000)));
}

const idx2 = f1.indexOf('visualDNA');
if (idx2 !== -1) {
  console.log('--- SNIPPET AROUND visualDNA ---');
  console.log(f1.slice(Math.max(0, idx2 - 400), Math.min(f1.length, idx2 + 1000)));
}
