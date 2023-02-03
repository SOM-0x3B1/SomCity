class PrivateCar extends Vehicle {
    constructor(person) {
        let startingCell = entryPoints[rnd(entryPoints.length - 1)];

        super(startingCell.x, startingCell.y);

        this.owner = person;        
    }

    enterTargetBuilding() {
        if (!this.housingBuilding.started)
            this.housingBuilding.startConstruction();

        if(this.housingBuilding instanceof WorkZone){
            this.housingBuilding.workersPresent++;
            this.housingBuilding.updateEfficiency();
        }
    }

    leaveTargetBuilding() {
        if(this.housingBuilding instanceof WorkZone){
            this.housingBuilding.workersPresent--;
            this.housingBuilding.updateEfficiency();
        }
    }
}