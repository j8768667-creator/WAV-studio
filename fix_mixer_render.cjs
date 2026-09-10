const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target1 = /renderPads\(\);\s*renderSequencer\(\);\s*updateSceneLabel\(\);/g;
const replacement1 = `renderPads();
                    renderSequencer();
                    renderMixer();
                    updateSceneLabel();`;
html = html.replace(target1, replacement1);

// Replace it again in case we missed it in any other load place
const target2 = /renderPads\(\);\s*updateEditorUI\(\);/g;
const replacement2 = `renderPads();
                renderMixer();
                updateEditorUI();`;
html = html.replace(target2, replacement2);

fs.writeFileSync('index.html', html);
console.log('Fixed mixer rendering updates');
