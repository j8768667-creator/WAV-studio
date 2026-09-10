const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE:', msg.text()));
    await page.goto('http://localhost:3000');
    
    await page.evaluate(async () => {
        const ctx = window.state.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        window.state.audioCtx = ctx;
        
        // Create 10-second buffer
        const buf = ctx.createBuffer(1, ctx.sampleRate * 10, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for(let i=0; i<data.length; i++) data[i] = Math.random() * 2 - 1;
        
        const padData = window.state.pads[0];
        padData.buffer = buf;
        padData.offset = 0;
        padData.duration = 1.0;
        padData.oneShot = true;
        padData.decay = 10;
        padData.volume = 1;
        
        window.initAudioEngine(); // make sure trackBusses exist
        
        console.log("Triggering via triggerSequencerSound");
        window.triggerSequencerSound(0, ctx.currentTime, 0.25, null);
        
        await new Promise(r => setTimeout(r, 2000));
        console.log("Done wait");
    });
    
    await browser.close();
})();
