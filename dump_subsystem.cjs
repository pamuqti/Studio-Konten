const fs = require('fs');

const sub = fs.readFileSync('bb_subsystem.js', 'utf8');

// Find all capitalized global identifiers or functions called
console.log('--- Search global references in bb_subsystem ---');
const words = sub.match(/\b[A-Za-z_$][A-Za-z0-9_$]*\b/g);
const counts = {};
words.forEach(w => counts[w] = (counts[w] || 0) + 1);

// List words that might be external identifiers
const potentialGlobals = Object.keys(counts).filter(w => counts[w] > 2 && w.length <= 4);
console.log('Short potential identifiers:', potentialGlobals.join(', '));
