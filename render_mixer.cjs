const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const updateEditorUI = /function updateEditorUI\(\) {/;
const renderMixerReplacement = `
        function renderMixer() {
            els.mixerPanel.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const padData = state.pads[i];
                const bgBase = padData.buffer ? padData.colorHex : '#3f3f46';
                
                const ch = document.createElement('div');
                ch.className = 'flex flex-col bg-zinc-800 rounded-lg p-2 min-w-[50px] shrink-0 border border-zinc-700 justify-between items-center h-full gap-2 relative';
                
                // Track Label
                const lbl = document.createElement('div');
                lbl.className = 'text-[9px] font-mono font-bold text-zinc-100 bg-zinc-900 w-full text-center rounded py-1 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis';
                lbl.style.color = padData.buffer ? bgBase : '#a1a1aa';
                lbl.innerText = \`T\${i+1}\`;
                
                // Pan slider
                const panWrap = document.createElement('div');
                panWrap.className = 'w-full flex justify-center';
                const panSlider = document.createElement('input');
                panSlider.type = 'range';
                panSlider.min = -1; panSlider.max = 1; panSlider.step = 0.05;
                panSlider.value = padData.pan || 0;
                panSlider.className = 'w-[80%] h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-thumb-sm';
                panSlider.addEventListener('input', (e) => {
                    padData.pan = parseFloat(e.target.value);
                    if (state.selectedPadIndex === i) {
                        els.sliderPan.value = padData.pan;
                        els.lblPan.innerText = formatPan(padData.pan);
                    }
                });
                panWrap.appendChild(panSlider);
                
                // Volume Fader
                const faderWrap = document.createElement('div');
                faderWrap.className = 'flex-grow w-full relative flex justify-center items-center h-[80px]';
                
                const fader = document.createElement('input');
                fader.type = 'range';
                fader.min = 0; fader.max = 2; fader.step = 0.05;
                fader.value = padData.volume !== undefined ? padData.volume : 1.0;
                fader.className = 'w-[6px] h-full bg-black rounded-lg appearance-none cursor-pointer slider-fader z-10';
                
                const faderBg = document.createElement('div');
                faderBg.className = 'absolute inset-y-0 w-[6px] bg-zinc-900 rounded-full border border-zinc-700 pointer-events-none';
                
                fader.addEventListener('input', (e) => {
                    padData.volume = parseFloat(e.target.value);
                    if (state.selectedPadIndex === i) {
                        els.sliderVolume.value = padData.volume;
                        els.lblVolume.innerText = padData.volume.toFixed(2);
                    }
                });
                faderWrap.appendChild(faderBg);
                faderWrap.appendChild(fader);
                
                // Mute / Solo buttons (using Sequencer state)
                const btnWrap = document.createElement('div');
                btnWrap.className = 'flex w-full gap-1 justify-center';
                
                const btnMute = document.createElement('button');
                const isMuted = state.seqTracks[i].muted;
                btnMute.className = \`w-6 h-6 rounded flex justify-center items-center text-[9px] font-bold transition-colors \${isMuted ? 'bg-amber-600 text-amber-100' : 'bg-zinc-700 text-zinc-400'}\`;
                btnMute.innerText = 'M';
                btnMute.addEventListener('click', () => {
                    state.seqTracks[i].muted = !state.seqTracks[i].muted;
                    renderMixer();
                    renderSequencer();
                });
                
                const btnSolo = document.createElement('button');
                const isSoloed = state.seqTracks[i].soloed;
                btnSolo.className = \`w-6 h-6 rounded flex justify-center items-center text-[9px] font-bold transition-colors \${isSoloed ? 'bg-cyan-600 text-cyan-100' : 'bg-zinc-700 text-zinc-400'}\`;
                btnSolo.innerText = 'S';
                btnSolo.addEventListener('click', () => {
                    state.seqTracks[i].soloed = !state.seqTracks[i].soloed;
                    renderMixer();
                    renderSequencer();
                });
                
                btnWrap.appendChild(btnMute);
                btnWrap.appendChild(btnSolo);
                
                ch.appendChild(lbl);
                ch.appendChild(panWrap);
                ch.appendChild(faderWrap);
                ch.appendChild(btnWrap);
                
                els.mixerPanel.appendChild(ch);
            }
        }
function updateEditorUI() {`;

html = html.replace(updateEditorUI, renderMixerReplacement);
fs.writeFileSync('index.html', html);
console.log('Added renderMixer');
