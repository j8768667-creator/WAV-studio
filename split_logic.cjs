const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetObj = /btnClearPad: document\.getElementById\('btnClearPad'\),/;
const replacementObj = `btnClearPad: document.getElementById('btnClearPad'),
            btnClearAll: document.getElementById('btnClearAll'),
            splitModal: document.getElementById('splitModal'),
            splitMode: document.getElementById('splitMode'),
            splitValueLabel: document.getElementById('splitValueLabel'),
            splitValue: document.getElementById('splitValue'),
            splitInfo: document.getElementById('splitInfo'),
            btnCancelSplit: document.getElementById('btnCancelSplit'),
            btnConfirmSplit: document.getElementById('btnConfirmSplit'),`;
html = html.replace(targetObj, replacementObj);

// Add Clear All logic
const clearTarget = /els\.btnClearPad\.addEventListener\('click', \(\) => {[\s\S]*?}\);/;
const clearLogic = `els.btnClearPad.addEventListener('click', () => {
            if (state.selectedPadIndex !== null) {
                const pad = state.pads[state.selectedPadIndex];
                killPadAudio(pad);
                pad.buffer = null;
                pad.offset = 0;
                pad.duration = 1;
                pad.label = '';
                pad.sourceType = null;
                pad.fileData = null;
                pad.synthName = null;
                
                renderPads();
                renderMixer();
                updateEditorUI();
            }
        });
        
        els.btnClearAll.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all loaded samples?")) {
                state.pads.forEach((pad, i) => {
                    killPadAudio(pad);
                    pad.buffer = null;
                    pad.offset = 0;
                    pad.duration = 1;
                    pad.label = '';
                    pad.sourceType = null;
                    pad.fileData = null;
                    pad.synthName = null;
                    
                    // Reset FX
                    pad.pan = 0;
                    pad.volume = 1.0;
                    pad.attack = 0;
                    pad.decay = 10;
                    pad.delaySend = 0;
                    pad.reverbSend = 0;
                    
                    // Reset Seq Tracks
                    state.seqTracks[i].muted = false;
                    state.seqTracks[i].soloed = false;
                });
                state.audioPool = [];
                renderPads();
                renderMixer();
                updateEditorUI();
            }
        });`;
html = html.replace(clearTarget, clearLogic);
fs.writeFileSync('index.html', html);
console.log('Added elements and Clear All');
