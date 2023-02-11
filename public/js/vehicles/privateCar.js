class PrivateCar extends Vehicle {
    constructor(person) {
        let startingCell = entryPoints[rnd(entryPoints.length - 1)];
        super(startingCell.x, startingCell.y);

        this.owner = person;
        this.home;

        this.carIcon = document.createElement('div');
        this.color = '#' + rnd(16777215).toString(16);
        this.carIcon.className = 'car';
        this.carIcon.style.backgroundColor = this.color;
        this.drawOverlay();
    }

    get atHome() {
        return this.housingBuilding == this.home;
    }
    get atWork() {
        return !this.shopping && this.housingBuilding == this.owner.workplace;
    }
    get atShop() {
        return this.shopping && this.housingBuilding instanceof CZone;
    }

    enterTargetBuilding() {
        if (!this.housingBuilding.started)
            this.housingBuilding.startConstruction();

        if (this.atHome) {
            this.owner.household.membersAtHome.push(this.owner);
            this.goShopping();
        }
        else if (this.atWork) {
            this.housingBuilding.workersPresent++;
            this.housingBuilding.updateEfficiency();
        }
        else if (this.atShop) {
            if (this.housingBuilding.customerQueue.length < this.housingBuilding.maxCustomers && this.housingBuilding.production > 0)
                this.housingBuilding.customerQueue.push(this);
            else {
                this.shopping = false;
                this.calcRoute(this.originalTarget);
            }
        }
    }

    goShopping(){
        if (Object.keys(this.targetShopTypes).length > 0) {
            let targetShop = this.findNearShops(20);
            if (targetShop) {
                this.originalTarget = this.home;
                this.shopping = true;
                this.calcRoute(targetShop);
            }
        }
    }

    leaveTargetBuilding() {
        if (this.atHome) {
            this.owner.household.membersAtHome.splice(this.owner.household.membersAtHome.indexOf(this.owner), 1);
            //console.log(this.owner.household.membersAtHome);
        }
        else if (this.atWork) {
            this.housingBuilding.workersPresent--;
            this.housingBuilding.updateEfficiency();
        }
        else if (this.atShop) {
            this.shopping = false;
            if (this.originalTarget == this.home && Object.keys(this.targetShopTypes).length > 0) {
                let targetShop = this.findNearShops(10);
                if (targetShop)
                    this.changeRouteNextTimeToTarget = targetShop;
            }
        }
    }
}