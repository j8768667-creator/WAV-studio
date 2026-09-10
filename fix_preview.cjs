const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The `waveDrag` object currently only sets `active` to true/false.
// We can use it to determine if it was a simple click without dragging.
// In waveCanvasPointerDown, `waveDrag` is created: `waveDrag = { active: true, handle, padIndex: state.selectedPadIndex, mouseX: x, startX: x, startOffset: pad.offset };`
// In waveCanvasPointerMove, `mouseX` is updated.
// So if `Math.abs(waveDrag.mouseX - waveDrag.startX) < 3` it's a click!

const pointerUpRegex = /function waveCanvasPointerUp\(\) \{\s+if \(waveDrag\) waveDrag\.active = false;\s+drawEditorWaveform\(\);\s+\}/;

const replacement = `function waveCanvasPointerUp() {
            if (waveDrag && waveDrag.active) {
                // If it was a quick click without dragging, play the pad preview
                if (Math.abs(waveDrag.mouseX - waveDrag.startX) < 3 && state.selectedPadIndex !== null) {
                    playPad(state.selectedPadIndex, true);
                }
                waveDrag.active = false;
            }
            drawEditorWaveform();
        }`;

html = html.replace(pointerUpRegex, replacement);

fs.writeFileSync('index.html', html);
console.log('Fixed preview on click');
