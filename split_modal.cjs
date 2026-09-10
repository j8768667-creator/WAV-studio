const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Clear All button
const btnClearPadStr = '<button id="btnClearPad" class="px-2 h-full bg-red-100 border border-red-300 hover:bg-red-200 rounded-lg font-bold text-[9px] text-red-600 transition-colors uppercase">Clear</button>';
const btnClearReplacement = btnClearPadStr + '\n                        <button id="btnClearAll" class="px-2 h-full bg-red-900 border border-red-700 hover:bg-red-800 rounded-lg font-bold text-[9px] text-red-200 transition-colors uppercase">Clear All</button>';
html = html.replace(btnClearPadStr, btnClearReplacement);

// 2. Add Split Modal
const pLockModalEnd = '    <!-- P-Lock Editor Modal -->';
const splitModalHTML = `    <!-- Split Options Modal -->
    <div id="splitModal" class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-zinc-900 border border-orange-500/50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] p-4 rounded-lg flex-col gap-4 min-w-[250px]">
        <div class="text-xs font-mono text-orange-400 uppercase font-bold tracking-wider">Split Audio</div>
        <div class="flex flex-col gap-3 bg-zinc-800 rounded p-3">
            <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold font-mono text-zinc-400 uppercase w-16">Split By</span>
                <select id="splitMode" class="bg-zinc-700 text-zinc-200 text-[10px] font-mono rounded px-2 py-1 flex-grow outline-none border border-zinc-600">
                    <option value="number">Number of Slices</option>
                    <option value="bars">Bars / Beats</option>
                    <option value="seconds">Seconds</option>
                </select>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold font-mono text-zinc-400 uppercase w-16" id="splitValueLabel">Slices</span>
                <input type="number" id="splitValue" min="1" max="12" step="1" value="4" class="w-full h-6 bg-zinc-700 border border-zinc-600 text-zinc-100 text-[10px] font-mono px-2 rounded focus:outline-none focus:border-zinc-500">
            </div>
        </div>
        <div class="text-[9px] font-mono text-zinc-500 uppercase text-center" id="splitInfo">Will write to available empty pads.</div>
        <div class="flex justify-between gap-2 mt-1">
            <button id="btnCancelSplit" class="text-[10px] font-bold bg-zinc-700 hover:bg-zinc-600 text-zinc-100 px-4 py-2 rounded flex-1 uppercase transition-colors">Cancel</button>
            <button id="btnConfirmSplit" class="text-[10px] font-bold bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded flex-1 uppercase transition-colors">Write Splits</button>
        </div>
    </div>

`;
html = html.replace(pLockModalEnd, splitModalHTML + pLockModalEnd);

fs.writeFileSync('index.html', html);
