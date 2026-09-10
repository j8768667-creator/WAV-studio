const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Upgrade arrays to 12
html = html.replace(/pads: new Array\(8\)/g, 'pads: new Array(12)');
html = html.replace(/stemLeftBuffers = Array\(8\)/g, 'stemLeftBuffers = Array(12)');
html = html.replace(/stemRightBuffers = Array\(8\)/g, 'stemRightBuffers = Array(12)');
html = html.replace(/Array\.from\(\{ length: 8 \}/g, 'Array.from({ length: 12 }');

// 2. Add 4 more colors to palette
const paletteTarget = /const palette = \[\n\s+'text-red-500 bg-red-950 border-red-800',\n\s+'text-amber-500 bg-amber-950 border-amber-800',\n\s+'text-lime-500 bg-lime-950 border-lime-800',\n\s+'text-emerald-500 bg-emerald-950 border-emerald-800',\n\s+'text-cyan-500 bg-cyan-950 border-cyan-800',\n\s+'text-blue-500 bg-blue-950 border-blue-800',\n\s+'text-violet-500 bg-violet-950 border-violet-800',\n\s+'text-pink-500 bg-pink-950 border-pink-800'\n\s+\];/;

const paletteReplacement = `const palette = [
            'text-red-500 bg-red-950 border-red-800',
            'text-orange-500 bg-orange-950 border-orange-800',
            'text-amber-500 bg-amber-950 border-amber-800',
            'text-lime-500 bg-lime-950 border-lime-800',
            'text-emerald-500 bg-emerald-950 border-emerald-800',
            'text-teal-500 bg-teal-950 border-teal-800',
            'text-cyan-500 bg-cyan-950 border-cyan-800',
            'text-blue-500 bg-blue-950 border-blue-800',
            'text-violet-500 bg-violet-950 border-violet-800',
            'text-fuchsia-500 bg-fuchsia-950 border-fuchsia-800',
            'text-pink-500 bg-pink-950 border-pink-800',
            'text-rose-500 bg-rose-950 border-rose-800'
        ];`;
        
html = html.replace(paletteTarget, paletteReplacement);

const paletteHexTarget = /const paletteHex = \['#ef4444', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'\];/;
const paletteHexReplacement = `const paletteHex = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'];`;

html = html.replace(paletteHexTarget, paletteHexReplacement);

// 3. Loops (renderPads, renderSequencer, scheduleStep x2, chokePad? no, split)
// btnSplit8 loop
html = html.replace(/for \(let i = 0; i < 8; i\+\+\) {/g, 'for (let i = 0; i < 12; i++) {');

// renderSequencer loop
html = html.replace(/for \(let t = 0; t < 8; t\+\+\) {/g, 'for (let t = 0; t < 12; t++) {');

// 4. Update the sequencer grid styling to accommodate 12 tracks instead of 8
// We'll leave it shrinking nicely (h-[28px]) but we should ensure the Pad Editor doesn't get squashed to nothing on a small screen
// Right now Pad Editor has `flex-grow overflow-hidden min-h-[170px]`
// And sequencer has `shrink-0`. Let's ensure the container can scroll or the sequencer can shrink?
// Wait, 12 * 28 = 336px.
// 336px + 170px + 72px + 44px = 622px. That easily fits on an iPad.

fs.writeFileSync('index.html', html);
console.log('Upgraded to 12 tracks');
