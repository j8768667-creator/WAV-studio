const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const updateEditorUIRegex = /els\.sliderPan\.value = padData\.pan \|\| 0;\s*els\.lblPan\.innerText = formatPan\(els\.sliderPan\.value\);\s*els\.chkLockSize\.checked = padData\.oneShot;\s*els\.stepSizerInput\.value = padData\.duration\.toFixed\(1\);/;

const updateEditorUIReplacement = `els.sliderPan.value = padData.pan || 0;
            els.lblPan.innerText = formatPan(els.sliderPan.value);
            
            els.sliderAttack.value = padData.attack !== undefined ? padData.attack : 0;
            els.lblAttack.innerText = parseFloat(els.sliderAttack.value).toFixed(2);
            
            els.sliderDecay.value = padData.decay !== undefined ? padData.decay : 10;
            els.lblDecay.innerText = els.sliderDecay.value >= 10 ? 'MAX' : parseFloat(els.sliderDecay.value).toFixed(2);
            
            els.sliderPadDelay.value = padData.delaySend || 0;
            els.lblPadDelay.innerText = Math.round(els.sliderPadDelay.value * 100) + '%';
            
            els.sliderPadReverb.value = padData.reverbSend || 0;
            els.lblPadReverb.innerText = Math.round(els.sliderPadReverb.value * 100) + '%';

            els.chkLockSize.checked = padData.oneShot;
            els.stepSizerInput.value = padData.duration.toFixed(1);`;

html = html.replace(updateEditorUIRegex, updateEditorUIReplacement);

const eventListenersTarget = /els\.sliderPan\.addEventListener\('input', \(e\) => {[\s\S]*?}\);/;
const eventListenersReplacement = `els.sliderPan.addEventListener('input', (e) => {
            if (state.selectedPadIndex !== null) {
                state.pads[state.selectedPadIndex].pan = parseFloat(e.target.value);
                els.lblPan.innerText = formatPan(e.target.value);
            }
        });
        
        els.sliderAttack.addEventListener('input', (e) => {
            if (state.selectedPadIndex !== null) {
                state.pads[state.selectedPadIndex].attack = parseFloat(e.target.value);
                els.lblAttack.innerText = parseFloat(e.target.value).toFixed(2);
            }
        });
        
        els.sliderDecay.addEventListener('input', (e) => {
            if (state.selectedPadIndex !== null) {
                state.pads[state.selectedPadIndex].decay = parseFloat(e.target.value);
                els.lblDecay.innerText = e.target.value >= 10 ? 'MAX' : parseFloat(e.target.value).toFixed(2);
            }
        });
        
        els.sliderPadDelay.addEventListener('input', (e) => {
            if (state.selectedPadIndex !== null) {
                state.pads[state.selectedPadIndex].delaySend = parseFloat(e.target.value);
                els.lblPadDelay.innerText = Math.round(e.target.value * 100) + '%';
            }
        });
        
        els.sliderPadReverb.addEventListener('input', (e) => {
            if (state.selectedPadIndex !== null) {
                state.pads[state.selectedPadIndex].reverbSend = parseFloat(e.target.value);
                els.lblPadReverb.innerText = Math.round(e.target.value * 100) + '%';
            }
        });`;

html = html.replace(eventListenersTarget, eventListenersReplacement);

fs.writeFileSync('index.html', html);
console.log('Updated editor ui logic');
