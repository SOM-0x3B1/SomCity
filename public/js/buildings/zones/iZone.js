class IZone extends Zone {
    constructor(x, y, layer) {
        super(x, y, 'assets/zones/i.png', layer);

        this.workers = [];
        this.capacity = 50 + rnd(100);
        this.hasNightShift = rnd(1) == 0;
        this.opens1;
        this.opens2;
        this.closes1;
        this.closes2;
        this.efficiency = 1;

        this.opens1 = ((6 + rnd(3)) * 60);
        this.closes1 = this.opens1 + ((10 + rnd(2)) * 60)
        if (this.closes1 > 1439)
            this.closes1 -= 1439;

        if (this.hasNightShift) {
            this.opens2 = this.closes1 - 30;
            this.closes2 = this.opens2 + ((10 + rnd(2)) * 60);      
            if (this.closes2 > 1439)
                this.closes2 -= 1439;      
        }

        this.buildingTexture = rnd(2);
    }

    get free() {
        return workers.length < this.capacity;
    }

    register() {
        freeWorkplaces.push(this);
        this.updateAdjBuildingsAndRoads();
    }

    addWorker(worker) {
        this.workers.push(worker);

        if (this.workers.length >= this.capacity)
            freeWorkplaces.splice(freeWorkplaces.indexOf(this), 1);

        worker.job = this;
        //worker.car.calcRoute(worker.job);
    }

    finishConstruction() {
        clearInterval(this.constructionInterval);
        this.buildingImg.src = `assets/zoneTextures/iz-${this.level}-${this.buildingTexture}.png`;
        rotateStaticImg(this.buildingImg, this.facing);
    }

    fillCellInfo() {
        cellInfo.innerText = `Workers: ${10}/${this.workers.length}/${this.capacity} (present/employed/max) \n Efficiency: ${Math.round(this.efficiency * 100)}% \n Has nightshift: ${this.hasNightShift} \n Opens: ${formatTime(this.opens1)} \n Closes: ${formatTime(this.closes1)}`;
        if(this.hasNightShift)
            cellInfo.innerText += `\n Opens (night): ${formatTime(this.opens2)} \n Closes (night): ${formatTime(this.closes2)}`;
    }
}