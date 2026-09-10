const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject console logs in splitMode
let oldSplit = `                pad.duration = slen;
                pad.oneShot = true; // Slices default to one-shot`;
let newSplit = `                pad.duration = slen;
                pad.oneShot = true; // Slices default to one-shot
                console.log("Split pad", targetIndex, "offset:", pad.offset, "duration:", pad.duration, "buffer.duration:", pad.buffer.duration);`;
html = html.replace(oldSplit, newSplit);

fs.writeFileSync('index.html', html);
