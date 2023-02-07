let households = [];

class Household {
    constructor() {
        this.members = [];
        this.countOfMembers = 1 + rnd(2);      
        this.needs = []; 

        for (let i = 0; i < this.countOfMembers; i++)
            this.members.push(new Person(this));

        this.homeZone;
    }

    assignZone(){
        this.homeZone = freeRZones[rnd(freeRZones.length - 1)];
        this.homeZone.addHouseHold(this);
        //console.log(this.homeZone);
        for (let i = 0; i < this.countOfMembers; i++){
            //console.log(this.homeZone.entrance);
            this.members[i].car.calcRoute(this.homeZone);    
            targetedPeople.push(this.members[i]);  
            this.members[i].car.drawOverlay();
        }

        households.push(this);
    }

    addNeeds(){
        let random = rnd(21);
        if(random < products.length){
            let need = random;
            this.needs.push(need);
            this.members[rnd(this.members.length - 1)].car.targetShopTypes.push(need);
        }
    }

    remove(){
        this.homeZone = undefined;
        for (let i = 0; i < this.countOfMembers; i++)
            this.members[i].remove();
    }
}