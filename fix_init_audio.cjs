const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetInit = /state\.trackBusses = \[\];\s*for \(let i=0; i<8; i\+\+\) {\s*let bus = state\.audioCtx\.createGain\(\);\s*bus\.connect\(state\.masterGain\);\s*state\.trackBusses\.push\(bus\);\s*}/;
const replacementInit = `state.trackBusses = [];
            state.trackDelaySends = [];
            state.trackReverbSends = [];
            for (let i=0; i<12; i++) {
                let bus = state.audioCtx.createGain();
                bus.connect(state.masterGain);
                state.trackBusses.push(bus);
                
                let dSend = state.audioCtx.createGain();
                dSend.gain.value = 0;
                bus.connect(dSend);
                state.trackDelaySends.push(dSend);
                
                let rSend = state.audioCtx.createGain();
                rSend.gain.value = 0;
                bus.connect(rSend);
                state.trackReverbSends.push(rSend);
            }`;
html = html.replace(targetInit, replacementInit);
fs.writeFileSync('index.html', html);
console.log('Fixed init audio loop length');
