const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const triggerSequencerSoundTarget = /const vol = padData\.volume !== undefined \? padData\.volume : 1\.0;\s*gain\.gain\.setValueAtTime\(0, time\);\s*gain\.gain\.linearRampToValueAtTime\(vol, time \+ 0\.005\);/;
const triggerSequencerSoundReplacement = `
            const baseVol = padData.volume !== undefined ? padData.volume : 1.0;
            const pLockVol = pLocks && pLocks.volume !== undefined ? pLocks.volume : baseVol;
            const vol = pLockVol;
            
            const attack = padData.attack || 0;
            const decay = padData.decay !== undefined ? padData.decay : 10;
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(vol, time + attack + 0.005);`;

html = html.replace(triggerSequencerSoundTarget, triggerSequencerSoundReplacement);

const triggerSequencerSoundStopTarget = /if \(padData\.oneShot\) {\s*source\.start\(time, padData\.offset, safeDuration\);\s*const fadeDur = Math\.min\(0\.015, safeDuration \/ 2\);\s*gain\.gain\.setValueAtTime\(vol, time \+ safeDuration - fadeDur\);\s*gain\.gain\.linearRampToValueAtTime\(0, time \+ safeDuration\);\s*source\.stop\(time \+ safeDuration\);\s*} else {\s*source\.start\(time, padData\.offset, basePlayDuration\);\s*const fadeDur = Math\.min\(0\.015, basePlayDuration \/ 2\);\s*gain\.gain\.setValueAtTime\(vol, time \+ basePlayDuration - fadeDur\);\s*gain\.gain\.linearRampToValueAtTime\(0, time \+ basePlayDuration\);\s*source\.stop\(time \+ basePlayDuration\);\s*}/;

const triggerSequencerSoundStopReplacement = `
            const playDur = padData.oneShot ? safeDuration : basePlayDuration;
            const actualDur = Math.min(playDur, decay);
            
            source.start(time, padData.offset, actualDur);
            const fadeDur = Math.min(0.015, actualDur / 2);
            gain.gain.setValueAtTime(vol, time + actualDur - fadeDur);
            gain.gain.linearRampToValueAtTime(0, time + actualDur);
            source.stop(time + actualDur);`;

html = html.replace(triggerSequencerSoundStopTarget, triggerSequencerSoundStopReplacement);

// Same for playManualPad
const playManualTarget = /const vol = padData\.volume !== undefined \? padData\.volume : 1\.0;\s*gain\.gain\.setValueAtTime\(0, time\);\s*gain\.gain\.linearRampToValueAtTime\(vol, time \+ 0\.005\);/;
const playManualReplacement = `
            const vol = padData.volume !== undefined ? padData.volume : 1.0;
            const attack = padData.attack || 0;
            const decay = padData.decay !== undefined ? padData.decay : 10;
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(vol, time + attack + 0.005);`;

html = html.replace(playManualTarget, playManualReplacement);

const playManualStopTarget = /if \(padData\.oneShot\) {\s*source\.start\(time, padData\.offset, safeDuration\);\s*const fadeDur = Math\.min\(0\.015, safeDuration \/ 2\);\s*gain\.gain\.setValueAtTime\(vol, time \+ safeDuration - fadeDur\);\s*gain\.gain\.linearRampToValueAtTime\(0, time \+ safeDuration\);\s*source\.stop\(time \+ safeDuration\);\s*} else {\s*source\.start\(time, padData\.offset\);\s*}/;

const playManualStopReplacement = `
            if (padData.oneShot) {
                const actualDur = Math.min(safeDuration, decay);
                source.start(time, padData.offset, actualDur);
                const fadeDur = Math.min(0.015, actualDur / 2);
                gain.gain.setValueAtTime(vol, time + actualDur - fadeDur);
                gain.gain.linearRampToValueAtTime(0, time + actualDur);
                source.stop(time + actualDur);
            } else {
                source.start(time, padData.offset);
            }`;

html = html.replace(playManualStopTarget, playManualStopReplacement);

fs.writeFileSync('index.html', html);
console.log('Updated audio engine AD env');
