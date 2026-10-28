import fs from 'fs';

const html = fs.readFileSync('c:/Users/COMP/Downloads/content_planner (1).html', 'utf-8');

// Search for the App component definition and find what function is called
const appIdx = html.indexOf('function App(');
const appIdx2 = html.indexOf('const App=');
const appIdx3 = html.indexOf('App()');
console.log('App indices:', appIdx, appIdx2, appIdx3);

// Let's find "onSyncAllToStudios:()=>"
const syncIdx = html.indexOf('onSyncAllToStudios:()=>');
if (syncIdx !== -1) {
  // Let's check 3000 chars before syncIdx
  const block = html.slice(Math.max(0, syncIdx - 3000), syncIdx);
  // find the function name that is called
  const callName = html.slice(syncIdx + 'onSyncAllToStudios:()=>'.length, syncIdx + 30).split('(')[0];
  console.log('Function called:', callName);
  
  // Find where `const ${callName}=` or `function ${callName}(` occurs in this block
  const fnIdx = block.lastIndexOf(`${callName}=`);
  if (fnIdx !== -1) {
    console.log('--- FOUND FUNCTION DEFINITION ---');
    console.log(block.slice(fnIdx));
  } else {
    console.log('Not found in immediate block, searching full file for `const ' + callName + '=`');
    const fullIdx = html.lastIndexOf(`const ${callName}=`, syncIdx);
    if (fullIdx !== -1) {
      console.log(html.slice(fullIdx, fullIdx + 2000));
    }
  }
}
