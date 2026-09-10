const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE:', msg.text()));
    await page.goto('http://localhost:3000');
    
    await page.evaluate(async () => {
        // Find the specific variables inside the app.
        // I can just trigger a click on a button to see what happens.
        // Let's add a test script to the page itself.
        const script = document.createElement('script');
        script.textContent = `
            window.testBug = async () => {
                const ctx = state.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
                state.audioCtx = ctx;
                initAudioEngine();
                
                const buf = ctx.createBuffer(1, ctx.sampleRate * 10, ctx.sampleRate);
                const data = buf.getChannelData(0);
                for(let i=0; i<data.length; i++) data[i] = Math.random() * 2 - 1; // white noise
                
                state.pads[0].buffer = buf;
                state.pads[0].offset = 0;
                state.pads[0].duration = 1.0; // 1 second
                state.pads[0].oneShot = true;
                
                console.log("Calling triggerSequencerSound");
                triggerSequencerSound(0, ctx.currentTime, 0.25, null);
            };
            window.testBug();
        `;
        document.body.appendChild(script);
        await new Promise(r => setTimeout(r, 3000));
    });
    
    await browser.close();
})();
