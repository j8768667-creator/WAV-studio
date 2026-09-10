const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The issue is that the main flex container `flex flex-col h-screen` has the middle section (sequencer) 
// pushing the bottom section (pad editor) off the screen.
// The sequencer has `flex-grow` but no `min-h-0`.
// Let's make sure the sequencer container has `min-h-0` so it can actually shrink and allow the bottom half to exist.

html = html.replace(/<section class="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl p-2 md:p-3 overflow-hidden flex-grow relative">/, 
'<section class="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl p-2 md:p-3 overflow-hidden flex-grow relative min-h-[300px]">');

html = html.replace(/<div class="scroller flex flex-col gap-2 flex-grow bg-zinc-900 p-1 rounded-xl overflow-x-auto overflow-y-auto relative">/,
'<div class="scroller flex flex-col gap-2 flex-grow bg-zinc-900 p-1 rounded-xl overflow-x-auto overflow-y-auto relative min-h-0">');


fs.writeFileSync('index.html', html);
console.log('Fixed flex constraints');
