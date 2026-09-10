const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let oldSplit = `                pad.duration = slen;
                pad.oneShot = sourcePad.oneShot; // Inherit One-Shot / Gate mode from source
                pad.colorClass = palette[targetIndex];`;
let newSplit = `                pad.duration = slen;
                pad.oneShot = true; // Slices default to one-shot
                pad.colorClass = palette[targetIndex];`;
html = html.replace(oldSplit, newSplit);

fs.writeFileSync('index.html', html);
