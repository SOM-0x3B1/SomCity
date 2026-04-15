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

        this.homeZone.powerConsumption += 72 * this.members.length;
        this.homeZone.waterConsumption += 142 * this.members.length;
        powerDemand += 72 * this.members.length;
        waterDemand += 142 * this.members.length;

        households.push(this);
    }

    addNeeds() {
        const random = rnd(126);
        if (random < products.length) {
            const need = random;
            productDemands[need]++;

            let memberIndex;
            if (this.membersAtHome.length == 0) {
                memberIndex = rnd(this.members.length - 1);
                if (this.members[memberIndex].car.targetShopTypes[need])
                    this.members[memberIndex].car.targetShopTypes[need]++;
                else
                    this.members[memberIndex].car.targetShopTypes[need] = 1;
            }
            else {
                memberIndex = rnd(this.membersAtHome.length - 1);
                if (this.membersAtHome[memberIndex].car.targetShopTypes[need])
                    this.membersAtHome[memberIndex].car.targetShopTypes[need]++;
                else
                    this.membersAtHome[memberIndex].car.targetShopTypes[need] = 1;

                if (this.membersAtHome[memberIndex].car.atHome)
                    this.membersAtHome[memberIndex].car.goShopping();
            }
        }
    }

    remove() {
        this.homeZone = undefined;
        for (let i = 0; i < this.countOfMembers; i++)
            this.members[i].remove();
    }
}