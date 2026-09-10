const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replacements = [
    // Backgrounds
    [/bg-white/g, "bg-zinc-900"],
    [/bg-zinc-50/g, "bg-zinc-900"],
    [/bg-zinc-100/g, "bg-zinc-800"],
    [/bg-zinc-200/g, "bg-zinc-700"],
    [/bg-zinc-300/g, "bg-zinc-600"],
    
    // Borders
    [/border-zinc-200/g, "border-zinc-800"],
    [/border-zinc-300/g, "border-zinc-700"],
    [/border-zinc-400/g, "border-zinc-600"],
    
    // Text
    [/text-zinc-900/g, "text-zinc-100"],
    [/text-zinc-800/g, "text-zinc-200"],
    [/text-zinc-700/g, "text-zinc-300"],
    [/text-zinc-600/g, "text-zinc-400"],
    [/text-zinc-500/g, "text-zinc-500"],

    // Fix the body background which is not matched because of how I just changed bg-zinc-100?
    // Wait, body has no bg class right now. Let's add bg-black to body.
    [/<body class="p-3 gap-3 flex flex-col antialiased text-zinc-100">/g, '<body class="p-3 gap-3 flex flex-col antialiased text-zinc-100 bg-black">'],
];

for (const [regex, replacement] of replacements) {
    html = html.replace(regex, replacement);
}

// Special case for buttons in the pad editor that were given hardcoded colors
html = html.replace(/bg-yellow-400 text-yellow-900 border border-yellow-400/g, "bg-yellow-600 text-zinc-900 border border-yellow-500");
html = html.replace(/bg-rose-500 text-zinc-100 border border-rose-400/g, "bg-rose-600 text-white border border-rose-500");
html = html.replace(/bg-blue-600 border border-blue-500/g, "bg-blue-600 text-white border border-blue-500");
html = html.replace(/bg-orange-600 border border-orange-500/g, "bg-orange-600 text-white border border-orange-500");


// Revert the pad colors to dark mode
const padColors = [
    [/text-red-700 bg-red-800 border-red-700/g, 'text-red-500 bg-red-950 border-red-800'], // wait, the previous pad colors were bg-red-100 etc. Let's replace the light ones.
    [/text-red-[0-9]+ bg-red-[0-9]+ border-red-[0-9]+/g, 'text-red-500 bg-red-950 border-red-800'],
    [/text-amber-[0-9]+ bg-amber-[0-9]+ border-amber-[0-9]+/g, 'text-amber-500 bg-amber-950 border-amber-800'],
    [/text-lime-[0-9]+ bg-lime-[0-9]+ border-lime-[0-9]+/g, 'text-lime-500 bg-lime-950 border-lime-800'],
    [/text-emerald-[0-9]+ bg-emerald-[0-9]+ border-emerald-[0-9]+/g, 'text-emerald-500 bg-emerald-950 border-emerald-800'],
    [/text-cyan-[0-9]+ bg-cyan-[0-9]+ border-cyan-[0-9]+/g, 'text-cyan-500 bg-cyan-950 border-cyan-800'],
    [/text-blue-[0-9]+ bg-blue-[0-9]+ border-blue-[0-9]+/g, 'text-blue-500 bg-blue-950 border-blue-800'],
    [/text-violet-[0-9]+ bg-violet-[0-9]+ border-violet-[0-9]+/g, 'text-violet-500 bg-violet-950 border-violet-800'],
    [/text-pink-[0-9]+ bg-pink-[0-9]+ border-pink-[0-9]+/g, 'text-pink-500 bg-pink-950 border-pink-800']
];

for (const [regex, replacement] of padColors) {
    html = html.replace(regex, replacement);
}

fs.writeFileSync('index.html', html);
console.log('Dark theme applied');
