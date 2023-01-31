let IZones = [];

class IZone extends WorkZone {
    constructor(x, y, layer) {
        let maxWorkers = 50 + Math.round(100);
        super(x, y, 'assets/zones/i.png', maxWorkers, Math.round(maxWorkers / 10), 500 + rnd(10) * 100, layer);       

        this.activeTrucks = [];

        this.buildingTexture = rnd(2);
    }

    get canDeliver(){
        return this.storage > 0 && this.workersPresent > 0;
    }

    register() {
        freeWorkplaces.push(this);
        IZones.push(this);
        this.updateAdjBuildingsAndRoads();
    }

    finishConstruction() {
        clearInterval(this.constructionInterval);
        this.buildingImg.src = `assets/zoneTextures/iz-${this.level}-${this.buildingTexture}.png`;
        rotateStaticImg(this.buildingImg, this.facing);
    }

    sendTruck(target){
        let newTruck = new Truck();
        this.activeTrucks.push(newTruck);
        newTruck.calcRoute(target);
    }

    fillCellInfo() {
        cellInfo.innerText = `Workers: ${this.workersPresent}/${this.workers.length}/${this.maxWorkers} (present/employed/max) \n Efficiency: ${Math.round(this.efficiency * 100)}%/${Math.round(this.maxEfficiency * 100)}% (current/max)\n Production rate: ${this.production}/${this.productionCapacity} \n Storage: ${this.storage}/${this.storageCapacity} \n Has nightshift: ${this.hasNightShift} \n Opens: ${formatTime(this.opens1)} \n Closes: ${formatTime(this.closes1)}`;
        if(this.hasNightShift)
            cellInfo.innerText += `\n Opens (night): ${formatTime(this.opens2)} \n Closes (night): ${formatTime(this.closes2)}`;
    }
}