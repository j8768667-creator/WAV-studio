const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The original palette array:
// 'text-red-500 bg-red-950 border-red-800'

const rep = [
    [/text-red-500 bg-red-950 border-red-800/g, 'text-red-700 bg-red-100 border-red-300'],
    [/text-amber-500 bg-amber-950 border-amber-800/g, 'text-amber-700 bg-amber-100 border-amber-300'],
    [/text-lime-500 bg-lime-950 border-lime-800/g, 'text-lime-700 bg-lime-100 border-lime-300'],
    [/text-emerald-500 bg-emerald-950 border-emerald-800/g, 'text-emerald-700 bg-emerald-100 border-emerald-300'],
    [/text-cyan-500 bg-cyan-950 border-cyan-800/g, 'text-cyan-700 bg-cyan-100 border-cyan-300'],
    [/text-blue-500 bg-blue-950 border-blue-800/g, 'text-blue-700 bg-blue-100 border-blue-300'],
    [/text-violet-500 bg-violet-950 border-violet-800/g, 'text-violet-700 bg-violet-100 border-violet-300'],
    [/text-pink-500 bg-pink-950 border-pink-800/g, 'text-pink-700 bg-pink-100 border-pink-300']
];

for (const [r, w] of rep) {
    html = html.replace(r, w);
}

fs.writeFileSync('index.html', html);
console.log('Pad themes updated');
