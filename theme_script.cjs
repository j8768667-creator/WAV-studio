const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replacements
const replacements = [
    // Increase height of bottom section
    [/h-\[190px\]/g, "h-[230px]"],
    
    // Backgrounds
    [/bg-black/g, "bg-zinc-100"],
    [/bg-zinc-900/g, "bg-white"],
    // bg-zinc-800 needs to be handled carefully, it's used for pads, unselected buttons, etc.
    [/bg-zinc-800/g, "bg-zinc-100"],
    [/bg-zinc-700/g, "bg-zinc-200"],
    [/bg-zinc-600/g, "bg-zinc-300"],
    
    // Borders
    [/border-zinc-900/g, "border-zinc-300"],
    [/border-zinc-800/g, "border-zinc-200"],
    [/border-zinc-700/g, "border-zinc-300"],
    [/border-zinc-600/g, "border-zinc-400"],
    
    // Text
    [/text-white/g, "text-zinc-900"],
    [/text-zinc-400/g, "text-zinc-600"],
    [/text-zinc-300/g, "text-zinc-700"],
    
    // Need to restore text-white for buttons with vibrant backgrounds
    [/bg-blue-600([^>]+)text-zinc-900/g, "bg-blue-600$1text-white"],
    [/bg-blue-500([^>]+)text-zinc-900/g, "bg-blue-500$1text-white"],
    [/bg-blue-900([^>]+)text-zinc-900/g, "bg-blue-900$1text-white"],
    [/bg-rose-600([^>]+)text-zinc-900/g, "bg-rose-600$1text-white"],
    [/bg-red-500([^>]+)text-zinc-900/g, "bg-red-500$1text-white"],
    [/bg-orange-900([^>]+)text-zinc-900/g, "bg-orange-900$1text-white"],
    [/bg-yellow-600([^>]+)text-zinc-900/g, "bg-yellow-600$1text-white"],
];

for (const [regex, replacement] of replacements) {
    html = html.replace(regex, replacement);
}

fs.writeFileSync('index.html', html);
console.log("Theme updated.");
