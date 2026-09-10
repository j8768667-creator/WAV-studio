const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `                // Mute / Solo buttons (using Sequencer state)
                const btnWrap = document.createElement('div');
                btnWrap.className = 'flex w-full gap-1 justify-center';
                
                const btnMute = document.createElement('button');
                const isMuted = state.seqTracks[i].muted;
                btnMute.className = \`w-6 h-6 rounded flex justify-center items-center text-[9px] font-bold transition-colors \${isMuted ? 'bg-amber-600 text-amber-100' : 'bg-zinc-700 text-zinc-400'}\`;
                btnMute.innerText = 'M';
                btnMute.addEventListener('click', () => {
                    state.seqTracks[i].muted = !state.seqTracks[i].muted;
                    renderMixer();
                    renderSequencer();
                });
                
                const btnSolo = document.createElement('button');
                const isSoloed = state.seqTracks[i].soloed;
                btnSolo.className = \`w-6 h-6 rounded flex justify-center items-center text-[9px] font-bold transition-colors \${isSoloed ? 'bg-cyan-600 text-cyan-100' : 'bg-zinc-700 text-zinc-400'}\`;
                btnSolo.innerText = 'S';
                btnSolo.addEventListener('click', () => {
                    state.seqTracks[i].soloed = !state.seqTracks[i].soloed;
                    renderMixer();
                    renderSequencer();
                });
                
                btnWrap.appendChild(btnMute);
                btnWrap.appendChild(btnSolo);`;

const newTargetStr = `                // Mute / Solo buttons (using Sequencer state)
                const btnWrap = document.createElement('div');
                btnWrap.className = 'flex flex-col w-full gap-1 justify-center';
                
                const btnMute = document.createElement('button');
                const isMuted = state.seqTracks[i].muted;
                btnMute.className = \`w-full h-5 rounded flex justify-center items-center text-[9px] font-bold transition-colors \${isMuted ? 'bg-amber-600 text-amber-100' : 'bg-zinc-700 text-zinc-400'}\`;
                btnMute.innerText = 'M';
                btnMute.addEventListener('click', () => {
                    state.seqTracks[i].muted = !state.seqTracks[i].muted;
                    renderMixer();
                    renderSequencer();
                });
                
                const btnSolo = document.createElement('button');
                const isSoloed = state.seqTracks[i].soloed;
                btnSolo.className = \`w-full h-5 rounded flex justify-center items-center text-[9px] font-bold transition-colors \${isSoloed ? 'bg-cyan-600 text-cyan-100' : 'bg-zinc-700 text-zinc-400'}\`;
                btnSolo.innerText = 'S';
                btnSolo.addEventListener('click', () => {
                    state.seqTracks[i].soloed = !state.seqTracks[i].soloed;
                    renderMixer();
                    renderSequencer();
                });
                
                btnWrap.appendChild(btnMute);
                btnWrap.appendChild(btnSolo);`;

html = html.replace(targetStr, newTargetStr);
fs.writeFileSync('index.html', html);
console.log('Fixed Mute/Solo button layout');
