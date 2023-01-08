class Household {
    constructor() {
        this.members = [];
        this.countOfMembers = 1 + rnd(2);       

        for (let i = 0; i < this.countOfMembers; i++)
            this.members.push(new Person());

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
    }

    remove(){
        this.homeZone = undefined;
        for (let i = 0; i < this.countOfMembers; i++)
            this.members[i].remove();
    }
}