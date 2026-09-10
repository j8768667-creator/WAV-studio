const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = /chokePad\(padData\);/;
const replacement = `chokePad(padData);
            if (state.trackDelaySends && state.trackDelaySends[padIndex]) {
                state.trackDelaySends[padIndex].gain.value = padData.delaySend || 0;
            }
            if (state.trackReverbSends && state.trackReverbSends[padIndex]) {
                state.trackReverbSends[padIndex].gain.value = padData.reverbSend || 0;
            }`;
            
html = html.replace(target, replacement);
fs.writeFileSync('index.html', html);
console.log('Fixed sends for manual play');
