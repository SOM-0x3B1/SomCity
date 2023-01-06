let freeRZones = [];

class RZone extends Zone {
    constructor(x, y, layer) {
        super(x, y, 'assets/zones/r.png', layer);

        this.capacity = 2;
        this.households = [];
    }

    get free() {
        return this.households.length < this.capacity;
    }

    register() {
        freeRZones.push(this);
        this.updateAdjBuildingsAndRoads();
        new Household().assignZone();
    }

    addHouseHold(household) {
        this.households.push(household);

        if (!this.free)
            freeRZones.splice(freeRZones[freeRZones.indexOf(this)], 1);
    }
}