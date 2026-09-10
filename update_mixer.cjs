const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldCssStr = `        .slider-fader-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 16px;
            background: #e4e4e7;
            border-radius: 3px;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }`;

const customMixerCss = `
        /* Custom Mixer Channels */
        .mixer-channel {
            background: linear-gradient(180deg, #1f2225 0%, #111215 100%);
            border: 1px solid #00ff44;
            box-shadow: inset 0 0 8px rgba(0,255,68,0.1), 0 4px 10px rgba(0,0,0,0.5);
            border-radius: 12px;
        }

        .pan-styled::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 18px;
            background: #111;
            border: 2px solid #00ff44;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(0,255,68,0.8);
            cursor: pointer;
        }

        .vol-styled::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 36px;
            background: linear-gradient(180deg, #ff6a00, #ff2a00);
            border-radius: 6px;
            border: 1px solid #ff8844;
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 12px rgba(255,80,0,0.8);
            cursor: pointer;
            position: relative;
        }

        .vol-track-glow {
            background: linear-gradient(to top, #00ff44 0%, #00ff44 var(--val, 50%), #18181b var(--val, 50%), #18181b 100%);
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.8);
        }

        .mixer-btn {
            background: #27272a;
            color: #71717a;
            border: 1px solid #18181b;
            border-radius: 6px;
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.5);
            transition: all 0.1s;
        }
        .mixer-btn:active {
            transform: translateY(1px);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);
        }
        .mixer-btn.m-active {
            color: #ff5e00;
            border-color: #ff5e00;
            background: #1f120e;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(255,94,0,0.4);
            text-shadow: 0 0 5px rgba(255,94,0,0.8);
        }
        .mixer-btn.s-active {
            color: #00ff44;
            border-color: #00ff44;
            background: #0d1a12;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,255,68,0.4);
            text-shadow: 0 0 5px rgba(0,255,68,0.8);
        }

        .mixer-label-title {
            font-size: 8px;
            font-weight: 800;
            color: #d4d4d8;
            letter-spacing: 1px;
        }`;

if (html.includes(oldCssStr)) {
    html = html.replace(oldCssStr, customMixerCss);
} else {
    console.log("Could not find oldCssStr");
}

const oldRenderMixer = `        function renderMixer() {
            els.mixerPanel.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const padData = state.pads[i];
                const bgBase = padData.buffer ? padData.colorHex : '#3f3f46';
                
                const ch = document.createElement('div');
                // Slightly wider to fit labels nicely, but still fit 12 on screen
                ch.className = 'flex flex-col bg-zinc-800 rounded-lg py-1 px-0.5 min-w-[42px] max-w-[60px] flex-1 shrink-0 border border-zinc-700 justify-between items-center h-full gap-1 relative overflow-hidden';
                
                // Track Label (slimmer py)
                const lbl = document.createElement('div');
                lbl.className = 'text-[8px] font-mono font-bold text-zinc-100 bg-zinc-900 w-full text-center rounded py-0.5 tracking-wider overflow-hidden text-ellipsis';
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
                faderWrap.className = 'relative flex justify-center items-center h-[80px] w-full';
                
                const fader = document.createElement('input');
                fader.type = 'range';
                fader.min = 0; fader.max = 2; fader.step = 0.05;
                fader.value = padData.volume !== undefined ? padData.volume : 1.0;
                // Use a standard range rotated, removing standard styles, to fix bugs and look slimmer
                fader.style.transform = 'rotate(-90deg)';
                fader.style.width = '80px';
                fader.style.height = '4px';
                fader.style.margin = '0';
                fader.style.position = 'absolute';
                fader.className = 'bg-transparent appearance-none cursor-pointer slider-fader-thumb z-10 outline-none';
                
                const faderBg = document.createElement('div');
                faderBg.className = 'absolute inset-y-0 w-[4px] bg-zinc-900 rounded-full border border-zinc-700 pointer-events-none';
                
                fader.addEventListener('input', (e) => {
                    padData.volume = parseFloat(e.target.value);
                    if (state.trackBusses && state.trackBusses[i]) {
                        state.trackBusses[i].gain.value = padData.volume;
                    }
                    if (state.selectedPadIndex === i) {
                        els.sliderVolume.value = padData.volume;
                        els.lblVolume.innerText = padData.volume.toFixed(2);
                    }
                });
                faderWrap.appendChild(faderBg);
                faderWrap.appendChild(fader);
                
                // Mute / Solo buttons (using Sequencer state)
                const btnWrap = document.createElement('div');
                btnWrap.className = 'flex flex-col w-full gap-1 justify-center';
                
                const btnMute = document.createElement('button');
                const isMuted = state.seqTracks[i].muted;
                btnMute.className = \`w-full h-5 rounded flex justify-center items-center text-[9px] font-bold transition-colors \${isMuted ? 'bg-amber-600 text-amber-100' : 'bg-zinc-700 text-zinc-400'}\`;
                btnMute.innerText = 'M';
                btnMute.addEventListener('click', () => {
                    state.seqTracks[i].muted = !state.seqTracks[i].muted;
                    renderMixer();
                    renderSequencer();
                });
                
                const btnSolo = document.createElement('button');
                const isSoloed = state.seqTracks[i].soloed;
                btnSolo.className = \`w-full h-5 rounded flex justify-center items-center text-[9px] font-bold transition-colors \${isSoloed ? 'bg-cyan-600 text-cyan-100' : 'bg-zinc-700 text-zinc-400'}\`;
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
        }`;

