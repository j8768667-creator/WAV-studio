const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetRegex = /if \(isLocked\) \{[\s\S]*?if \(!handle\) return;/;

const replacement = `if (distLeft <= 20) {
                handle = 'left';
                els.chkLockSize.checked = false;
            } else if (distRight <= 20) {
                handle = 'right';
                els.chkLockSize.checked = false;
            } else if (isLocked) {
                if (isInside || distLeft <= grab || distRight <= grab) {
                    handle = 'body';
                }
            } else {
                if (isInside) {
                    handle = 'body';
                } else {
                    if (distLeft <= grab) handle = 'left';
                    else if (distRight <= grab) handle = 'right';
                }
            }
            if (!handle) return;`;

html = html.replace(targetRegex, replacement);

fs.writeFileSync('index.html', html);
console.log('Handles fixed');
