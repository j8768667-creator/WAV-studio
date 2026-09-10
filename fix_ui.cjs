const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix file input to allow folder selection
html = html.replace(/<input type="file" id="audioInput" multiple accept="\.wav,audio\/wav,audio\/x-wav">/g, 
'<input type="file" id="audioInput" multiple webkitdirectory directory accept=".wav,audio/wav,audio/x-wav">');

// 2. Fix the sequencer height. User asked to REDUCE the space below sequencer.
// We have: <main class="flex-grow flex flex-col gap-3 overflow-hidden">
// The sequencer has: <section class="flex flex-col gap-2 flex-grow overflow-hidden border border-zinc-200 rounded-xl bg-white p-2">
// Change sequencer to NOT be flex-grow, or make it shrink based on content?
// Wait, the tracks are fixed height (h-[28px]). 8 tracks * 28px = 224px.
// Let's just remove flex-grow from the sequencer section, and let it size naturally.
html = html.replace(/<section class="flex flex-col gap-2 flex-grow overflow-hidden border/g, 
'<section class="flex flex-col gap-2 shrink-0 overflow-hidden border');

// 3. And make the Pad Editor fill the rest of the space (INCREASE pad editor)
// It was: <section class="flex flex-row gap-3 shrink-0 h-[170px]">
// Change it to: <section class="flex flex-row gap-3 flex-grow overflow-hidden min-h-[170px]">
html = html.replace(/<section class="flex flex-row gap-3 shrink-0 h-\[170px\]">/g, 
'<section class="flex flex-row gap-3 flex-grow overflow-hidden min-h-[170px]">');

fs.writeFileSync('index.html', html);
console.log('UI structure fixes applied');
