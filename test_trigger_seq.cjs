const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000');
  
  // Inject script to test trigger
  await page.evaluate(() => {
     // Wait for audio ctx
     const initBtn = document.createElement('button');
     initBtn.id = 'initBtn';
     initBtn.innerText = 'init';
     initBtn.addEventListener('click', () => {
         window.state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
         const ctx = window.state.audioCtx;
         window.state.masterGain = ctx.createGain();
         window.state.trackBusses = [];
         window.state.pads[0].buffer = ctx.createBuffer(1, ctx.sampleRate * 10, ctx.sampleRate);
         window.state.pads[0].duration = 2.0;
         window.state.pads[0].oneShot = true;
         window.state.trackBusses.push(ctx.createGain());
         
         console.log("Triggering...");
         // Simulate sequencer trigger
         try {
           const time = ctx.currentTime;
           const padData = window.state.pads[0];
           const playDuration = padData.duration;
           console.log("playDuration:", playDuration);
           const safeDuration = 2.0;
           
           const source = ctx.createBufferSource();
           source.buffer = padData.buffer;
           const gain = ctx.createGain();
           
           gain.gain.setValueAtTime(1.0, time + safeDuration - 0.015);
           gain.gain.linearRampToValueAtTime(0, time + safeDuration);
           source.connect(gain);
           gain.connect(ctx.destination);
           
           source.start(time, 0);
           source.stop(time + safeDuration);
           console.log("Trigger success");
         } catch(e) {
           console.error("Trigger fail:", e);
         }
     });
     document.body.appendChild(initBtn);
  });
  
  await page.click('#initBtn');
  
  await new Promise(r => setTimeout(r, 500));
  
  await browser.close();
})();
