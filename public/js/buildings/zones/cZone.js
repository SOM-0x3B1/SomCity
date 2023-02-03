let cZones = [];

/*const products = {
    Food: 0,
    Household: 1,
    Furniture: 2,
    Tech: 3
}*/

const products = ['food', 'household items', 'furniture', 'tech', 'entertainment'];

class CZone extends WorkZone {
    constructor(x, y, layer) {
        let rndMaxWorkers = 5 + rnd(10);
        super(x, y, 'assets/zones/c.png', rndMaxWorkers, Math.round(rndMaxWorkers / 2), 200, layer);

        this.customerQueue = [];
        this.maxCustomers = 30;
        this.products = [rnd(products.length - 1)];

        this.buildingTexture = rnd(2);
    }

    get outOfStock(){
        return this.storage == 0;
    }

    register() {
        freeWorkplaces.push(this);
        cZones.push(this);
        this.updateAdjBuildingsAndRoads();
    }    

    finishConstruction() {
        clearInterval(this.constructionInterval);
        let type = "";
        for (const i of this.products)
            type += i + 1;

        this.buildingImg.src = `assets/zoneTextures/cz-${type}.png`;
        rotateStaticImg(this.buildingImg, this.facing);
    }

    requestProducts() {        
        if(this.workersPresent > 0 && this.storage < this.storageCapacity){
            for (let i = 0; i < iZones.length; i++) {
                if(iZones[i].canDeliver){                    
                    iZones[i].sendTruck(this);
                    break;
                }
            }
        }
    }

    fillCellInfo() {
        cellInfo.innerText = `Workers: ${this.workersPresent}/${this.workers.length}/${this.maxWorkers} (present/employed/max) \n Efficiency: ${Math.round(this.efficiency * 100)}%/${Math.round(this.maxEfficiency * 100)}% (current/max) \n Selling: ${products[this.products]} \n Customer queue: ${this.customerQueue.length} \n Rate of service: ${this.production}/${this.productionCapacity} (customer/minute) \n Storage: ${this.storage}/${this.storageCapacity} \n Has nightshift: ${this.hasNightShift} \n Opens: ${formatTime(this.opens1)} \n Closes: ${formatTime(this.closes1)}`;
        if(this.hasNightShift)
            cellInfo.innerText += `\n Opens (night): ${formatTime(this.opens2)} \n Closes (night): ${formatTime(this.closes2)}`;
    }
}