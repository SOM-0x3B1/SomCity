class PrivateCar extends Vehicle {
    constructor(person) {
        let startingCell = entryPoints[rnd(entryPoints.length - 1)];
        super(startingCell.x, startingCell.y);

        this.owner = person;

        this.carIcon = document.createElement('div'); 
        this.color = '#' + rnd(16777215).toString(16);
        this.carIcon.className = 'car';     
        this.carIcon.style.backgroundColor = this.color;      
        this.drawOverlay(); 
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