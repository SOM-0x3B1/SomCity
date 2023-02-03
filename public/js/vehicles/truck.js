class Truck extends Vehicle {
    constructor(ownerComplany, cargo) {          
        super(ownerComplany.entrance.x, ownerComplany.entrance.y);

        this.ownerComplany = ownerComplany;
        this.cargo = cargo;
    }

    enterTargetBuilding() {
        if (this.housingBuilding != this.ownerComplany) {
            this.housingBuilding.storage += this.cargo;
            if (this.housingBuilding.storage > this.housingBuilding.storageCapacity) {
                this.cargo = this.housingBuilding.storage - this.housingBuilding.storageCapacity;
                this.housingBuilding.storage = this.housingBuilding.storageCapacity
            }
            else
                this.cargo = 0;

            this.calcRoute(this.ownerComplany);
        }
    }

    leaveTargetBuilding() { }
}