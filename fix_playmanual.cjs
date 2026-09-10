const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = /const baseVol = padData\.volume !== undefined \? padData\.volume : 1\.0;\s*const pLockVol = pLocks && pLocks\.volume !== undefined \? pLocks\.volume : baseVol;\s*const vol = pLockVol;/;
// But wait, there are two occurrences (playManualPad and triggerSequencerSound).
// I only want to replace the first one (playManualPad) or just use replace() which defaults to the first occurrence.
// Let's check which comes first. playManualPad is defined before triggerSequencerSound.

const replacement = `const vol = padData.volume !== undefined ? padData.volume : 1.0;`;
html = html.replace(target, replacement);

fs.writeFileSync('index.html', html);
console.log('Fixed playManualPad');
