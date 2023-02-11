let iZones = [];

let iAllStorage = 0;
let iAllOptimalStorage = 0;

class IZone extends WorkZone {
    constructor(x, y, layer) {
        let rndMaxWorkers = 50 + rnd(100);
        super(x, y, 'assets/zones/i.png', rndMaxWorkers, Math.ceil(rndMaxWorkers / 10), 500 + rnd(10) * 100, false, layer);

        this.truckCount = Math.ceil(rndMaxWorkers / 20);
        this.trucks = [];
        this.activeTrucks = [];

        this.buildingTexture = rnd(2);
    }

    get canDeliver() {
        return this.storage >= 10 && this.workersPresent > 0 && this.activeTrucks.length < this.truckCount;
    }

    register() {
        freeWorkplaces.push(this);
        iZones.push(this);
        this.updateAdjBuildingsAndRoads();

        for (let i = 0; i < this.truckCount; i++) {
            this.trucks.push(new Truck(this));
            this.trucks[this.trucks.length - 1].calcRoute(this);
        }

        countOfAllJobs += this.maxWorkers;
        countOfFreeJobs += this.maxWorkers;

        iAllStorage += this.storage;
        iAllOptimalStorage += this.storageCapacity / 10;
    }

    finishConstruction() {
        clearInterval(this.constructionInterval);
        this.buildingImg.src = `assets/zoneTextures/iz-${this.level}-${this.buildingTexture}.png`;
        rotateStaticImg(this.buildingImg, this.facing);
    }

    sendTruck(target) {
        for (let i = 0; i < this.truckCount; i++) {
            if (!this.activeTrucks.includes(this.trucks[i])) {
                this.activeTrucks.push(this.trucks[i]);
                let cargo = (10 - this.trucks[i].cargo);
                this.storage -= cargo;
                iAllStorage -= cargo;
                this.trucks[i].cargo = 10;
                this.trucks[i].onTheRoad = true;
                this.trucks[i].calcRoute(target);
                break;
            }
        }
    }

    fillCellInfo() {
        cellInfo.innerText = `Workers: ${this.workersPresent}/${this.workers.length}/${this.maxWorkers} (present/employed/max) \n Efficiency: ${Math.round(this.efficiency * 100)}%/${Math.round(this.maxEfficiency * 100)}% (current/max)\n Production rate: ${this.production}/${this.productionCapacity} \n Storage: ${this.storage}/${this.storageCapacity} \n Trucks: ${this.truckCount} \n Opens: ${formatTime(this.opens1)} \n Closes: ${formatTime(this.closes1)}`;
        if (this.hasNightShift)
            cellInfo.innerText += `\n Opens (night): ${formatTime(this.opens2)} \n Closes (night): ${formatTime(this.closes2)}`;
    }
}