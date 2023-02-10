class Ambience {
    constructor(audioPath) {
        /*this.attack = new VariedSFX(attackPath, attackCount);*/
        this.a = new Audio('assets/ambience/' + audioPath + '.mp3');
        this.a.loop = true;
    };

    play() {
        this.a.currentTime = 0;
        this.a.play();
    }

    stop() {
        this.a.pause();
    }

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
            else{
                clearInterval(fadeAudio);
                this.stop();
            }
        }, 200);
    }

    load() {
        ambients.push(this.a);
    }
}