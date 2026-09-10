const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `        const state = {`;
const replacementStr = `        function formatPan(val) {
            val = parseFloat(val);
            if (val === 0) return 'C';
            if (val < 0) return 'L' + Math.round(Math.abs(val) * 100);
            return 'R' + Math.round(val * 100);
        }

        const state = {`;

html = html.replace(targetStr, replacementStr);
fs.writeFileSync('index.html', html);
console.log('Added formatPan');
