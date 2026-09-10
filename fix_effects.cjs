const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The issue is that the effects panel (DRIVE, HPF, etc) overlaps the GEN KIT button on smaller screens 
// because it has `flex-grow max-w-3xl`.
// Change it to `flex flex-row gap-2 md:gap-4 shrink-0 min-w-0 max-w-md md:max-w-xl lg:max-w-3xl px-2 md:px-4 py-1 bg-zinc-800 rounded-lg border border-zinc-800` 
// and make sure it can shrink if necessary.
// Let's actually use flex-wrap or just make it hide elements if it's too small, or allow it to shrink more.

html = html.replace(/<div class="flex flex-row gap-4 flex-grow max-w-3xl px-4 py-1 bg-zinc-800 rounded-lg border border-zinc-800">/, 
'<div class="hidden lg:flex flex-row gap-2 xl:gap-4 flex-grow max-w-md xl:max-w-3xl px-2 xl:px-4 py-1 bg-zinc-800 rounded-lg border border-zinc-800">');

// We also need to fix the zoom handles being removed.
// In the user's screenshot, they said "remove magnify" pointing to the small yellow handles.
// This means the zoom feature is no longer needed since dragging works differently.
// Let's remove the logic that draws the little handles in drawWaveform.
const handleLogicRegex = /\/\/ 3\. Draw Handles[\s\S]*?if \(showHandles\) \{[\s\S]*?ctx\.clip\(\); \/\/ Mask contents to rounded rect/g;

// Instead of removing the block completely, we'll replace it with empty space.
html = html.replace(handleLogicRegex, '// 3. Draw Handles (Removed per request)');

fs.writeFileSync('index.html', html);
console.log('Fixed effects layout and removed magnify handles');
