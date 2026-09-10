const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = /els\.tabPadEditor = document\.getElementById\('tabPadEditor'\);/; // wait, it's inside els object
const targetObj = /els\.padWaveCanvas\.addEventListener\('pointerdown', waveCanvasPointerDown\);/;
const replacementStr = `
        els.tabPadEditor.addEventListener('click', () => {
            els.tabPadEditor.className = 'px-2 py-1 bg-zinc-700 text-zinc-100 rounded text-[9px] font-bold uppercase transition-colors';
            els.tabMixer.className = 'px-2 py-1 text-zinc-400 hover:text-zinc-200 rounded text-[9px] font-bold uppercase transition-colors';
            els.padEditorContainer.classList.remove('hidden');
            els.padEditorContainer.classList.add('flex');
            els.mixerPanel.classList.add('hidden');
            els.mixerPanel.classList.remove('flex');
            window.dispatchEvent(new Event('resize'));
        });
        
        els.tabMixer.addEventListener('click', () => {
            els.tabMixer.className = 'px-2 py-1 bg-zinc-700 text-zinc-100 rounded text-[9px] font-bold uppercase transition-colors';
            els.tabPadEditor.className = 'px-2 py-1 text-zinc-400 hover:text-zinc-200 rounded text-[9px] font-bold uppercase transition-colors';
            els.mixerPanel.classList.remove('hidden');
            els.mixerPanel.classList.add('flex');
            els.padEditorContainer.classList.add('hidden');
            els.padEditorContainer.classList.remove('flex');
            renderMixer();
        });

        els.padWaveCanvas.addEventListener('pointerdown', waveCanvasPointerDown);`;
html = html.replace(targetObj, replacementStr);
fs.writeFileSync('index.html', html);
console.log('Fixed tab logic');
