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

        this.opens1 = ((7 + rnd(2)) * 60);
        this.closes1 = this.opens1 + ((6 + rnd(3)) * 60)

        if (this.hasNightShift) {
            this.opens2 = this.closes1 - 60;
            this.closes2 = this.opens2 + ((5 + rnd(3)) * 60);            
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
        cellInfo.innerText = `Workers: ${this.workers.length} \n Max workers: ${this.capacity}`;
    }
}