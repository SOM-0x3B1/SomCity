let freeRZones = [];
let maxPopulation = 0;

let rZoneLevels = [2, 10, 50, 100, 1000];

class RZone extends Zone {
    constructor(x, y, layer) {
        super(x, y, 'assets/zones/r.png', layer);

        this.level = 0;
        this.capacity = rZoneLevels[this.level];

        this.buildingImg = new Image();
        this.buildingTexture = rnd(5);
        this.constructionPhase = 0;
        this.constructionInterval;

        this.started = false;

        this.households = [];
    }

    get free() {
        return this.households.length < this.capacity;
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

    startConstruction(){
        this.started = true;
        this.buildingImg.src = `assets/construction/construction${this.constructionPhase}.png`;
        getCell(this.x, this.y, LayerIDs.Main).appendChild(this.buildingImg);
        resizeStaticImg(this.buildingImg, 2, 2);        

        this.constructionInterval = setInterval(() => {
            this.constructionPhase++;
            if (this.constructionPhase > 4)
                this.finishConstruction();
            else{
                this.buildingImg.src = `assets/construction/construction${this.constructionPhase}.png`;
            }
        }, 3000);
    }

    finishConstruction() {
        clearInterval(this.constructionInterval);
        this.buildingImg.src = `assets/zoneTextures/rz-${this.level}-${this.buildingTexture}.png`;
        rotateStaticImg(this.buildingImg, this.facing);
    }

    removeRZone(){
        for (let i = 0; i < this.households.length; i++)
            this.households[i].remove();
        this.buildingImg.remove();
    }
}