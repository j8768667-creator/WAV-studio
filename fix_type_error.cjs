const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const playManualTarget = /const vol = padData\.volume !== undefined \? padData\.volume : 1\.0;\s*const attack = padData\.attack \|\| 0;\s*const decay = padData\.decay !== undefined \? padData\.decay : 10;/;
const playManualReplacement = `const vol = Number(padData.volume !== undefined ? padData.volume : 1.0);
            const attack = Number(padData.attack || 0);
            const decay = Number(padData.decay !== undefined ? padData.decay : 10);`;
html = html.replace(playManualTarget, playManualReplacement);

const triggerTarget = /const attack = padData\.attack \|\| 0;\s*const decay = padData\.decay !== undefined \? padData\.decay : 10;/;
const triggerReplacement = `const attack = Number(padData.attack || 0);
            const decay = Number(padData.decay !== undefined ? padData.decay : 10);`;
html = html.replace(triggerTarget, triggerReplacement);

fs.writeFileSync('index.html', html);
console.log('Fixed Type Error values');
