const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix fader slider UI rotation and sizing in renderMixer
const mixerFaderStr = `                // Volume Fader
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
                faderWrap.appendChild(fader);`;

const newMixerFader = `                // Volume Fader
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
                fader.className = 'bg-black rounded-lg appearance-none cursor-pointer slider-thumb-sm z-10 outline-none';
                
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
                faderWrap.appendChild(fader);`;
html = html.replace(mixerFaderStr, newMixerFader);

// 2. Fix padEditor slider event listener to also update bus gain
const padEditorSlider = `        els.sliderVolume.addEventListener('input', (e) => {
            if (state.selectedPadIndex !== null) {
                const vol = parseFloat(e.target.value);
                state.pads[state.selectedPadIndex].volume = vol;
                els.lblVolume.innerText = vol.toFixed(2);
            }
        });`;
const newPadEditorSlider = `        els.sliderVolume.addEventListener('input', (e) => {
            if (state.selectedPadIndex !== null) {
                const vol = parseFloat(e.target.value);
                state.pads[state.selectedPadIndex].volume = vol;
                if (state.trackBusses && state.trackBusses[state.selectedPadIndex]) {
                    state.trackBusses[state.selectedPadIndex].gain.value = vol;
                }
                els.lblVolume.innerText = vol.toFixed(2);
            }
        });`;
html = html.replace(padEditorSlider, newPadEditorSlider);


// 3. Fix initAudioEngine trackbus default gain
const initBusStr = `                let bus = state.audioCtx.createGain();
                bus.connect(state.masterGain);
                state.trackBusses.push(bus);`;
const newInitBusStr = `                let bus = state.audioCtx.createGain();
                bus.gain.value = state.pads[i].volume !== undefined ? state.pads[i].volume : 1.0;
                bus.connect(state.masterGain);
                state.trackBusses.push(bus);`;
html = html.replace(initBusStr, newInitBusStr);

// 4. Update playManualPad to NOT double-apply the volume!
const playManualStr = `            const vol = Number(padData.volume !== undefined ? padData.volume : 1.0);
            const attack = Number(padData.attack || 0);
            const decay = Number(padData.decay !== undefined ? padData.decay : 10);
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(vol, time + attack + 0.005);`;
const newPlayManualStr = `            const pVol = 1.0; // Volume is now entirely handled by trackBusses!
            const attack = Number(padData.attack || 0);
            const decay = Number(padData.decay !== undefined ? padData.decay : 10);
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(pVol, time + attack + 0.005);`;
html = html.replace(playManualStr, newPlayManualStr);
const playManualFade = `                const fadeDur = Math.min(0.015, actualDur / 2);
                gain.gain.setValueAtTime(vol, time + actualDur - fadeDur);
                gain.gain.linearRampToValueAtTime(0, time + actualDur);`;
const newPlayManualFade = `                const fadeDur = Math.min(0.015, actualDur / 2);
                gain.gain.setValueAtTime(pVol, time + actualDur - fadeDur);
                gain.gain.linearRampToValueAtTime(0, time + actualDur);`;
html = html.replace(playManualFade, newPlayManualFade);

// 5. Update triggerSequencerSound to NOT double-apply the volume, but support p-locks
const triggerSeqStr = `            const padVol = padData.volume !== undefined ? padData.volume : 1.0;
            const effectiveVol = pLocks && pLocks.volume !== undefined ? pLocks.volume : padVol;

            const gain = state.audioCtx.createGain();
            const attack = Number(padData.attack || 0);
            const decay = Number(padData.decay !== undefined ? padData.decay : 10);
            
            gain.gain.setValueAtTime(0, scheduledTime);
            gain.gain.linearRampToValueAtTime(Number(effectiveVol), scheduledTime + attack + 0.005);`;

const newTriggerSeqStr = `            // padData.volume is applied via the track bus. pLocks.volume acts as a relative modifier.
            const baseVol = 1.0;
            const effectiveVol = pLocks && pLocks.volume !== undefined ? pLocks.volume : baseVol;

            const gain = state.audioCtx.createGain();
            const attack = Number(padData.attack || 0);
            const decay = Number(padData.decay !== undefined ? padData.decay : 10);
            
            gain.gain.setValueAtTime(0, scheduledTime);
            gain.gain.linearRampToValueAtTime(Number(effectiveVol), scheduledTime + attack + 0.005);`;
html = html.replace(triggerSeqStr, newTriggerSeqStr);

// 6. Fix channel UI structure to make it slimmer and show headers
const mixerChStr = `                const ch = document.createElement('div');
                ch.className = 'flex flex-col bg-zinc-800 rounded-lg p-2 min-w-[50px] shrink-0 border border-zinc-700 justify-between items-center h-full gap-2 relative';
                
                // Track Label
                const lbl = document.createElement('div');
                lbl.className = 'text-[9px] font-mono font-bold text-zinc-100 bg-zinc-900 w-full text-center rounded py-1 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis';`;
const newMixerChStr = `                const ch = document.createElement('div');
                // Slimmer padding (p-1), slimmer gap (gap-1), max-width to prevent overflow stretching
                ch.className = 'flex flex-col bg-zinc-800 rounded-lg p-1 min-w-[38px] max-w-[48px] flex-1 shrink-0 border border-zinc-700 justify-between items-center h-full gap-1 relative overflow-hidden';
                
                // Track Label (slimmer py)
                const lbl = document.createElement('div');
                lbl.className = 'text-[8px] font-mono font-bold text-zinc-100 bg-zinc-900 w-full text-center rounded py-0.5 tracking-wider overflow-hidden text-ellipsis';`;
html = html.replace(mixerChStr, newMixerChStr);


fs.writeFileSync('index.html', html);
console.log('Fixed mixer volume mapping and slimmed down mixer track widths');
