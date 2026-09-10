const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// We will physically slice the AudioBuffer during splitMode.
// Find the split loop
let oldSplitLoop = `                killPadAudio(pad);
                pad.buffer = sourceBuffer;
                pad.sourceType = sourcePad.sourceType;
                pad.fileData = sourcePad.fileData;
                pad.synthName = sourcePad.synthName;
                pad.offset = currentOffset;
                pad.duration = slen;`;

let newSplitLoop = `                killPadAudio(pad);
                
                // Physically slice the buffer to prevent iOS Safari playback bugs
                const sampleRate = sourceBuffer.sampleRate;
                const startSample = Math.floor(currentOffset * sampleRate);
                let endSample = Math.floor((currentOffset + slen) * sampleRate);
                endSample = Math.min(endSample, sourceBuffer.length);
                const frameCount = endSample - startSample;
                
                let newBuf = sourceBuffer;
                if (frameCount > 0) {
                    const ctx = state.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
                    newBuf = ctx.createBuffer(sourceBuffer.numberOfChannels, frameCount, sampleRate);
                    for (let c = 0; c < sourceBuffer.numberOfChannels; c++) {
                        const channelData = sourceBuffer.getChannelData(c);
                        const newChannelData = newBuf.getChannelData(c);
                        for (let s = 0; s < frameCount; s++) {
                            newChannelData[s] = channelData[startSample + s];
                        }
                    }
                }
                
                pad.buffer = newBuf;
                pad.sourceType = sourcePad.sourceType;
                pad.fileData = sourcePad.fileData;
                pad.synthName = sourcePad.synthName;
                pad.offset = 0; // Offset is now 0 because the buffer is exactly the slice
                pad.duration = slen;`;

html = html.replace(oldSplitLoop, newSplitLoop);
fs.writeFileSync('index.html', html);
console.log("Replaced split loop");
