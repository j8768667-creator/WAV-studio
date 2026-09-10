const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = /const gain = state\.audioCtx\.createGain\(\);\s*gain\.gain\.setValueAtTime\(0, scheduledTime\);\s*gain\.gain\.linearRampToValueAtTime\(effectiveVol, scheduledTime \+ 0\.005\);\s*const playDuration = padData\.oneShot \? padData\.duration : Math\.min\(basePlayDuration, padData\.duration\);\s*const safeDuration = Math\.max\(0\.01, Math\.min\(playDuration, padData\.buffer\.duration - padData\.offset\)\);\s*const fadeDur = Math\.min\(0\.015, safeDuration \/ 2\);\s*gain\.gain\.setValueAtTime\(effectiveVol, scheduledTime \+ safeDuration - fadeDur\);\s*gain\.gain\.linearRampToValueAtTime\(0, scheduledTime \+ safeDuration\);/;

const replacement = `const gain = state.audioCtx.createGain();
            const attack = Number(padData.attack || 0);
            const decay = Number(padData.decay !== undefined ? padData.decay : 10);
            
            gain.gain.setValueAtTime(0, scheduledTime);
            gain.gain.linearRampToValueAtTime(Number(effectiveVol), scheduledTime + attack + 0.005);
            
            const playDuration = padData.oneShot ? padData.duration : Math.min(basePlayDuration, padData.duration);
            const rawSafeDuration = Math.max(0.01, Math.min(playDuration, padData.buffer.duration - padData.offset));
            const safeDuration = Math.min(rawSafeDuration, decay);
            
            const fadeDur = Math.min(0.015, safeDuration / 2);
            gain.gain.setValueAtTime(Number(effectiveVol), scheduledTime + safeDuration - fadeDur);
            gain.gain.linearRampToValueAtTime(0, scheduledTime + safeDuration);`;

html = html.replace(target, replacement);

fs.writeFileSync('index.html', html);
console.log('Fixed triggerSequencerSound envelopes');
