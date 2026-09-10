const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// I should revert my previous regex modifications if they broke things, or just fix drawDynamicWaveform.
// I see drawDynamicWaveform has startTime and endTime parameters. Let's look at it.
