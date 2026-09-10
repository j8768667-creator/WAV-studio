const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = /if \\(padData\\.oneShot\\) \\{[\\s\\S]*?source\\.start\\(time, padData\\.offset, safeDuration\\);[\\s\\S]*?const fadeDur = Math\\.min\\(0\\.015, safeDuration \/ 2\\);[\\s\\S]*?gain\\.gain\\.setValueAtTime\\(vol, time \\+ safeDuration - fadeDur\\);[\\s\\S]*?gain\\.gain\\.linearRampToValueAtTime\\(0, time \\+ safeDuration\\);[\\s\\S]*?source\\.stop\\(time \\+ safeDuration\\);[\\s\\S]*?const voice = \\{ source, gain \\};[\\s\\S]*?padData\\.scheduledNodes\\.push\\(voice\\);[\\s\\S]*?source\\.onended = \\(\\) => \\{[\\s\\S]*?const idx = padData\\.scheduledNodes\\.indexOf\\(voice\\);[\\s\\S]*?if \\(idx > -1\\) padData\\.scheduledNodes\\.splice\\(idx, 1\\);[\\s\\S]*?\\};[\\s\\S]*?padData\\.manualNodes = null;[\\s\\S]*?\\} else \\{[\\s\\S]*?if \\(padData\\.duration < padData\\.buffer\\.duration - padData\\.offset\\) \\{[\\s\\S]*?source\\.start\\(time, padData\\.offset, padData\\.duration\\);[\\s\\S]*?\\} else \\{[\\s\\S]*?source\\.start\\(time, padData\\.offset\\);[\\s\\S]*?\\}[\\s\\S]*?padData\\.manualNodes = \\{ source, gain \\};[\\s\\S]*?\\}/;

const replacement = `
            if (padData.oneShot) {
                const actualDur = Math.min(safeDuration, padData.decay !== undefined ? padData.decay : 10);
                source.start(time, padData.offset, actualDur);
                const fadeDur = Math.min(0.015, actualDur / 2);
                gain.gain.setValueAtTime(vol, time + actualDur - fadeDur);
                gain.gain.linearRampToValueAtTime(0, time + actualDur);
                source.stop(time + actualDur);
                
                const voice = { source, gain };
                padData.scheduledNodes.push(voice);
                source.onended = () => {
                    const idx = padData.scheduledNodes.indexOf(voice);
                    if (idx > -1) padData.scheduledNodes.splice(idx, 1);
                };
                padData.manualNodes = null;
            } else {
                source.start(time, padData.offset);
                padData.manualNodes = { source, gain };
            }`;
            
// Wait, regex might fail. Let's just string split and replace
const startMarker = 'const safeDuration = Math.max(0.01, Math.min(padData.duration, padData.buffer.duration - padData.offset));';
const endMarker = '        function triggerSequencerSound(padIndex, scheduledTime, basePlayDuration, pLocks = null) {';
const before = html.substring(0, html.indexOf(startMarker) + startMarker.length);
const after = html.substring(html.indexOf(endMarker));
html = before + `
            if (padData.oneShot) {
                const actualDur = Math.min(safeDuration, padData.decay !== undefined ? padData.decay : 10);
                source.start(time, padData.offset, actualDur);
                const fadeDur = Math.min(0.015, actualDur / 2);
                gain.gain.setValueAtTime(vol, time + actualDur - fadeDur);
                gain.gain.linearRampToValueAtTime(0, time + actualDur);
                source.stop(time + actualDur);
                
                const voice = { source, gain };
                padData.scheduledNodes.push(voice);
                source.onended = () => {
                    const idx = padData.scheduledNodes.indexOf(voice);
                    if (idx > -1) padData.scheduledNodes.splice(idx, 1);
                };
                padData.manualNodes = null;
            } else {
                source.start(time, padData.offset);
                padData.manualNodes = { source, gain };
            }
        }
` + after;

fs.writeFileSync('index.html', html);
console.log('Fixed playManualPad logic');
