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

        if (!this.shopping && this.housingBuilding == this.owner.workplace) {
            this.housingBuilding.workersPresent++;
            this.housingBuilding.updateEfficiency();
        }
        else if (this.shopping && this.housingBuilding instanceof CZone) {
            if (this.housingBuilding.customerQueue.length < this.housingBuilding.maxCustomers && this.housingBuilding.production > 0)
                this.housingBuilding.customerQueue.push(this);
            else{
                this.shopping = false;
                this.calcRoute(this.originalTarget);
            }
        }
    }

    leaveTargetBuilding() {
        if (!this.shopping && this.housingBuilding == this.owner.workplace) {
            this.housingBuilding.workersPresent--;
            this.housingBuilding.updateEfficiency();
        }
        else if (this.shopping)
            this.shopping = false;
    }
}