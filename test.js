const state = {
    scenes: [[1,2], [3,4]],
    currentSceneIndex: 0,
    get seqTracks() { return this.scenes[this.currentSceneIndex]; }
};
console.log(state.seqTracks);
state.currentSceneIndex = 1;
console.log(state.seqTracks);
