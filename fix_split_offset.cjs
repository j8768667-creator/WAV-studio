const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let oldExecuteSplit = `            const mode = els.splitMode.value;
            const val = parseFloat(els.splitValue.value);
            
            let sliceLengths = [];
            
            if (mode === 'number') {
                const len = sourceBuffer.duration / val;
                for(let i=0; i<val; i++) sliceLengths.push(len);
            } else if (mode === 'bars') {
                const beatLen = 60.0 / state.bpm;
                const barLen = beatLen * 4;
                const chunkLen = barLen * val;
                
                let cur = 0;
                while (cur < sourceBuffer.duration) {
                    const remain = sourceBuffer.duration - cur;
                    sliceLengths.push(Math.min(chunkLen, remain));
                    cur += chunkLen;
                }
            } else if (mode === 'seconds') {
                let cur = 0;
                while (cur < sourceBuffer.duration) {
                    const remain = sourceBuffer.duration - cur;
                    sliceLengths.push(Math.min(val, remain));
                    cur += val;
                }
            }`;

let newExecuteSplit = `            const mode = els.splitMode.value;
            const val = parseFloat(els.splitValue.value);
            
            const startOffset = sourcePad.offset || 0;
            const totalDuration = sourcePad.duration || sourceBuffer.duration;
            
            let sliceLengths = [];
            
            if (mode === 'number') {
                const len = totalDuration / val;
                for(let i=0; i<val; i++) sliceLengths.push(len);
            } else if (mode === 'bars') {
                const beatLen = 60.0 / state.bpm;
                const barLen = beatLen * 4;
                const chunkLen = barLen * val;
                
                let cur = 0;
                while (cur < totalDuration) {
                    const remain = totalDuration - cur;
                    sliceLengths.push(Math.min(chunkLen, remain));
                    cur += chunkLen;
                }
            } else if (mode === 'seconds') {
                let cur = 0;
                while (cur < totalDuration) {
                    const remain = totalDuration - cur;
                    sliceLengths.push(Math.min(val, remain));
                    cur += val;
                }
            }`;
            
html = html.replace(oldExecuteSplit, newExecuteSplit);

let oldOffsetInit = `            let currentOffset = 0;
            for (let i = 0; i < numSplits; i++) {`;
            
let newOffsetInit = `            let currentOffset = startOffset;
            for (let i = 0; i < numSplits; i++) {`;
            
html = html.replace(oldOffsetInit, newOffsetInit);

fs.writeFileSync('index.html', html);
console.log("Fixed executeSplit to respect pad offset and duration");
