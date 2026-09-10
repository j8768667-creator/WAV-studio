const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Toggle Buttons for Pad Editor / Mixer
const editorHeaderRegex = /<h3 class="text-\[10px\] font-mono text-zinc-500 font-bold uppercase tracking-wider mr-2 hidden sm:block">Pad Editor<\/h3>/;
const editorHeaderReplacement = `<div class="flex bg-zinc-800 rounded-lg p-0.5 mr-2">
                            <button id="tabPadEditor" class="px-2 py-1 bg-zinc-700 text-zinc-100 rounded text-[9px] font-bold uppercase transition-colors">Pad Editor</button>
                            <button id="tabMixer" class="px-2 py-1 text-zinc-400 hover:text-zinc-200 rounded text-[9px] font-bold uppercase transition-colors">Mixer</button>
                        </div>`;
html = html.replace(editorHeaderRegex, editorHeaderReplacement);

// 2. Wrap Pad Editor content in a container and add Mixer container
const padEditorContentRegex = /(<div class="flex gap-2 opacity-30 pointer-events-none transition-opacity flex-grow h-full" id="padSettingsPanel">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/;
const mixerHTML = `
                <div class="hidden flex-row gap-1 h-full w-full overflow-x-auto" id="mixerPanel">
                    <!-- 12 mixer channels injected here -->
                </div>
`;
html = html.replace(padEditorContentRegex, (match, p1) => {
    return `<div id="padEditorContainer" class="flex-grow flex h-full min-h-0">\n${p1}\n</div>\n${mixerHTML}\n</section>`;
});

fs.writeFileSync('index.html', html);
console.log('Added Mixer UI toggle');
