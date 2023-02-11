let cZones = [];

/*const products = {
    Food: 0,
    Household: 1,
    Furniture: 2,
    Tech: 3
}*/

const products = ['food', 'household items', 'furniture', 'tech', 'entertainment'];
const productDemands = [0, 0, 0, 0, 0];


for (let i = 0; i < products.length; i++) {
    let bar = document.getElementById('mainStat-demands-bar-c' + (i + 1));
    let barInfo = document.createElement('div');
    barInfo.className = 'barInfo';
    barInfo.innerText = products[i];
    bar.appendChild(barInfo);
}


class CZone extends WorkZone {
    constructor(x, y, layer) {
        let rndMaxWorkers = 5 + rnd(10);
        super(x, y, 'assets/zones/c.png', rndMaxWorkers, rndMaxWorkers, 200, true, layer);

        this.customerQueue = [];
        this.maxCustomers = 30;
        this.products = [rnd(products.length - 1)];

        this.buildingTexture = rnd(2);
    }

    get outOfStock() {
        return this.storage == 0;
    }

    register() {
        freeWorkplaces.push(this);
        cZones.push(this);
        this.updateAdjBuildingsAndRoads();

        this.storage = 30;
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
        if (this.workersPresent > 0 && this.storage < this.storageCapacity) {
            for (let i = 0; i < iZones.length; i++) {
                if (iZones[i].canDeliver) {
                    iZones[i].sendTruck(this);
                    break;
                }
            }
        }
    }

    serveCustomers() {
        for (let i = 0; this.customerQueue.length > 0 && i < this.production; i++) {
            let cCustomer = this.customerQueue.shift();
            if (this.storage > 0 && this.production > 0) {
                for (const product of this.products) {
                    while (this.storage > 0 && cCustomer.targetShopTypes[product] > 0) {
                        cCustomer.targetShopTypes[product]--;
                        productDemands[product]--;
                        this.storage -= 1;
                    }
                    if (cCustomer.targetShopTypes[product] == 0)
                        delete cCustomer.targetShopTypes[product];
                }
            }
            cCustomer.calcRoute(cCustomer.originalTarget);
        }

        if (this.production <= 0) {
            while (this.customerQueue.length > 0){
                let cCustomer = this.customerQueue.shift();
                cCustomer.calcRoute(cCustomer.originalTarget);
            }
        }
    }

    fillCellInfo() {
        cellInfo.innerText = `Workers: ${this.workersPresent}/${this.workers.length}/${this.maxWorkers} (present/employed/max) \n Efficiency: ${Math.round(this.efficiency * 100)}%/${Math.round(this.maxEfficiency * 100)}% (current/max) \n Selling: ${products[this.products]} \n Customers in queue: ${this.customerQueue.length}/${this.maxCustomers} \n Rate of service: ${this.production}/${this.productionCapacity} (customer/4 minutes) \n Storage: ${this.storage}/${this.storageCapacity} \n Opens: ${formatTime(this.opens1)} \n Closes: ${formatTime(this.closes1)}`;
        if (this.hasNightShift)
            cellInfo.innerText += `\n Opens (night): ${formatTime(this.opens2)} \n Closes (night): ${formatTime(this.closes2)}`;
    }
}