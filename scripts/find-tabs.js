import fs from 'fs';

const f1 = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Find the tabs definition in the brand modal
const match = f1.match(/\[\{id:"foundation"[^\]]+\]/);
if (match) {
  console.log('Found tabs definition:');
  console.log(match[0]);
} else {
  // Try finding where id:"foundation" is located
  const idx = f1.indexOf('id:"foundation"');
  if (idx !== -1) {
    console.log(f1.slice(idx - 100, idx + 800));
  }
}
