let powerSupply = 0;
let powerDemand = 0;

class PowerPlant extends Building {
    constructor(x, y, layer) {
        super(x, y, 1, 1, 'assets/utility/powerPlant.png', true, layer);        

        this.powerSupply = /*12000*/ 150000;
    } 

    register() {
        this.updateAdjBuildingsAndRoads();
        powerSupply += this.powerSupply;
    }

    fillCellInfo(){
        cellInfo.innerText = `Power supply: ${this.powerSupply} (kW/h)`;
    }
}