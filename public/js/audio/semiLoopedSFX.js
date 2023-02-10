class SemiLoopedSFX {
    constructor(attackPath, /*attackCount,*/ sustainPath, decayPath) {
        /*this.attack = new VariedSFX(attackPath, attackCount);*/
        this.attack = new Audio('assets/sfx/' + attackPath + '.mp3');
        this.attack.addEventListener('timeupdate', () => {
            if(this.attack.currentTime > this.attack.duration - .44 && !this.attack.paused){
                this.sustain.currentTime = 0
                this.sustain.play()
            }
        });

        this.sustain = new Audio('assets/sfx/' + sustainPath + '.mp3');
        this.sustain.addEventListener('timeupdate', () => {
            if(this.sustain.currentTime > this.sustain.duration - .44 && !this.sustain.paused){
                this.sustain.currentTime = 0
                this.sustain.play()
            }
        });

        this.decay = new Audio('assets/sfx/' + decayPath + '.mp3');
    };    

    play() {
        this.attack.currentTime = 0;
        this.attack.play();
    }

    stop() {
        this.attack.pause();
        this.sustain.pause();
        this.decay.currentTime = 0;
        this.decay.play();
    }

    load(){
        sfxs.push(this.attack);
        sfxs.push(this.sustain);
        sfxs.push(this.decay);
    }
}