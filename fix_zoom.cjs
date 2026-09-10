const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const drawWaveformTarget = /function drawWaveform\(canvas, buffer, offset, duration, color, showHandles, dragState = null\) {[\s\S]*?drawDynamicWaveform\(ctx, buffer, 0, 0, W, H, 0, buffer\.duration, color\);[\s\S]*?const timeToX = \(t\) => \(t \/ buffer\.duration\) \* W;/;

const drawWaveformReplacement = `function drawWaveform(canvas, buffer, offset, duration, color, showHandles, dragState = null) {
            if (!canvas) return;
            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            }
            const ctx = canvas.getContext('2d');
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            if (!buffer) return;
            
            let startTime = 0;
            let endTime = buffer.duration;
            
            // Apply zoom ONLY if this is the large editor canvas (showHandles = true)
            if (showHandles) {
                const zFactor = state.zoomFactor || 1;
                const zOffset = state.zoomOffset || 0;
                startTime = zOffset * buffer.duration;
                endTime = startTime + (buffer.duration / zFactor);
            }

            // 1. Draw base 1x waveform
            drawDynamicWaveform(ctx, buffer, 0, 0, W, H, startTime, endTime, color);

            const timeToX = (t) => {
                const normalized = (t - startTime) / (endTime - startTime);
                return normalized * W;
            };`;

html = html.replace(drawWaveformTarget, drawWaveformReplacement);

// Fix pointerDown pointerMove to use the correct time mapping.
const pointerTarget = /const x = e\.clientX - rect\.left;\s*const normalizedX = x \/ rect\.width;\s*const zFactor = state\.zoomFactor \|\| 1;\s*const zOffset = state\.zoomOffset \|\| 0;\s*const actualNormalizedX = zOffset \+ \(normalizedX \/ zFactor\);\s*const clickTime = actualNormalizedX \* pad\.buffer\.duration;/;
const pointerReplacement = `const x = e.clientX - rect.left;
            const normalizedX = x / rect.width;
            const zFactor = state.zoomFactor || 1;
            const zOffset = state.zoomOffset || 0;
            const clickTime = (zOffset + (normalizedX / zFactor)) * pad.buffer.duration;`;
            
html = html.replace(pointerTarget, pointerReplacement);

const pointerMoveTarget = /const x = e\.clientX - rect\.left;\s*const normalizedX = Math\.max\(0, Math\.min\(1, x \/ rect\.width\)\);\s*const zFactor = state\.zoomFactor \|\| 1;\s*const zOffset = state\.zoomOffset \|\| 0;\s*const actualNormalizedX = zOffset \+ \(normalizedX \/ zFactor\);\s*const newTime = actualNormalizedX \* padData\.buffer\.duration;/;
const pointerMoveReplacement = `const x = e.clientX - rect.left;
            const normalizedX = x / rect.width;
            const zFactor = state.zoomFactor || 1;
            const zOffset = state.zoomOffset || 0;
            const newTime = (zOffset + (normalizedX / zFactor)) * padData.buffer.duration;`;

html = html.replace(pointerMoveTarget, pointerMoveReplacement);

fs.writeFileSync('index.html', html);
console.log('Fixed zoom drawing logic');
