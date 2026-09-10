const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE:', msg.text()));
    await page.goto('http://localhost:3000');
    
    await page.evaluate(async () => {
        const script = document.createElement('script');
        script.textContent = `
            window.testBug = async () => {
                const ctx = state.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
                state.audioCtx = ctx;
                initAudioEngine();
                
                const buf = ctx.createBuffer(1, ctx.sampleRate * 10, ctx.sampleRate);
                const data = buf.getChannelData(0);
                for(let i=0; i<data.length; i++) data[i] = Math.random() * 2 - 1;
                
                state.pads[0].buffer = buf;
                state.pads[0].offset = 0;
                state.pads[0].duration = 1.0; 
                state.pads[0].oneShot = true;
                
                console.log("Calling triggerSequencerSound");
                triggerSequencerSound(0, ctx.currentTime, 0.25, null);
                
                // wait 2 seconds, check if it's still playing by looking at analyzer? No analyzer...
            };
            window.testBug();
        `;
        document.body.appendChild(script);
        await new Promise(r => setTimeout(r, 2000));
    });
    
    await browser.close();
})();
