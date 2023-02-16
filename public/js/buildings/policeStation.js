class PoliceStation extends Building {
    constructor(x, y, layer) {
        super(x, y, 2, 2, 'assets/services/police.png', true, layer);        

        this.cars = [];
    } 

    register() {
        this.updateAdjBuildingsAndRoads();

        for (let i = 0; i < 10; i++) {
            this.cars.push(new PoliceCar(this));
            this.cars[this.cars.length - 1].calcRoute(this);
            movingPoliceCars++;
        }
    }

    fillCellInfo() {
        cellInfo.innerText = `Police cars: ${this.cars.length}`;
    }
}