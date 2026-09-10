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
            
            // Set up pad 0
            state.pads[0] = {
                buffer: buf,
                offset: 4.0,
                duration: 2.0,
                oneShot: true,
                scheduledNodes: []
            };
            
            // Re-define triggerSequencerSound just to test exactly what is in the app
            const scheduledTime = ctx.currentTime + 0.1;
            const pLocks = null;
            const basePlayDuration = 2.0;
            const padIndex = 0;
            const padData = state.pads[padIndex];
            
            const source = state.audioCtx.createBufferSource();
            source.buffer = padData.buffer;
            
            const effectivePitch = pLocks && pLocks.pitch !== undefined ? pLocks.pitch : (padData.pitch || 0);
            source.playbackRate.value = Math.pow(2, effectivePitch / 12);
            
            const baseVol = 1.0;
            const effectiveVol = pLocks && pLocks.volume !== undefined ? pLocks.volume : baseVol;

            const gain = state.audioCtx.createGain();
            const attack = Number(padData.attack || 0);
            const decay = Number(padData.decay !== undefined ? padData.decay : 10);
            
            gain.gain.setValueAtTime(0, scheduledTime);
            gain.gain.linearRampToValueAtTime(Number(effectiveVol), scheduledTime + attack + 0.005);
            
            const playDuration = padData.oneShot ? padData.duration : Math.min(basePlayDuration, padData.duration);
            const rawSafeDuration = Math.max(0.01, Math.min(playDuration, padData.buffer.duration - padData.offset));
            const safeDuration = Math.min(rawSafeDuration, decay);
            
            const fadeDur = Math.min(0.015, safeDuration / 2);
            console.log("Triggering pad:", padIndex, "oneShot:", padData.oneShot, "duration:", padData.duration, "safeDuration:", safeDuration, "decay:", decay);
            gain.gain.setValueAtTime(Number(effectiveVol), scheduledTime + safeDuration - fadeDur);
            gain.gain.linearRampToValueAtTime(0, scheduledTime + safeDuration);
            
            source.connect(gain);
            gain.connect(ctx.destination);
            
            source.start(scheduledTime, padData.offset, safeDuration);
            
            source.onended = () => console.log("Source ended at", ctx.currentTime - scheduledTime);
        };
        window.testBug();
    });
    
    await new Promise(r => setTimeout(r, 4000));
    await browser.close();
})();
