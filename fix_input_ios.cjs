const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The issue with iOS/iPadOS is that `webkitdirectory` strictly forces directory selection, 
// but the iOS Files app doesn't fully support selecting a raw directory for upload via a standard `<input>`. 
// It often grays out files or the 'Open' button entirely when webkitdirectory is present but unsupported.
// We need to revert it back to a standard multiple file selector which DOES work on iPad.
// The user originally complained about "multi-select", but standard `multiple` is the correct way to do multi-select. 
// `webkitdirectory` is only for desktop Chrome/Edge folder selection.

html = html.replace(/<input type="file" id="audioInput" class="hidden" multiple webkitdirectory directory accept="\.wav,audio\/wav,audio\/x-wav">/g, 
'<input type="file" id="audioInput" class="hidden" multiple accept=".wav,audio/wav,audio/x-wav">');

html = html.replace(/<span class="font-bold text-\[11px\] uppercase tracking-wide whitespace-nowrap">Load Folder<\/span>/g, 
'<span class="font-bold text-[11px] uppercase tracking-wide whitespace-nowrap">Load WAVs</span>');

fs.writeFileSync('index.html', html);
console.log('Fixed iOS input');
