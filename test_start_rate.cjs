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
            
            // 10 second buffer of white noise
            const buf = ctx.createBuffer(1, ctx.sampleRate * 10, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for(let i=0; i<data.length; i++) data[i] = Math.random() * 2 - 1;
            
            const source = ctx.createBufferSource();
            source.buffer = buf;
            source.connect(ctx.destination);
            source.playbackRate.value = 0.5;
            
            // Start at offset 0, duration 2
            source.start(ctx.currentTime, 0, 2);
            source.onended = () => console.log("ENDED EVENT FIRED at", ctx.currentTime);
            
            console.log("Started playing, should stop at 2s or 4s?");
        };
        window.testBug();
    });
    
    await new Promise(r => setTimeout(r, 5000));
    await browser.close();
})();
