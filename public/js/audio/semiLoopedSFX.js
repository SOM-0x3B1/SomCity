class SemiLoopedSFX {
    constructor(attackPath, attackCount, sustainPath) {
        this.attack = new VariedSFX(attackPath, attackCount);
        this.sustain = new Audio(sustainPath);
        sfxs.push(this.sustain)
        this.sustain.loop = true;
    };

    play() {
        this.attack.playRandom();
        this.sustain.play();
    }

    stop() {
        this.sustain.pause();
    }
}