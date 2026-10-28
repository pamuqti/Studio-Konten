import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

const idx = html.indexOf('const Ne=');
const idx2 = html.indexOf('function Ne(');
const pos = idx !== -1 ? idx : idx2;
if (pos !== -1) {
  console.log('--- Ne implementation ---');
  console.log(html.slice(pos, pos + 2000));
} else {
  // search for "SyncAll" or text about syncing all
  const syncMatch = html.match(/(?:Sinkron|sync|Sync)[^\.]{1,100}Studio[^\.]{1,100}/g);
  console.log('Sync matches:', syncMatch);
}
