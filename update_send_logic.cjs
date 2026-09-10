const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const eventListenersRegex = /state\.pads\[state\.selectedPadIndex\]\.delaySend = parseFloat\(e\.target\.value\);\s*els\.lblPadDelay\.innerText = Math\.round\(e\.target\.value \* 100\) \+ '%';/g;
const eventListenersReplacement = `
                const val = parseFloat(e.target.value);
                state.pads[state.selectedPadIndex].delaySend = val;
                if (state.trackDelaySends && state.trackDelaySends[state.selectedPadIndex]) {
                    state.trackDelaySends[state.selectedPadIndex].gain.value = val;
                }
                els.lblPadDelay.innerText = Math.round(val * 100) + '%';`;

html = html.replace(eventListenersRegex, eventListenersReplacement);

const eventListenersRegex2 = /state\.pads\[state\.selectedPadIndex\]\.reverbSend = parseFloat\(e\.target\.value\);\s*els\.lblPadReverb\.innerText = Math\.round\(e\.target\.value \* 100\) \+ '%';/g;
const eventListenersReplacement2 = `
                const val = parseFloat(e.target.value);
                state.pads[state.selectedPadIndex].reverbSend = val;
                if (state.trackReverbSends && state.trackReverbSends[state.selectedPadIndex]) {
                    state.trackReverbSends[state.selectedPadIndex].gain.value = val;
                }
                els.lblPadReverb.innerText = Math.round(val * 100) + '%';`;

html = html.replace(eventListenersRegex2, eventListenersReplacement2);

const triggerSeqSyncRegex = /const pLocks = state\.seqTracks\[t\]\.stepLocks \? state\.seqTracks\[t\]\.stepLocks\[tStep\] : null;\s*triggerSequencerSound\(state\.seqTracks\[t\]\.padIndex, stepTime, basePlayDuration, pLocks\);/g;
const triggerSeqSyncReplacement = `
                    const pLocks = state.seqTracks[t].stepLocks ? state.seqTracks[t].stepLocks[tStep] : null;
                    if (pLocks && pLocks.prob !== undefined) {
                        if (Math.random() * 100 > pLocks.prob) continue;
                    }
                    if (state.trackDelaySends && state.trackDelaySends[t]) {
                        state.trackDelaySends[t].gain.value = padData.delaySend || 0;
                    }
                    if (state.trackReverbSends && state.trackReverbSends[t]) {
                        state.trackReverbSends[t].gain.value = padData.reverbSend || 0;
                    }
                    triggerSequencerSound(state.seqTracks[t].padIndex, stepTime, basePlayDuration, pLocks);`;

html = html.replace(triggerSeqSyncRegex, triggerSeqSyncReplacement);

fs.writeFileSync('index.html', html);
console.log('Updated send logic and prob');
