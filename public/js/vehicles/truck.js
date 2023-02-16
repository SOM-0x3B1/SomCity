class Truck extends Vehicle {
    constructor(ownerCompany) {
        let startingCell = entryPoints[rnd(entryPoints.length - 1)];
        super(startingCell.x, startingCell.y);

        this.ownerCompany = ownerCompany;
        this.cargo = 0;
        this.onTheRoad = false;

        this.carIcon = document.createElement('div'); 
        this.carIcon.className = 'truck';        
        this.drawOverlay(); 
    }

    enterTargetBuilding() {
        if (this.housingBuilding != this.ownerCompany) {
            this.housingBuilding.storage += this.cargo;
            cAllStorage += this.cargo;
            if (this.housingBuilding.storage > this.housingBuilding.storageCapacity) {
                this.cargo = this.housingBuilding.storage - this.housingBuilding.storageCapacity;
                cAllStorage -= this.housingBuilding.storage - this.housingBuilding.storageCapacity;
                this.housingBuilding.storage = this.housingBuilding.storageCapacity;
            }
            else
                this.cargo = 0;

            this.calcRoute(this.ownerCompany);
        }
        else if (this.onTheRoad) {
            this.housingBuilding.activeTrucks.splice(this.housingBuilding.activeTrucks.indexOf(this), 1);
            this.onTheRoad = false;
        }
    }

    leaveTargetBuilding() { }
}