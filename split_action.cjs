const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = /els\.btnSplit8\.addEventListener\('click', \(\) => {[\s\S]*?els\.audioInput\.addEventListener\('change', async \(e\) => {/;

const replacementStr = `els.splitMode.addEventListener('change', (e) => {
            const mode = e.target.value;
            if (mode === 'number') {
                els.splitValueLabel.innerText = 'Slices';
                els.splitValue.min = 1;
                els.splitValue.max = 12;
                els.splitValue.step = 1;
                els.splitValue.value = 4;
            } else if (mode === 'bars') {
                els.splitValueLabel.innerText = 'Bars';
                els.splitValue.min = 0.25;
                els.splitValue.max = 16;
                els.splitValue.step = 0.25;
                els.splitValue.value = 1;
            } else if (mode === 'seconds') {
                els.splitValueLabel.innerText = 'Seconds';
                els.splitValue.min = 0.1;
                els.splitValue.max = 30;
                els.splitValue.step = 0.1;
                els.splitValue.value = 1.0;
            }
            updateSplitInfo();
        });
        
        function updateSplitInfo() {
            if (state.selectedPadIndex === null) return;
            const sourcePad = state.pads[state.selectedPadIndex];
            if (!sourcePad.buffer) return;
            
            const mode = els.splitMode.value;
            const val = parseFloat(els.splitValue.value);
            let numSplits = 1;
            
            if (mode === 'number') {
                numSplits = val;
            } else if (mode === 'bars') {
                const beatLen = 60.0 / state.bpm;
                const barLen = beatLen * 4;
                const chunkLen = barLen * val;
                numSplits = Math.ceil(sourcePad.buffer.duration / chunkLen);
            } else if (mode === 'seconds') {
                numSplits = Math.ceil(sourcePad.buffer.duration / val);
            }
            
            els.splitInfo.innerText = \`This will create \${numSplits} slices on available empty pads.\`;
        }
        
        els.splitValue.addEventListener('input', updateSplitInfo);

        els.btnSplit8.addEventListener('click', () => {
            if (state.selectedPadIndex === null) return;
            const sourcePad = state.pads[state.selectedPadIndex];
            
            if (!sourcePad.buffer) {
                alert("Selected pad has no audio loaded.");
                return;
            }

            if (sourcePad.buffer.duration < 0.05) {
                alert("Sample too short to split.");
                return;
            }
            
            updateSplitInfo();
            els.splitModal.classList.remove('hidden');
            els.splitModal.classList.add('flex');
        });
        
        els.btnCancelSplit.addEventListener('click', () => {
            els.splitModal.classList.add('hidden');
            els.splitModal.classList.remove('flex');
        });
        
        els.btnConfirmSplit.addEventListener('click', () => {
            els.splitModal.classList.add('hidden');
            els.splitModal.classList.remove('flex');
            
            if (state.selectedPadIndex === null) return;
            const sourcePad = state.pads[state.selectedPadIndex];
            const sourceBuffer = sourcePad.buffer;
            const sourceName = sourcePad.label || "Sample";
            
            if (!sourceBuffer) return;
            
            const mode = els.splitMode.value;
            const val = parseFloat(els.splitValue.value);
            
            let sliceLengths = [];
            
            if (mode === 'number') {
                const len = sourceBuffer.duration / val;
                for(let i=0; i<val; i++) sliceLengths.push(len);
            } else if (mode === 'bars') {
                const beatLen = 60.0 / state.bpm;
                const barLen = beatLen * 4;
                const chunkLen = barLen * val;
                
                let cur = 0;
                while (cur < sourceBuffer.duration) {
                    const remain = sourceBuffer.duration - cur;
                    sliceLengths.push(Math.min(chunkLen, remain));
                    cur += chunkLen;
                }
            } else if (mode === 'seconds') {
                let cur = 0;
                while (cur < sourceBuffer.duration) {
                    const remain = sourceBuffer.duration - cur;
                    sliceLengths.push(Math.min(val, remain));
                    cur += val;
                }
            }
            
            let availablePads = [];
            for (let i = 0; i < 12; i++) {
                if (!state.pads[i].buffer || i === state.selectedPadIndex) {
                    availablePads.push(i);
                }
            }
            
            if (availablePads.length === 0) {
                alert("No empty pads available for split.");
                return;
            }
            
            // Limit splits to available pads
            const numSplits = Math.min(sliceLengths.length, availablePads.length);
            
            let currentOffset = 0;
            for (let i = 0; i < numSplits; i++) {
                const targetIndex = availablePads[i];
                const pad = state.pads[targetIndex];
                const slen = sliceLengths[i];
                
                killPadAudio(pad);
                pad.buffer = sourceBuffer;
                pad.sourceType = sourcePad.sourceType;
                pad.fileData = sourcePad.fileData;
                pad.synthName = sourcePad.synthName;
                pad.offset = currentOffset;
                pad.duration = slen;
                pad.colorClass = palette[targetIndex];
                pad.colorHex = paletteHex[targetIndex];
                pad.label = \`\${sourceName} [\${i+1}]\`;
                
                currentOffset += slen;
            }
            
            renderPads();
            renderSequencer();
            updateEditorUI();
            renderMixer();
        });

        els.audioInput.addEventListener('change', async (e) => {`;
html = html.replace(targetStr, replacementStr);
fs.writeFileSync('index.html', html);
console.log('Added advanced split modal logic');
