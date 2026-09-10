const padData = { duration: 4.0, offset: 0, decay: undefined };
const bufferDuration = 10.0;
const safeDuration = Math.max(0.01, Math.min(padData.duration, bufferDuration - padData.offset));
const actualDur = Math.min(safeDuration, padData.decay !== undefined ? padData.decay : 10);
console.log("safeDur:", safeDuration, "actualDur:", actualDur);
