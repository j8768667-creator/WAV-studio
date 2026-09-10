const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE:', msg.text()));
    await page.goto('http://localhost:3000');
    
    await page.evaluate(async () => {
        // Load dummy buffer 10 seconds long
        const ctx = window.state.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        window.state.audioCtx = ctx;
        const buf = ctx.createBuffer(1, ctx.sampleRate * 10, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for(let i=0; i<data.length; i++) data[i] = Math.random() * 2 - 1;
        
        window.state.pads[0].buffer = buf;
        window.state.pads[0].duration = 1.0; // 1 second
        window.state.pads[0].offset = 0;
        window.state.pads[0].oneShot = true;
        window.state.pads[0].decay = 10;
        
        // Call playManualPad
        window.playManualPad(0);
        console.log("Called playManualPad for 1 second on 10s buffer");
        
        await new Promise(r => setTimeout(r, 1500));
        console.log("Done waiting 1.5s, is it still playing?");
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