const newRenderMixer = `        function renderMixer() {
            els.mixerPanel.innerHTML = '';
            for (let i = 0; i < 12; i++) {
                const padData = state.pads[i];
                
                const ch = document.createElement('div');
                ch.className = 'flex flex-col mixer-channel p-2 min-w-[70px] max-w-[90px] flex-1 shrink-0 justify-between items-center h-full relative overflow-hidden';
                
                // Pan Section
                const panTitle = document.createElement('div');
                panTitle.className = 'mixer-label-title mt-1 mb-1';
                panTitle.innerText = 'PAN';
                ch.appendChild(panTitle);

                const panWrap = document.createElement('div');
                panWrap.className = 'w-full flex justify-center mb-1 relative';
                const panSlider = document.createElement('input');
                panSlider.type = 'range';
                panSlider.min = -1; panSlider.max = 1; panSlider.step = 0.05;
                panSlider.value = padData.pan || 0;
                panSlider.className = 'w-10 h-[6px] bg-black border border-[#111] rounded-full appearance-none cursor-pointer pan-styled shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] outline-none relative z-10';
                
                // Pan track styling element (just visual base)
                const panBase = document.createElement('div');
                panBase.className = 'absolute top-[6px] left-1/2 -translate-x-1/2 w-10 h-[2px] bg-zinc-900 pointer-events-none rounded';

                panSlider.addEventListener('input', (e) => {
                    padData.pan = parseFloat(e.target.value);
                    if (state.selectedPadIndex === i) {
                        els.sliderPan.value = padData.pan;
                        els.lblPan.innerText = formatPan(padData.pan);
                    }
                });
                panWrap.appendChild(panBase);
                panWrap.appendChild(panSlider);
                ch.appendChild(panWrap);
                
                // Vol Section
                const volTitle = document.createElement('div');
                volTitle.className = 'mixer-label-title mt-2 mb-1';
                volTitle.innerText = 'VOLUME';
                ch.appendChild(volTitle);

                const faderWrap = document.createElement('div');
                faderWrap.className = 'relative flex justify-center items-center flex-grow w-full my-1 min-h-[80px]';
                
                const fader = document.createElement('input');
                fader.type = 'range';
                fader.min = 0; fader.max = 2; fader.step = 0.05;
                fader.value = padData.volume !== undefined ? padData.volume : 1.0;
                fader.style.transform = 'rotate(-90deg)';
                fader.style.width = '80px';
                fader.style.height = '6px';
                fader.style.margin = '0';
                fader.style.position = 'absolute';
                fader.className = 'bg-transparent appearance-none cursor-pointer vol-styled z-10 outline-none';
                
                const faderBg = document.createElement('div');
                faderBg.className = 'absolute inset-y-0 w-[6px] rounded-full pointer-events-none vol-track-glow border border-black';
                
                const updateGlow = (val) => {
                    // map 0..2 to 0..100%
                    const pct = Math.min(100, Math.max(0, (val / 2) * 100));
                    faderBg.style.setProperty('--val', pct + '%');
                };
                updateGlow(fader.value);
                
                fader.addEventListener('input', (e) => {
                    padData.volume = parseFloat(e.target.value);
                    updateGlow(padData.volume);
                    if (state.trackBusses && state.trackBusses[i]) {
                        state.trackBusses[i].gain.value = padData.volume;
                    }
                    if (state.selectedPadIndex === i) {
                        els.sliderVolume.value = padData.volume;
                        els.lblVolume.innerText = padData.volume.toFixed(2);
                    }
                });
                faderWrap.appendChild(faderBg);
                faderWrap.appendChild(fader);
                ch.appendChild(faderWrap);
                
                // Mute / Solo buttons
                const btnWrap = document.createElement('div');
                btnWrap.className = 'flex flex-row w-full gap-2 justify-center mt-2';
                
                const btnMute = document.createElement('button');
                const isMuted = state.seqTracks[i].muted;
                btnMute.className = \`w-8 h-6 flex justify-center items-center text-[10px] font-bold mixer-btn \${isMuted ? 'm-active' : ''}\`;
                btnMute.innerText = 'M';
                btnMute.addEventListener('click', () => {
                    state.seqTracks[i].muted = !state.seqTracks[i].muted;
                    renderMixer();
                    renderSequencer();
                });
                
                const btnSolo = document.createElement('button');
                const isSoloed = state.seqTracks[i].soloed;
                btnSolo.className = \`w-8 h-6 flex justify-center items-center text-[10px] font-bold mixer-btn \${isSoloed ? 's-active' : ''}\`;
                btnSolo.innerText = 'S';
                btnSolo.addEventListener('click', () => {
                    state.seqTracks[i].soloed = !state.seqTracks[i].soloed;
                    renderMixer();
                    renderSequencer();
                });
                
                btnWrap.appendChild(btnMute);
                btnWrap.appendChild(btnSolo);
                ch.appendChild(btnWrap);

                // Track Label
                const lbl = document.createElement('div');
                lbl.className = 'text-[9px] font-mono font-bold text-zinc-100 bg-zinc-950/50 w-full text-center rounded mt-2 py-1 tracking-wider overflow-hidden text-ellipsis shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]';
                lbl.style.color = padData.buffer ? '#d4d4d8' : '#52525b';
                lbl.innerText = padData.buffer ? (padData.name || \`TRK \${i+1}\`).substring(0, 8).toUpperCase() : \`TRK \${i+1}\`;
                ch.appendChild(lbl);
                
                els.mixerPanel.appendChild(ch);
            }
        }`;

if (html.includes(oldRenderMixer)) {
    html = html.replace(oldRenderMixer, newRenderMixer);
} else {
    console.log("Could not find oldRenderMixer");
    fs.writeFileSync('debug_mixer.txt', oldRenderMixer);
}

fs.writeFileSync('index.html', html);
console.log('Fixed Mixer UI');
