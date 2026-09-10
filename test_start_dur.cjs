const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE:', msg.text()));
    await page.goto('http://localhost:3000');
    
    await page.evaluate(async () => {
        window.testBug = async () => {
            const ctx = state.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            state.audioCtx = ctx;
            
            // 10 second buffer
            const buf = ctx.createBuffer(1, ctx.sampleRate * 10, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for(let i=0; i<data.length; i++) data[i] = Math.random() * 2 - 1;
            
            const source = ctx.createBufferSource();
            source.buffer = buf;
            source.connect(ctx.destination);
            
            // Start at offset 0, duration 2
            source.start(ctx.currentTime, 0, 2);
            
            console.log("Started playing, should stop at 2s");
            setTimeout(() => console.log("3 seconds passed"), 3000);
        };
        window.testBug();
    });
    
    await new Promise(r => setTimeout(r, 4000));
    await browser.close();
})();
