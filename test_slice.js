const totalDuration = 10;
const val = 2; // say 2 bars
const bpm = 120;
const beatLen = 60.0 / bpm;
const barLen = beatLen * 4;
const chunkLen = barLen * val;
let sliceLengths = [];
let cur = 0;
while (cur < totalDuration) {
    const remain = totalDuration - cur;
    sliceLengths.push(Math.min(chunkLen, remain));
    cur += chunkLen;
}
console.log(sliceLengths);
