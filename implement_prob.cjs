const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const plockRegex = /<span id="pLockPitchVal" class="text-\[9px\] font-bold font-mono text-zinc-300 w-6 text-right">0<\/span>\s*<\/div>\s*<div class="flex items-center gap-2">\s*<span class="text-\[9px\] font-bold font-mono text-zinc-400 uppercase w-8">Vol<\/span>\s*<input type="range" id="pLockVolume" min="0" max="2" step="0.05" value="1" class="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm">\s*<span id="pLockVolumeVal" class="text-\[9px\] font-bold font-mono text-zinc-300 w-6 text-right">1.0<\/span>\s*<\/div>\s*<\/div>/;

const replacement = `<span id="pLockPitchVal" class="text-[9px] font-bold font-mono text-zinc-300 w-6 text-right">0</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[9px] font-bold font-mono text-zinc-400 uppercase w-8">Vol</span>
                <input type="range" id="pLockVolume" min="0" max="2" step="0.05" value="1" class="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                <span id="pLockVolumeVal" class="text-[9px] font-bold font-mono text-zinc-300 w-6 text-right">1.0</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[9px] font-bold font-mono text-zinc-400 uppercase w-8">Prob</span>
                <input type="range" id="pLockProb" min="0" max="100" step="5" value="100" class="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                <span id="pLockProbVal" class="text-[9px] font-bold font-mono text-zinc-300 w-6 text-right">100%</span>
            </div>
        </div>`;

html = html.replace(plockRegex, replacement);
fs.writeFileSync('index.html', html);
console.log('Added P-Lock Probability');
