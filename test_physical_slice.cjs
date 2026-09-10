const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE:', msg.text()));
    await page.goto('http://localhost:3000');
    
    await page.evaluate(async () => {
        const ctx = window.state.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        
        // 10 second buffer
        const sourceBuffer = ctx.createBuffer(1, ctx.sampleRate * 10, ctx.sampleRate);
        const data = sourceBuffer.getChannelData(0);
        for(let i=0; i<data.length; i++) data[i] = i / data.length; // ramp
        
        const currentOffset = 2.0; // start at 2s
        const slen = 2.0; // 2 seconds slice
        
        const sampleRate = sourceBuffer.sampleRate;
        const startSample = Math.floor(currentOffset * sampleRate);
        let endSample = Math.floor((currentOffset + slen) * sampleRate);
        endSample = Math.min(endSample, sourceBuffer.length);
        const frameCount = endSample - startSample;
        
        console.log("startSample:", startSample, "endSample:", endSample, "frameCount:", frameCount);
        
        let newBuf = sourceBuffer;
        if (frameCount > 0) {
            newBuf = ctx.createBuffer(sourceBuffer.numberOfChannels, frameCount, sampleRate);
            for (let c = 0; c < sourceBuffer.numberOfChannels; c++) {
                const channelData = sourceBuffer.getChannelData(c);
                const newChannelData = newBuf.getChannelData(c);
                for (let s = 0; s < frameCount; s++) {
                    newChannelData[s] = channelData[startSample + s];
                }
            }
        }
        
        console.log("newBuf duration:", newBuf.duration);
    });
    
    await browser.close();
})();
