const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix header to wrap and remove fixed height
html = html.replace(/<header class="flex flex-row items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-2 rounded-xl shrink-0 h-\[72px\]">/, 
'<header class="flex flex-wrap items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-2 rounded-xl shrink-0">');

// 2. Unhide effects panel and allow it to shrink/wrap
// from: <div class="hidden lg:flex flex-row gap-2 xl:gap-4 flex-grow max-w-md xl:max-w-3xl px-2 xl:px-4 py-1 bg-zinc-800 rounded-lg border border-zinc-800">
// to: <div class="flex flex-row gap-2 xl:gap-4 flex-grow px-2 xl:px-4 py-1 bg-zinc-800 rounded-lg border border-zinc-800 overflow-x-auto min-w-[300px]">
html = html.replace(/<div class="hidden lg:flex flex-row gap-2 xl:gap-4 flex-grow max-w-md xl:max-w-3xl px-2 xl:px-4 py-1 bg-zinc-800 rounded-lg border border-zinc-800">/, 
'<div class="flex flex-row gap-2 xl:gap-4 flex-grow px-2 xl:px-4 py-1 bg-zinc-800 rounded-lg border border-zinc-800 overflow-x-auto min-w-[300px]">');

fs.writeFileSync('index.html', html);
console.log('Fixed header');
