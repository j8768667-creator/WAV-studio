const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexEls = /lblPan: document\.getElementById\('lblPan'\),/g;
const replacementEls = `lblPan: document.getElementById('lblPan'),
            sliderAttack: document.getElementById('sliderAttack'),
            lblAttack: document.getElementById('lblAttack'),
            sliderDecay: document.getElementById('sliderDecay'),
            lblDecay: document.getElementById('lblDecay'),
            sliderPadDelay: document.getElementById('sliderPadDelay'),
            lblPadDelay: document.getElementById('lblPadDelay'),
            sliderPadReverb: document.getElementById('sliderPadReverb'),
            lblPadReverb: document.getElementById('lblPadReverb'),
            tabPadEditor: document.getElementById('tabPadEditor'),
            tabMixer: document.getElementById('tabMixer'),
            padEditorContainer: document.getElementById('padEditorContainer'),
            mixerPanel: document.getElementById('mixerPanel'),
            pLockProb: document.getElementById('pLockProb'),
            pLockProbVal: document.getElementById('pLockProbVal'),`;

html = html.replace(regexEls, replacementEls);
fs.writeFileSync('index.html', html);
console.log('Updated els object');
