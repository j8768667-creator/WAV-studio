const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace the entire Pad Editor section
const targetRegex = /<section class="flex flex-row gap-3 shrink-0 h-\[230px\]">([\s\S]*?)<\/section>/;

const replacement = `<section class="flex flex-row gap-3 shrink-0 h-[170px]">
            <!-- Pad Editor -->
            <div class="bg-white border border-zinc-200 rounded-xl p-2 flex-grow flex flex-col min-w-0">
                <div class="flex justify-between items-center shrink-0 h-8 mb-2">
                    <div class="flex gap-2 items-center h-full">
                        <h3 class="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider mr-2 hidden sm:block">Pad Editor</h3>
                        <button id="btnOneShot" class="px-2 h-full bg-zinc-100 border border-zinc-400 rounded-lg font-bold text-[9px] text-zinc-600 transition-colors uppercase">One-Shot</button>
                        <button id="btnGate" class="px-2 h-full bg-blue-600 border border-blue-500 rounded-lg font-bold text-[9px] text-white transition-colors uppercase">Gate</button>
                        <button id="btnReverse" class="px-2 h-full bg-zinc-100 border border-zinc-400 rounded-lg font-bold text-[9px] text-zinc-600 transition-colors uppercase">Rev</button>
                        <button id="btnSplit8" class="px-2 h-full bg-orange-600 border border-orange-500 rounded-lg font-bold text-[9px] text-white transition-colors uppercase sm:ml-2">Split</button>
                        <button id="btnClearPad" class="px-2 h-full bg-red-100 border border-red-300 hover:bg-red-200 rounded-lg font-bold text-[9px] text-red-600 transition-colors uppercase">Clear</button>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-[9px] font-mono text-zinc-600 hidden sm:block">LEN:</label>
                        <input type="number" id="stepSizerInput" min="0.1" max="128" step="0.1" class="w-12 h-6 bg-zinc-100 border border-zinc-300 text-zinc-900 text-[10px] font-mono text-center rounded focus:outline-none focus:border-zinc-500">
                        <label class="flex items-center gap-1 cursor-pointer h-6">
                            <input type="checkbox" id="chkLockSize" class="w-3 h-3 accent-fuchsia-500" checked>
                            <span class="text-[9px] font-mono text-zinc-600 font-bold uppercase">LOCK</span>
                        </label>
                        <span id="editPadLabel" class="text-[10px] font-bold font-mono text-zinc-900 bg-zinc-100 px-2 py-1 rounded ml-1 hidden sm:block">SELECT PAD</span>
                    </div>
                </div>
                
                <div class="flex gap-2 opacity-30 pointer-events-none transition-opacity flex-grow h-full" id="padSettingsPanel">
                    <div class="flex flex-col flex-grow relative overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100">
                        <canvas id="padWaveCanvas" class="absolute inset-0 w-full h-full touch-none"></canvas>
                        <div id="padWaveInfo" class="absolute bottom-1 left-0 right-0 text-[9px] font-mono text-zinc-600 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] text-center uppercase tracking-wide pointer-events-none">SELECT A PAD</div>
                    </div>
                    
                    <div class="flex flex-col justify-evenly bg-zinc-50 rounded-lg p-2 border border-zinc-200 w-24 shrink-0">
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-end">
                                <span class="text-[9px] font-bold font-mono text-zinc-500 uppercase">Pitch</span>
                                <span id="lblPitch" class="text-[9px] font-bold font-mono text-zinc-700 uppercase">0</span>
                            </div>
                            <input type="range" id="sliderPitch" min="-24" max="24" step="1" value="0" class="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-end">
                                <span class="text-[9px] font-bold font-mono text-zinc-500 uppercase">Vol</span>
                                <span id="lblVolume" class="text-[9px] font-bold font-mono text-zinc-700 uppercase">1.0</span>
                            </div>
                            <input type="range" id="sliderVolume" min="0" max="2" step="0.05" value="1" class="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                        </div>
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-end">
                                <span class="text-[9px] font-bold font-mono text-zinc-500 uppercase">Pan</span>
                                <span id="lblPan" class="text-[9px] font-bold font-mono text-zinc-700 uppercase">C</span>
                            </div>
                            <input type="range" id="sliderPan" min="-1" max="1" step="0.05" value="0" class="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer slider-thumb-sm">
                        </div>
                    </div>
                </div>
            </div>
        </section>`;

html = html.replace(targetRegex, replacement);

// Replace CHOPGRID with WAVSEQ
html = html.replace(/<h1 class="text-xl font-black tracking-tighter">CHOP<span class="text-zinc-500">GRID<\/span><\/h1>/g, '<h1 class="text-xl font-black tracking-tighter">WAV<span class="text-zinc-500">SEQ</span></h1>');

// Add antialiased to body
html = html.replace(/<body class="p-3 gap-3 flex flex-col">/g, '<body class="p-3 gap-3 flex flex-col antialiased text-zinc-900">');

// Modify updateEditorUI to use px-2 classes for the pad editor buttons
// We'll just do a basic string replacement for the class names
html = html.replace(/touch-target flex-1 bg-yellow-600/g, 'px-2 h-full bg-yellow-400 text-yellow-900');
html = html.replace(/touch-target flex-1 bg-zinc-100/g, 'px-2 h-full bg-zinc-100');
html = html.replace(/touch-target flex-1 bg-blue-600/g, 'px-2 h-full bg-blue-600');
html = html.replace(/touch-target flex-1 bg-rose-600/g, 'px-2 h-full bg-rose-500 text-white');

// Fix track row height from h-[32px] to h-[28px] to save 4px per row (32px saved total)
html = html.replace(/h-\[32px\]/g, 'h-[28px]');

// Fix track row touch-targets (remove touch-target class from pad and seq-step to prevent them forcing 44px height)
html = html.replace(/assignBtn.className = `pad touch-target /g, 'assignBtn.className = `pad ');
html = html.replace(/stepBtn.className = `seq-step touch-target /g, 'stepBtn.className = `seq-step ');
html = html.replace(/btn.className = `pad touch-target /g, 'btn.className = `pad ');
html = html.replace(/baseClasses = `seq-step touch-target /g, 'baseClasses = `seq-step ');


fs.writeFileSync('index.html', html);
console.log("Updated HTML successfully.");
