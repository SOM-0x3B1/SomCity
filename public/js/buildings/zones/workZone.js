let countOfAllJobs = 0
let countOfFreeJobs = 0;

class WorkZone extends Zone {
    constructor(x, y, texturePath, maxWorkers, productionCap, storageCap, forceNightShift, layer) {
        super(x, y, texturePath, layer);

        this.workers = [];
        this.workersPresent = 0;
        this.maxWorkers = maxWorkers;        
        this.production = 0;
        this.productionCapacity = productionCap;
        this.storage = 0;
        this.storageCapacity = storageCap;

        this.hasNightShift = forceNightShift ? true : rnd(1) == 0;
        this.opens1;
        this.opens2;
        this.closes1;
        this.closes2;

        this.efficiency = 0;
        this.maxEfficiency = 0;

        this.opens1 = ((6 + rnd(3)) * 60);
        this.closes1 = this.opens1 + ((10 + rnd(2)) * 60)
        if (this.closes1 > 1439)
            this.closes1 -= 1440;

        if (this.hasNightShift) {
            this.opens2 = this.closes1 - 30;
            this.closes2 = this.opens2 + ((10 + rnd(2)) * 60);      
            if (this.closes2 > 1439)
                this.closes2 -= 1440;      
        }
    }

    get free() {
        return workers.length < this.maxWorkers;
    }

    addWorker(worker) {
        this.workers.push(worker);
        countOfFreeJobs--;

        if (this.workers.length >= this.maxWorkers)
            freeWorkplaces.splice(freeWorkplaces.indexOf(this), 1);

        worker.job = this;

        this.updateEfficiency();
        //worker.car.calcRoute(worker.job);
    }

    updateEfficiency(){
        this.efficiency = this.workersPresent / this.maxWorkers;
        this.maxEfficiency = this.workers.length / this.maxWorkers;
        this.production = Math.round(this.productionCapacity * this.efficiency);
    }
}