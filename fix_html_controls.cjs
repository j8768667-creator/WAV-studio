const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = /<div class="flex flex-col justify-evenly bg-zinc-900 rounded-lg p-2 md:p-3 border border-zinc-800 w-32 md:w-48 shrink-0">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>\s*<\/div>/;

const replacement = `<div class="grid grid-cols-2 gap-2 md:gap-3 bg-zinc-900 rounded-lg p-2 md:p-3 border border-zinc-800 w-48 md:w-64 shrink-0 items-center">
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-end">
                                <span class="text-[9px] font-bold font-mono text-zinc-500 uppercase">Pitch</span>
                                <span id="lblPitch" class="text-[9px] font-bold font-mono text-zinc-300 uppercase">0</span>
                            </div>
                            <input type="range" id="sliderPitch" min="-24" max="24" step="1" value="0" class="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-end">
                                <span class="text-[9px] font-bold font-mono text-zinc-500 uppercase">Vol</span>
                                <span id="lblVolume" class="text-[9px] font-bold font-mono text-zinc-300 uppercase">1.0</span>
                            </div>
                            <input type="range" id="sliderVolume" min="0" max="2" step="0.05" value="1" class="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-end">
                                <span class="text-[9px] font-bold font-mono text-zinc-500 uppercase">Pan</span>
                                <span id="lblPan" class="text-[9px] font-bold font-mono text-zinc-300 uppercase">C</span>
                            </div>
                            <input type="range" id="sliderPan" min="-1" max="1" step="0.05" value="0" class="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-end">
                                <span class="text-[9px] font-bold font-mono text-zinc-500 uppercase">Atk</span>
                                <span id="lblAttack" class="text-[9px] font-bold font-mono text-zinc-300 uppercase">0s</span>
                            </div>
                            <input type="range" id="sliderAttack" min="0" max="2" step="0.01" value="0" class="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-end">
                                <span class="text-[9px] font-bold font-mono text-zinc-500 uppercase">Dec</span>
                                <span id="lblDecay" class="text-[9px] font-bold font-mono text-zinc-300 uppercase">10s</span>
                            </div>
                            <input type="range" id="sliderDecay" min="0" max="10" step="0.1" value="10" class="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-end">
                                <span class="text-[9px] font-bold font-mono text-zinc-500 uppercase">Dly</span>
                                <span id="lblPadDelay" class="text-[9px] font-bold font-mono text-zinc-300 uppercase">0%</span>
                            </div>
                            <input type="range" id="sliderPadDelay" min="0" max="1" step="0.01" value="0" class="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-end">
                                <span class="text-[9px] font-bold font-mono text-zinc-500 uppercase">Rev</span>
                                <span id="lblPadReverb" class="text-[9px] font-bold font-mono text-zinc-300 uppercase">0%</span>
                            </div>
                            <input type="range" id="sliderPadReverb" min="0" max="1" step="0.01" value="0" class="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                        </div>
                    </div>
                </div>
            </div>
        </section>
</div>`;

html = html.replace(target, replacement);
fs.writeFileSync('index.html', html);
console.log('Fixed HTML controls');
