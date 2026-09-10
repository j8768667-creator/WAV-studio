const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = /els\.sliderPan\.value = pan;\s*els\.lblPan\.innerText = pan === 0 \? 'C' : \(pan < 0 \? \`L\$\{Math\.abs\(Math\.round\(pan\*100\)\)\}\` : \`R\$\{Math\.round\(pan\*100\)\}\`\);/;
const replacement = `els.sliderPan.value = pan;
            els.lblPan.innerText = pan === 0 ? 'C' : (pan < 0 ? \`L\${Math.abs(Math.round(pan*100))}\` : \`R\${Math.round(pan*100)}\`);
            
            const attack = pad.attack || 0;
            if (els.sliderAttack) els.sliderAttack.value = attack;
            if (els.lblAttack) els.lblAttack.innerText = parseFloat(attack).toFixed(2) + 's';
            
            const decay = pad.decay !== undefined ? pad.decay : 10;
            if (els.sliderDecay) els.sliderDecay.value = decay;
            if (els.lblDecay) els.lblDecay.innerText = parseFloat(decay).toFixed(1) + 's';
            
            const delay = pad.delaySend || 0;
            if (els.sliderPadDelay) els.sliderPadDelay.value = delay;
            if (els.lblPadDelay) els.lblPadDelay.innerText = Math.round(delay * 100) + '%';
            
            const reverb = pad.reverbSend || 0;
            if (els.sliderPadReverb) els.sliderPadReverb.value = reverb;
            if (els.lblPadReverb) els.lblPadReverb.innerText = Math.round(reverb * 100) + '%';`;

html = html.replace(target, replacement);
fs.writeFileSync('index.html', html);
console.log('Fixed updateEditorUI updates');
