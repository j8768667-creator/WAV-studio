const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let oldManualGate = `            } else {
                source.start(time, padData.offset, safeDuration);
                padData.manualNodes = { source, gain };
            }`;

let newManualGate = `            } else {
                source.start(time, padData.offset);
                if (safeDuration < padData.buffer.duration - padData.offset) {
                    source.stop(time + safeDuration);
                }
                padData.manualNodes = { source, gain };
            }`;

html = html.replace(oldManualGate, newManualGate);
fs.writeFileSync('index.html', html);
console.log("Fixed manual gate");
