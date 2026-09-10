const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const cssTargetStr = `        .slider-fader {
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
            box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }`;

const newCssStr = `        .slider-thumb-sm::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            background: #e4e4e7;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }
        
        .slider-fader-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 16px;
            background: #e4e4e7;
            border-radius: 3px;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }`;

html = html.replace(cssTargetStr, newCssStr);

const mixerChStr = `                // Slimmer padding (p-1), slimmer gap (gap-1), max-width to prevent overflow stretching
                ch.className = 'flex flex-col bg-zinc-800 rounded-lg p-1 min-w-[38px] max-w-[48px] flex-1 shrink-0 border border-zinc-700 justify-between items-center h-full gap-1 relative overflow-hidden';`;

const newMixerChStr = `                // Slightly wider to fit labels nicely, but still fit 12 on screen
                ch.className = 'flex flex-col bg-zinc-800 rounded-lg py-1 px-0.5 min-w-[42px] max-w-[60px] flex-1 shrink-0 border border-zinc-700 justify-between items-center h-full gap-1 relative overflow-hidden';`;
html = html.replace(mixerChStr, newMixerChStr);


const mixerFaderClass = `fader.className = 'bg-black rounded-lg appearance-none cursor-pointer slider-thumb-sm z-10 outline-none';`;
const newMixerFaderClass = `fader.className = 'bg-transparent appearance-none cursor-pointer slider-fader-thumb z-10 outline-none';`;
html = html.replace(mixerFaderClass, newMixerFaderClass);


fs.writeFileSync('index.html', html);
console.log('Fixed CSS and widths');
