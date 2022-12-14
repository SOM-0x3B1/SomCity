class IZone extends Zone {
    constructor(x, y, layer) {
        super(x, y, 'assets/zones/i.png', layer);

        this.workers = [];
        this.capacity = 50 + rnd(100);  

        this.buildingTexture = rnd(2);
    }

    get free() {
        return workers.length < this.capacity;
    }

    register() {
        freeWorkplaces.push(this);
        this.updateAdjBuildingsAndRoads();
    }

    addWorker(worker){
        this.workers.push(worker);

        if(this.workers.length >= this.capacity)
            freeWorkplaces.splice(freeWorkplaces.indexOf(this), 1);

        worker.job = this;
        worker.car.calcRoute(worker.job);
    }

    finishConstruction() {
        clearInterval(this.constructionInterval);
        this.buildingImg.src = `assets/zoneTextures/iz-${this.level}-${this.buildingTexture}.png`;
        rotateStaticImg(this.buildingImg, this.facing);

        for (let i = 0; i < this.households.length; i++) {
            const household = this.households[i];
            for (let j = 0; j < household.members.length; j++)
                household.members[j].lookForJob();
        }
    }

    fillCellInfo(){
        cellInfo.innerText = `Workers: ${this.workers.length} \n Max workers: ${this.capacity}`;
    }
}