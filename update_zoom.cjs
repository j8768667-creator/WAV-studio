const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const zoomStateTarget = /audioPool: \[\],\s*pads: new Array/;
const zoomStateReplacement = `
            zoomFactor: 1,
            zoomOffset: 0,
            audioPool: [],
            pads: new Array`;
html = html.replace(zoomStateTarget, zoomStateReplacement);

const waveCanvasEventTarget = /els\.padWaveCanvas\.addEventListener\('pointercancel', waveCanvasPointerUp\);/g;
const waveCanvasEventReplacement = `els.padWaveCanvas.addEventListener('pointercancel', waveCanvasPointerUp);
        
        let initialPinchDistance = null;
        let initialZoomFactor = 1;
        let initialZoomOffset = 0;
        let pinchCenter = 0;
        
        els.padWaveCanvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                initialPinchDistance = Math.sqrt(dx*dx + dy*dy);
                initialZoomFactor = state.zoomFactor || 1;
                initialZoomOffset = state.zoomOffset || 0;
                
                const rect = els.padWaveCanvas.getBoundingClientRect();
                pinchCenter = ((e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left) / rect.width;
            }
        }, {passive: false});
        
        els.padWaveCanvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialPinchDistance) {
                e.preventDefault();
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                const scale = dist / initialPinchDistance;
                let newZoom = initialZoomFactor * scale;
                newZoom = Math.max(1, Math.min(newZoom, 50)); // Max 50x zoom
                
                // Adjust offset to zoom into the pinch center
                const zoomRatio = initialZoomFactor / newZoom;
                let newOffset = pinchCenter - (pinchCenter - initialZoomOffset) * zoomRatio;
                
                // Clamp offset
                newOffset = Math.max(0, Math.min(newOffset, 1 - 1/newZoom));
                
                state.zoomFactor = newZoom;
                state.zoomOffset = newOffset;
                drawEditorWaveform();
            }
        }, {passive: false});
        
        els.padWaveCanvas.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                initialPinchDistance = null;
            }
        });`;

html = html.replace(waveCanvasEventTarget, waveCanvasEventReplacement);

// Update drawEditorWaveform to use zoomFactor and zoomOffset
// Wait, currently it uses padData.buffer.duration and draws the whole thing.
// `const data = buffer.getChannelData(0); const step = Math.ceil(data.length / width);`
// We need to change startIdx and endIdx based on zoom.
const drawWaveformTarget = /const data = buffer\.getChannelData\(0\);\s*const step = Math\.ceil\(data\.length \/ width\);\s*const amp = height \/ 2;/;
const drawWaveformReplacement = `
            const data = buffer.getChannelData(0);
            const zFactor = state.zoomFactor || 1;
            const zOffset = state.zoomOffset || 0;
            
            const startIdx = Math.floor(data.length * zOffset);
            const endIdx = Math.floor(data.length * (zOffset + 1/zFactor));
            const viewLength = endIdx - startIdx;
            
            const step = Math.max(1, Math.floor(viewLength / width));
            const amp = height / 2;`;
html = html.replace(drawWaveformTarget, drawWaveformReplacement);

// Update loop to start from startIdx
const drawWaveformLoopTarget = /for \(let i = 0; i < width; i\+\+\) {\s*let min = 1\.0;\s*let max = -1\.0;\s*for \(let j = 0; j < step; j\+\+\) {\s*const datum = data\[i \* step \+ j\];/;
const drawWaveformLoopReplacement = `
            for (let i = 0; i < width; i++) {
                let min = 1.0;
                let max = -1.0;
                for (let j = 0; j < step; j++) {
                    const dataIdx = startIdx + i * step + j;
                    if (dataIdx >= data.length) break;
                    const datum = data[dataIdx];`;
html = html.replace(drawWaveformLoopTarget, drawWaveformLoopReplacement);

// Update the pointer interactions in the waveform
const pointerMoveTarget = /const x = e\.clientX - rect\.left;\s*const normalizedX = Math\.max\(0, Math\.min\(1, x \/ rect\.width\)\);\s*const newTime = normalizedX \* padData\.buffer\.duration;/g;
const pointerMoveReplacement = `
            const x = e.clientX - rect.left;
            const normalizedX = Math.max(0, Math.min(1, x / rect.width));
            const zFactor = state.zoomFactor || 1;
            const zOffset = state.zoomOffset || 0;
            const actualNormalizedX = zOffset + (normalizedX / zFactor);
            const newTime = actualNormalizedX * padData.buffer.duration;`;
html = html.replace(pointerMoveTarget, pointerMoveReplacement);

const pointerDownTarget = /const x = e\.clientX - rect\.left;\s*const normalizedX = x \/ rect\.width;\s*const clickTime = normalizedX \* pad\.buffer\.duration;/;
const pointerDownReplacement = `
            const x = e.clientX - rect.left;
            const normalizedX = x / rect.width;
            const zFactor = state.zoomFactor || 1;
            const zOffset = state.zoomOffset || 0;
            const actualNormalizedX = zOffset + (normalizedX / zFactor);
            const clickTime = actualNormalizedX * pad.buffer.duration;`;
html = html.replace(pointerDownTarget, pointerDownReplacement);

// Update highlight drawing
const highlightDrawTarget = /const startX = \(padData\.offset \/ duration\) \* width;\s*const w = \(padData\.duration \/ duration\) \* width;/;
const highlightDrawReplacement = `
            const zFactor = state.zoomFactor || 1;
            const zOffset = state.zoomOffset || 0;
            const startNormalized = padData.offset / duration;
            const endNormalized = (padData.offset + padData.duration) / duration;
            
            const startX = (startNormalized - zOffset) * zFactor * width;
            const w = padData.duration / duration * zFactor * width;`;
html = html.replace(highlightDrawTarget, highlightDrawReplacement);

fs.writeFileSync('index.html', html);
console.log('Updated pinch to zoom');
