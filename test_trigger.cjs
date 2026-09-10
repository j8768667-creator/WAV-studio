const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let triggerLog = `
            const fadeDur = Math.min(0.015, safeDuration / 2);
            console.log("Triggering pad:", padIndex, "oneShot:", padData.oneShot, "duration:", padData.duration, "safeDuration:", safeDuration, "decay:", decay);
            gain.gain.setValueAtTime(Number(effectiveVol), scheduledTime + safeDuration - fadeDur);`;
            
html = html.replace(`const fadeDur = Math.min(0.015, safeDuration / 2);
            gain.gain.setValueAtTime(Number(effectiveVol), scheduledTime + safeDuration - fadeDur);`, triggerLog);

fs.writeFileSync('index.html', html);
