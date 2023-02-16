let freeRZones = [];
let maxPopulation = 0;

let rZoneLevels = [20, 20, 50, 100, 200];

class RZone extends Zone {
    constructor(x, y, layer) {
        super(x, y, 'assets/zones/r.png', layer);
        
        this.capacity = rZoneLevels[this.level];       

        this.buildingtexturePath = rnd(5); 

        this.powerConsumption = 0;
        this.waterConsumption = 0;

        this.households = [];
    }

    get free() {
        return this.households.length < this.capacity;
    }

    get people() {
        let count = 0;
        for (let i = 0; i < this.households.length; i++) 
            count += this.households[i].members.length;
        return count;
    }

    get peopleAtHome(){
        let count = 0;
        for (let i = 0; i < this.households.length; i++) 
            count += this.households[i].membersAtHome.length;
        return count;
    }

    register() {
        freeRZones.push(this);
        this.updateAdjBuildingsAndRoads();
        for (let i = 0; i < this.capacity; i++)
            new Household().assignZone();
    }

    addHouseHold(household) {
        this.households.push(household);

        if (!this.free)
            freeRZones.splice(freeRZones[freeRZones.indexOf(this)], 1);
    }


    finishConstruction() {
        clearInterval(this.constructionInterval);
        this.buildingImg.src = `assets/zoneTextures/rz-${this.level}-${this.buildingtexturePath}.png`;
        
        for (let i = 0; i < this.households.length; i++) {
            const household = this.households[i];
            for (let j = 0; j < household.members.length; j++)
                household.members[j].lookForJob();
        }
    }

    fillCellInfo(){
        cellInfo.innerText = `Households: ${this.households.length}/${this.capacity} \n Residents: ${this.people} \n At home: ${this.peopleAtHome} \n Development: ${this.level + 1} \n Power consumption: ${this.powerConsumption} (kWh/day) \n Water consumption: ${this.waterConsumption} (l/day)`;
    }

    removeRZone(){
        for (let i = 0; i < this.households.length; i++)
            this.households[i].remove();
        this.buildingImg.remove();
    }
}