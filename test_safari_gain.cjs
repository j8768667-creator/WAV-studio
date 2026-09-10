const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:3000');
  
  await page.evaluate(async () => {
     window.state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
     const ctx = window.state.audioCtx;
     
     const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
     const data = buffer.getChannelData(0);
     for(let i=0; i<data.length; i++) data[i] = Math.random() * 2 - 1; // noise
     
     const source = ctx.createBufferSource();
     source.buffer = buffer;
     
     const gain = ctx.createGain();
     const t = ctx.currentTime + 0.1;
     const vol = 1.0;
     const dur = 0.5; // stop at 0.5s
     
     gain.gain.setValueAtTime(0, t);
     gain.gain.linearRampToValueAtTime(vol, t + 0.005);
     
     const fadeDur = 0.015;
     gain.gain.setValueAtTime(vol, t + dur - fadeDur);
     gain.gain.linearRampToValueAtTime(0, t + dur);
     
     source.connect(gain);
     gain.connect(ctx.destination);
     
     source.start(t, 0);
     source.stop(t + dur);
     
     console.log("Triggered noise with 0.5s dur. Stop called for t + dur");
     
     await new Promise(r => setTimeout(r, 1000));
     console.log("Done");
  });
  
  await new Promise(r => setTimeout(r, 1500));
  await browser.close();
})();
