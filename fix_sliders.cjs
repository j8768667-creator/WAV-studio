const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Change width of slider panel from w-24 to w-32 or w-40
html = html.replace(/<div class="flex flex-col justify-evenly bg-zinc-900 rounded-lg p-2 border border-zinc-800 w-24 shrink-0">/, 
'<div class="flex flex-col justify-evenly bg-zinc-900 rounded-lg p-2 md:p-3 border border-zinc-800 w-32 md:w-48 shrink-0">');

fs.writeFileSync('index.html', html);
console.log('Fixed sliders');
