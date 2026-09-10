const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `        function triggerSequencerSound(padIndex, scheduledTime, basePlayDuration, pLocks = null) {`;
const replacementStr = `        function releaseManualPad(padIndex) {
            const padData = state.pads[padIndex];
            if (!padData || !padData.manualNodes || !state.audioCtx) return;
            const { source, gain } = padData.manualNodes;
            const time = state.audioCtx.currentTime;
            
            // Note: decay might be stored as a string if we aren't careful, so cast to Number
            const decay = Number(padData.decay !== undefined ? padData.decay : 10);
            
            // For release phase, we don't necessarily want a 10s release on key up.
            // But we'll just use a fast fade out to avoid clicks in gate mode.
            const fadeDur = 0.05; 
            
            try {
                gain.gain.cancelScheduledValues(time);
                gain.gain.setValueAtTime(gain.gain.value, time);
                gain.gain.linearRampToValueAtTime(0, time + fadeDur);
                source.stop(time + fadeDur);
            } catch(e) {
                console.warn(e);
            }
            padData.manualNodes = null;
        }
        
        function triggerSequencerSound(padIndex, scheduledTime, basePlayDuration, pLocks = null) {`;

html = html.replace(targetStr, replacementStr);
fs.writeFileSync('index.html', html);
console.log('Fixed releaseManualPad');
