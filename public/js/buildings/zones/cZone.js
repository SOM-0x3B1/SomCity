let cZones = [];

/*const products = {
    Food: 0,
    Household: 1,
    Furniture: 2,
    Tech: 3
}*/

const products = ['food', 'household', 'furniture', 'tech', 'entertainment'];

class CZone extends WorkZone {
    constructor(x, y, layer) {
        super(x, y, 'assets/zones/c.png', 5 + rnd(10), Math.round(this.maxWorkers / 2), 1000, layer);

        this.customerQueue = [];
        this.maxCustomers = 30;
        this.products = [rnd(products.length)];

        this.buildingTexture = rnd(2);
    }

    register() {
        freeWorkplaces.push(this);
        cZones.push(this);
        this.updateAdjBuildingsAndRoads();
    }

    finishConstruction() {
        clearInterval(this.constructionInterval);
        this.buildingImg.src = `assets/zoneTextures/cz-${this.level}-${this.buildingTexture}.png`;
        rotateStaticImg(this.buildingImg, this.facing);
    }

    fillCellInfo() {
        cellInfo.innerText = `Workers: ${this.workersPresent}/${this.workers.length}/${this.maxWorkers} (present/employed/max) \n Efficiency: ${Math.round(this.efficiency * 100)}%/${Math.round(this.maxEfficiency * 100)}% (current/max) \n Selling: ${products[this.products]} \n Customer queue: ${this.customerQueue.length} \n Rate of service: ${this.production}/${this.productionCapacity} (customer/minute) \n Storage: ${this.storage}/${this.storageCapacity} \n Has nightshift: ${this.hasNightShift} \n Opens: ${formatTime(this.opens1)} \n Closes: ${formatTime(this.closes1)}`;
        if(this.hasNightShift)
            cellInfo.innerText += `\n Opens (night): ${formatTime(this.opens2)} \n Closes (night): ${formatTime(this.closes2)}`;
    }
}