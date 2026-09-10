const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix btnClearAll
let oldClearAll = `                    // Reset Seq Tracks
                    state.seqTracks[i].muted = false;
                    state.seqTracks[i].soloed = false;
                });
                state.audioPool = [];
                renderPads();
                renderMixer();
                updateEditorUI();
            }
        });`;
let newClearAll = `                    // Reset Seq Tracks
                    state.seqTracks[i].muted = false;
                    state.seqTracks[i].soloed = false;
                    state.seqTracks[i].steps = Array(32).fill(false);
                    state.seqTracks[i].stepLocks = Array(32).fill(null);
                    state.seqTracks[i].trackLength = 32;
                });
                state.audioPool = [];
                renderPads();
                renderMixer();
                renderSequencer();
                updateEditorUI();
            }
        });`;
if (html.includes(oldClearAll)) {
    html = html.replace(oldClearAll, newClearAll);
    console.log("Fixed btnClearAll");
} else {
    console.log("Failed to fix btnClearAll");
}

// 2. Remove Mute/Solo from individual tracks
let oldInitSeq = `                const muteBtn = document.createElement('button');
                muteBtn.id = \`mute-btn-\${t}\`;
                muteBtn.className = \`w-4 h-full text-[8px] rounded flex items-center justify-center font-bold transition-colors bg-zinc-800 text-zinc-500 shrink-0\`;
                muteBtn.innerText = 'M';
                muteBtn.addEventListener('click', () => {
                    state.seqTracks[t].muted = !state.seqTracks[t].muted;
                    renderSequencer();
                });

                const soloBtn = document.createElement('button');
                soloBtn.id = \`solo-btn-\${t}\`;
                soloBtn.className = \`w-4 h-full text-[8px] rounded flex items-center justify-center font-bold transition-colors bg-zinc-800 text-zinc-500 shrink-0\`;
                soloBtn.innerText = 'S';
                soloBtn.addEventListener('click', () => {
                    state.seqTracks[t].soloed = !state.seqTracks[t].soloed;
                    renderSequencer();
                });`;
if (html.includes(oldInitSeq)) {
    html = html.replace(oldInitSeq, "");
    
    // Remove appends
    html = html.replace("trackRow.appendChild(muteBtn);", "");
    html = html.replace("trackRow.appendChild(soloBtn);", "");
    
    // Widen track pad
    html = html.replace("w-[54px] sm:w-[64px] shrink-0", "w-[72px] sm:w-[88px] shrink-0");
    
    console.log("Removed mute/solo from tracks");
} else {
    console.log("Failed to remove mute/solo");
}

// Remove updates in renderSequencer
let oldRenderSeq = `                const muteBtn = document.getElementById(\`mute-btn-\${t}\`);
                if (muteBtn) {
                    muteBtn.className = \`w-4 h-full text-[8px] rounded flex items-center justify-center font-bold transition-colors shrink-0 \${trackData.muted ? 'bg-red-900/80 text-red-200' : 'bg-zinc-800 text-zinc-500'}\`;
                }

                const soloBtn = document.getElementById(\`solo-btn-\${t}\`);
                if (soloBtn) {
                    soloBtn.className = \`w-4 h-full text-[8px] rounded flex items-center justify-center font-bold transition-colors shrink-0 \${trackData.soloed ? 'bg-yellow-600 text-yellow-100' : 'bg-zinc-800 text-zinc-500'}\`;
                }`;
if (html.includes(oldRenderSeq)) {
    html = html.replace(oldRenderSeq, "");
    console.log("Cleaned up renderSequencer");
}

fs.writeFileSync('index.html', html);
