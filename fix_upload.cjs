const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `                for (let i of emptyPads) {
                    const poolItem = newlyDecoded[Math.floor(Math.random() * newlyDecoded.length)];
                    state.pads[i].buffer = poolItem.buffer;
                    state.pads[i].offset = 0; 
                    state.pads[i].duration = poolItem.buffer.duration;
                    state.pads[i].colorClass = palette[i];
                    state.pads[i].colorHex = paletteHex[i];
                    state.pads[i].label = poolItem.name.substring(0, 12);
                    state.pads[i].sourceType = poolItem.sourceType;
                    state.pads[i].fileData = poolItem.fileData;
                    state.pads[i].synthName = poolItem.synthName;
                }`;

const replacementStr = `                const numToAssign = Math.min(emptyPads.length, newlyDecoded.length);
                for (let idx = 0; idx < numToAssign; idx++) {
                    const i = emptyPads[idx];
                    const poolItem = newlyDecoded[idx];
                    state.pads[i].buffer = poolItem.buffer;
                    state.pads[i].offset = 0; 
                    state.pads[i].duration = poolItem.buffer.duration;
                    state.pads[i].colorClass = palette[i];
                    state.pads[i].colorHex = paletteHex[i];
                    state.pads[i].label = poolItem.name.substring(0, 12);
                    state.pads[i].sourceType = poolItem.sourceType;
                    state.pads[i].fileData = poolItem.fileData;
                    state.pads[i].synthName = poolItem.synthName;
                }`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, replacementStr);
    fs.writeFileSync('index.html', html);
    console.log("Upload logic fixed");
} else {
    console.log("Could not find target string");
}
