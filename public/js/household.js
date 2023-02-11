let households = [];

class Household {
    constructor() {
        this.members = [];
        this.membersAtHome = [];
        this.countOfMembers = 1 + rnd(2);
        this.homeZone;

        for (let i = 0; i < this.countOfMembers; i++)
            this.members.push(new Person(this, i));
    }

    assignZone() {
        this.homeZone = freeRZones[rnd(freeRZones.length - 1)];
        this.homeZone.addHouseHold(this);
        //console.log(this.homeZone);
        for (let i = 0; i < this.countOfMembers; i++) {
            //console.log(this.homeZone.entrance);
            this.members[i].car.calcRoute(this.homeZone);
            this.members[i].car.drawOverlay();

            this.members[i].car.home = this.homeZone;
        }

        households.push(this);
    }

    addNeeds() {
        let random = rnd(21);
        if (random < products.length) {
            let need = random;
            productDemands[need]++;

            if (this.membersAtHome.length == 0) {
                let member = rnd(this.members.length - 1);
                if (this.members[member].car.targetShopTypes[need])
                    this.members[member].car.targetShopTypes[need]++;
                else
                    this.members[member].car.targetShopTypes[need] = 1;
            }
            else {
                let member = rnd(this.membersAtHome.length - 1);
                if (this.membersAtHome[member].car.targetShopTypes[need])
                    this.membersAtHome[member].car.targetShopTypes[need]++;
                else
                    this.membersAtHome[member].car.targetShopTypes[need] = 1;

                if (this.membersAtHome[member].car.atHome)
                    this.membersAtHome[member].car.goShopping();
            }
        }
    }

    remove() {
        this.homeZone = undefined;
        for (let i = 0; i < this.countOfMembers; i++)
            this.members[i].remove();
    }
}