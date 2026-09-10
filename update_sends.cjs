const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const initAudioRegex = /for \(let i=0; i<12; i\+\+\) {\s*let bus = state\.audioCtx\.createGain\(\);\s*bus\.connect\(state\.masterGain\);\s*state\.trackBusses\.push\(bus\);\s*}/;
const initAudioReplacement = `
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

html = html.replace(initAudioRegex, initAudioReplacement);

const connectSendsRegex = /state\.compMakeupNode\.connect\(state\.delayNode\);\s*state\.delayNode\.connect\(state\.delayFeedback\);\s*state\.delayFeedback\.connect\(state\.delayNode\);\s*state\.delayNode\.connect\(delayMix\);\s*state\.compMakeupNode\.connect\(state\.reverbNode\);\s*state\.reverbNode\.connect\(reverbMix\);/;
const connectSendsReplacement = `
            state.delayNode.connect(state.delayFeedback);
            state.delayFeedback.connect(state.delayNode);
            state.delayNode.connect(delayMix);
            
            state.reverbNode.connect(reverbMix);
            
            for (let i=0; i<12; i++) {
                state.trackDelaySends[i].connect(state.delayNode);
                state.trackReverbSends[i].connect(state.reverbNode);
            }`;

html = html.replace(connectSendsRegex, connectSendsReplacement);

fs.writeFileSync('index.html', html);
console.log('Updated audio engine sends');
