class IZone extends Zone {
    constructor(x, y, layer) {
        super(x, y, 'assets/zones/i.png', layer);

        this.workers = [];
        this.capacity = 50 + rnd(100);  
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
        worker.job = this;
        worker.car.calcRoute(worker.job);
    }

    fillCellInfo(){
        cellInfo.innerText = `Workers: ${this.workers.length} \n Max workers: ${this.capacity}`;
    }
}