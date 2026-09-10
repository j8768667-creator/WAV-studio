const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The `pads` state array is created in three places:
// 1. Initial state
html = html.replace(/pitch: 0,/, `pitch: 0,
                attack: 0,
                decay: 10,
                delaySend: 0,
                reverbSend: 0,`);
                
// 2. Project Loading
// Wait, project loading maps over data.
const projectLoadRegex = /duration: p\.duration,\s*pitch: p\.pitch,\s*volume: p\.volume,\s*pan: p\.pan,/g;
const projectLoadReplacement = `duration: p.duration,
                        pitch: p.pitch,
                        volume: p.volume,
                        pan: p.pan,
                        attack: p.attack,
                        decay: p.decay,
                        delaySend: p.delaySend,
                        reverbSend: p.reverbSend,`;
html = html.replace(projectLoadRegex, projectLoadReplacement);

// 3. Project Saving
// Wait, that's already in the replacement for saving, and loading will just load whatever is there.
// But we need to make sure project saving includes the new fields.
const projectSaveRegex = /duration: p\.duration,\s*pitch: p\.pitch,\s*volume: p\.volume,\s*pan: p\.pan,/g;
// Actually the previous regex hit both!
// Let's verify.
fs.writeFileSync('index.html', html);
console.log('Updated pad state');
