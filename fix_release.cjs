const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `        function releaseManualPad(padIndex) {
            const padData = state.pads[padIndex];
            if (!padData || !padData.manualNodes || !state.audioCtx) return;
            const { source, gain } = padData.manualNodes;
            const time = state.audioCtx.currentTime;`;

const replacementStr = `        function releaseManualPad(padIndex) {
            const padData = state.pads[padIndex];
            if (!padData || !padData.manualNodes || !state.audioCtx) return;
            
            // If in One-Shot mode, releasing the key should NOT choke the pad!
            if (padData.oneShot) {
                padData.manualNodes = null;
                return;
            }
            
            const { source, gain } = padData.manualNodes;
            const time = state.audioCtx.currentTime;`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, replacementStr);
    fs.writeFileSync('index.html', html);
    console.log("Fixed releaseManualPad");
} else {
    console.log("Could not find target string");
}
