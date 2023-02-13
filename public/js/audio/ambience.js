class Ambience {
    constructor(audioPath, calcD) {
        /*this.attack = new VariedSFX(attackPath, attackCount);*/
        this.a = new Audio('assets/ambience/' + audioPath + '.mp3');
        this.a.loop = true;
        this.dModifier = 1;
        this.calcD = calcD;
    };

    load() {
        ambients.push(this);
        this.changeD(this.calcD());
    }

    play() {
        this.a.currentTime = 0;
        this.a.play();
    }

    stop() {
        this.a.pause();
    }

    changeD(value) {
        if (value < 0)
            value = 0;
        else if (value > 1)
            value = 1;
        this.dModifier = value;
        this.a.volume = ambientVolume * masterVolume * this.dModifier;
    }

    //TODO: sync with dModifier
    fadeIn() {
        this.a.volume = 0;
        this.play();

        let fadeAudio = setInterval(() => {
            if (this.a.volume < 1.0)
                this.a.volume = Math.min(1, this.a.volume + 0.01);
            else
                clearInterval(fadeAudio);
        }, 200);
    }

    fadeOut() {
        let originalVolume = ambientVolume * masterVolume;
        let fadeAudio = setInterval(() => {
            if (this.a.volume > 0.0)
                this.a.volume = Math.max(0, this.a.volume - 0.01);
            else {
                clearInterval(fadeAudio);
                this.stop();
            }
        }, 200);
    }
}