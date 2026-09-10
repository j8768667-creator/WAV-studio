const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const initAppTarget = /renderPads\(\);\s*renderSequencer\(\);\s*updateSceneLabel\(\);/;
const initAppReplacement = `renderPads();
            renderSequencer();
            renderMixer();
            updateSceneLabel();`;
html = html.replace(initAppTarget, initAppReplacement);

// Add Tab Switching Logic
const tabLogic = `
        els.tabPadEditor.addEventListener('click', () => {
            els.tabPadEditor.className = 'px-2 py-1 bg-zinc-700 text-zinc-100 rounded text-[9px] font-bold uppercase transition-colors';
            els.tabMixer.className = 'px-2 py-1 text-zinc-400 hover:text-zinc-200 rounded text-[9px] font-bold uppercase transition-colors';
            els.padEditorContainer.classList.remove('hidden');
            els.padEditorContainer.classList.add('flex');
            els.mixerPanel.classList.add('hidden');
            els.mixerPanel.classList.remove('flex');
            // Trigger resize to fix canvas layout
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
        
        window.addEventListener('resize', () => {
            if (state.selectedPadIndex !== null && !els.padEditorContainer.classList.contains('hidden')) {
                drawEditorWaveform();
            }
        });`;

html = html.replace(/window\.addEventListener\('resize', \(\) => {[\s\S]*?}\);/, tabLogic);

// Add CSS for Vertical fader slider
const styleTarget = /<\/style>/;
const styleReplacement = `
        .slider-fader {
            -webkit-appearance: none;
            writing-mode: bt-lr; /* IE */
            -webkit-appearance: slider-vertical; /* WebKit */
        }
        .slider-fader::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 12px;
            background: #e4e4e7;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid #3f3f46;
            box-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
        </style>`;
html = html.replace(styleTarget, styleReplacement);

fs.writeFileSync('index.html', html);
console.log('Added tabs logic');
