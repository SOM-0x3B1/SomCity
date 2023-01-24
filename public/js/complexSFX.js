class ComplexSFX {
    constructor(path, count) {
        this.sounds = [];
        this.cSoundIndex = 0;
        this.queue = [];
        this.path = path;
        this.count = count;
    };

    load() {
        for (let i = 0; i < this.count; i++) {
            let a = new Audio('assets/sfx/' + this.path + (i + 1) + '.mp3');
            this.sounds.push(a);
            sfxs.push(a);
        }
        console.log(this.sounds);
    }

    playNext() {
        console.log(this);
        if (this.cSoundIndex == this.sounds.length)
            this.cSoundIndex = 0;

        this.sounds[this.cSoundIndex].currentTime = 0;
        this.sounds[this.cSoundIndex].play();
        this.cSoundIndex++;
    }

    playRandom() {
        if (this.cSoundIndex == this.sounds.length) {
            this.shuffle();
            this.cSoundIndex = 0;
        }
        this.sounds[this.queue[this.cSoundIndex]].currentTime = 0;
        this.sounds[this.queue[this.cSoundIndex]].play();
        this.cSoundIndex++;
    }

    shuffle() {
        let currentIndex = this.queue.length, randomIndex;

        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [this.queue[currentIndex], this.queue[randomIndex]] = [
                this.queue[randomIndex], this.queue[currentIndex]];
        }
    }
}