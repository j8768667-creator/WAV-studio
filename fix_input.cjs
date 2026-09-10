const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/<input type="file" id="audioInput" multiple webkitdirectory directory accept="\.wav,audio\/wav,audio\/x-wav">/g, 
'<input type="file" id="audioInput" class="hidden" multiple webkitdirectory directory accept=".wav,audio/wav,audio/x-wav">');

fs.writeFileSync('index.html', html);
console.log('Fixed input');
