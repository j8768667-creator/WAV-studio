const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove confirm from btnClearAll
let oldClearAll = `        els.btnClearAll.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all loaded samples?")) {
                state.pads.forEach((pad, i) => {`;
let newClearAll = `        els.btnClearAll.addEventListener('click', () => {
                state.pads.forEach((pad, i) => {`;
html = html.replace(oldClearAll, newClearAll);

// Also remove the closing brace for the if statement
let oldClearEnd = `                renderSequencer();
                updateEditorUI();
            }
        });`;
let newClearEnd = `                renderSequencer();
                updateEditorUI();
        });`;
html = html.replace(oldClearEnd, newClearEnd);

// 2. Fix playManualPad
let oldPlayManualOneShot = `            if (padData.oneShot) {
                const actualDur = Math.min(safeDuration, padData.decay !== undefined ? padData.decay : 10);
                source.start(time, padData.offset);
                const fadeDur = Math.min(0.015, actualDur / 2);`;
let newPlayManualOneShot = `            if (padData.oneShot) {
                const actualDur = Math.min(safeDuration, padData.decay !== undefined ? padData.decay : 10);
                source.start(time, padData.offset, actualDur);
                const fadeDur = Math.min(0.015, actualDur / 2);`;
html = html.replace(oldPlayManualOneShot, newPlayManualOneShot);

let oldPlayManualGate = `            } else {
                source.start(time, padData.offset);
                padData.manualNodes = { source, gain };
            }`;
let newPlayManualGate = `            } else {
                source.start(time, padData.offset, safeDuration);
                padData.manualNodes = { source, gain };
            }`;
html = html.replace(oldPlayManualGate, newPlayManualGate);

fs.writeFileSync('index.html', html);
console.log("Fixed btnClearAll and playManualPad");
