const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix playManualPad
let oldPlayManualOneShot = `                const actualDur = Math.min(safeDuration, padData.decay !== undefined ? padData.decay : 10);
                source.start(time, padData.offset, actualDur);
                const fadeDur = Math.min(0.015, actualDur / 2);`;
let newPlayManualOneShot = `                const actualDur = Math.min(safeDuration, padData.decay !== undefined ? padData.decay : 10);
                source.start(time, padData.offset);
                const fadeDur = Math.min(0.015, actualDur / 2);`;
html = html.replace(oldPlayManualOneShot, newPlayManualOneShot);

// Fix triggerSequencerSound
let oldTriggerSeqStart = `            source.start(scheduledTime, padData.offset, safeDuration);
            source.stop(scheduledTime + safeDuration);`;
let newTriggerSeqStart = `            source.start(scheduledTime, padData.offset);
            source.stop(scheduledTime + safeDuration);`;
html = html.replace(oldTriggerSeqStart, newTriggerSeqStart);

fs.writeFileSync('index.html', html);
