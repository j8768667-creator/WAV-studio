const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// We need the top half sequencer to shrink! It currently has `shrink-0`.
// Let's remove `shrink-0` and add `min-h-0` and `flex-grow` (or maybe keep it fixed if it fits, but it clearly doesn't fit on iPad with 12 tracks).
// Wait, the sequencer grid has 12 tracks, which makes it very tall.
// If the section doesn't shrink, it pushes the bottom half off.
// Let's change `shrink-0` to `flex-shrink min-h-0 min-h-[200px]` on the Sequencer section.
// Also we need to make sure the scroller inside it can scroll vertically.

html = html.replace(/<section class="flex flex-col gap-2 shrink-0 overflow-hidden border border-zinc-800 rounded-xl bg-zinc-900 p-2">/, 
'<section class="flex flex-col gap-2 shrink overflow-hidden border border-zinc-800 rounded-xl bg-zinc-900 p-2 min-h-[200px] max-h-[50vh]">');


// Then ensure the internal scroller has min-h-0 so it works.
html = html.replace(/<div class="scroller flex flex-col gap-2 flex-grow bg-zinc-900 p-1 rounded-xl overflow-x-auto overflow-y-auto relative">/,
'<div class="scroller flex flex-col gap-2 flex-grow bg-zinc-900 p-1 rounded-xl overflow-x-auto overflow-y-auto relative min-h-0">');


fs.writeFileSync('index.html', html);
console.log('Fixed flex constraints 2');
