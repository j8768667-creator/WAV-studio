const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `            const drumMap = [
                { type: 'kick', name: \`\${prefix} Kick\` },
                { type: 'snare', name: \`\${prefix} Snare\` },
                { type: 'hihat_c', name: \`\${prefix} Hat (C)\` },
                { type: 'hihat_o', name: \`\${prefix} Hat (O)\` },
                { type: 'clap', name: \`\${prefix} Clap\` },
                { type: 'perc', name: \`\${prefix} Perc\` },
                { type: 'tom_mid', name: \`\${prefix} Tom\` },
                { type: 'cymbal', name: \`\${prefix} Cymbal\` }
            ];`;

const replacementStr = `            const drumMap = [
                { type: 'kick', name: \`\${prefix} Kick 1\` },
                { type: 'snare', name: \`\${prefix} Snare 1\` },
                { type: 'hihat_c', name: \`\${prefix} Hat (C)\` },
                { type: 'hihat_o', name: \`\${prefix} Hat (O)\` },
                { type: 'clap', name: \`\${prefix} Clap\` },
                { type: 'perc', name: \`\${prefix} Perc 1\` },
                { type: 'tom_mid', name: \`\${prefix} Tom Mid\` },
                { type: 'cymbal', name: \`\${prefix} Cymbal 1\` },
                { type: 'tom_low', name: \`\${prefix} Tom Low\` },
                { type: 'perc', name: \`\${prefix} Perc 2\` },
                { type: 'kick', name: \`\${prefix} Kick 2\` },
                { type: 'snare', name: \`\${prefix} Snare 2\` }
            ];`;

html = html.replace(targetStr, replacementStr);
fs.writeFileSync('index.html', html);
console.log('Fixed drumMap length');
