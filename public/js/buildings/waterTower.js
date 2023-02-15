let waterSupply = 0;
let waterDemand = 0;

class WaterTower extends Building {
    constructor(x, y, layer) {
        super(x, y, 1, 1, 'assets/utility/waterTower.png', true, layer);        

        this.waterSupply;
    } 

    register() {
        this.updateAdjBuildingsAndRoads();
        this.waterSupply = waterLayer[this.y][this.x];
        waterSupply += this.waterSupply;
    }

    fillCellInfo(){
        cellInfo.innerText = `Water supply: ${this.waterSupply}`;
    }
}