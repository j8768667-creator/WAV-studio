const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let triggerSeqOld = `            source.start(scheduledTime, padData.offset);
            source.stop(scheduledTime + safeDuration);`;

let triggerSeqNew = `            source.start(scheduledTime, padData.offset);
            source.stop(scheduledTime + safeDuration);
            // Safari fallback
            setTimeout(() => {
                try {
                    gain.gain.cancelScheduledValues(state.audioCtx.currentTime);
                    gain.gain.setTargetAtTime(0, state.audioCtx.currentTime, 0.01);
                    source.stop();
                } catch(e) {}
            }, Math.max(0, (scheduledTime + safeDuration - state.audioCtx.currentTime) * 1000 + 50));`;

html = html.replace(triggerSeqOld, triggerSeqNew);

let manualOld1 = `                source.start(time, padData.offset);
                const fadeDur = Math.min(0.015, actualDur / 2);
                gain.gain.setValueAtTime(pVol, time + actualDur - fadeDur);
                gain.gain.linearRampToValueAtTime(0, time + actualDur);
                source.stop(time + actualDur);`;

let manualNew1 = `                source.start(time, padData.offset);
                const fadeDur = Math.min(0.015, actualDur / 2);
                gain.gain.setValueAtTime(pVol, time + actualDur - fadeDur);
                gain.gain.linearRampToValueAtTime(0, time + actualDur);
                source.stop(time + actualDur);
                // Safari fallback
                setTimeout(() => {
                    try {
                        gain.gain.cancelScheduledValues(state.audioCtx.currentTime);
                        gain.gain.setTargetAtTime(0, state.audioCtx.currentTime, 0.01);
                        source.stop();
                    } catch(e) {}
                }, actualDur * 1000 + 50);`;

html = html.replace(manualOld1, manualNew1);

let manualOld2 = `            } else {
                source.start(time, padData.offset);
                if (safeDuration < padData.buffer.duration - padData.offset) {
                    source.stop(time + safeDuration);
                }`;

let manualNew2 = `            } else {
                source.start(time, padData.offset);
                if (safeDuration < padData.buffer.duration - padData.offset) {
                    source.stop(time + safeDuration);
                    // Safari fallback
                    setTimeout(() => {
                        try {
                            if (padData.manualNodes && padData.manualNodes.source === source) {
                                gain.gain.cancelScheduledValues(state.audioCtx.currentTime);
                                gain.gain.setTargetAtTime(0, state.audioCtx.currentTime, 0.01);
                                source.stop();
                            }
                        } catch(e) {}
                    }, safeDuration * 1000 + 50);
                }`;

html = html.replace(manualOld2, manualNew2);
fs.writeFileSync('index.html', html);
console.log("Fixed Safari playback fully issue");
