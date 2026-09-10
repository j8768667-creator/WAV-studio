const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const pLockProbUIRegex = /const volVal = lock\.volume !== undefined \? lock\.volume : \(state\.pads\[state\.seqTracks\[t\]\.padIndex\]\.volume !== undefined \? state\.pads\[state\.seqTracks\[t\]\.padIndex\]\.volume : 1\.0\);/;
const pLockProbUIReplacement = `
            const volVal = lock.volume !== undefined ? lock.volume : (state.pads[state.seqTracks[t].padIndex].volume !== undefined ? state.pads[state.seqTracks[t].padIndex].volume : 1.0);
            const probVal = lock.prob !== undefined ? lock.prob : 100;
            if (els.pLockProb) {
                els.pLockProb.value = probVal;
                els.pLockProbVal.innerText = probVal + '%';
            }`;

html = html.replace(pLockProbUIRegex, pLockProbUIReplacement);

const pLockProbEventTarget = /els\.btnRemovePLock\.addEventListener\('click', \(\) => {/g;
const pLockProbEventReplacement = `
        if (els.pLockProb) {
            els.pLockProb.addEventListener('input', (e) => {
                if (state.editingPLock) {
                    const {t, s} = state.editingPLock;
                    const prob = parseInt(e.target.value);
                    els.pLockProbVal.innerText = prob + '%';
                    if (!state.seqTracks[t].stepLocks[s]) state.seqTracks[t].stepLocks[s] = {};
                    state.seqTracks[t].stepLocks[s].prob = prob;
                    renderSequencer();
                }
            });
        }
        
        els.btnRemovePLock.addEventListener('click', () => {`;

html = html.replace(pLockProbEventTarget, pLockProbEventReplacement);

fs.writeFileSync('index.html', html);
console.log('Updated pLock prob');
