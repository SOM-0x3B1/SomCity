let entryPoints = []; // outsiders spawn here
let roads = {};
let simplRoads = {};

let startRoadPos;

class Road extends Building {
    constructor(x, y, type, deletable, layer) {
        // eg. h as highway
        super(x, y, 1, 1, '', deletable, layer);

        this.directions; // eg. 3j-u, v, h, etc.

        this.cars = {};
        this.queues = {};
        this.queueKeys = [];

        this.type = type;
        this.capacity;
        this.DijkstraWeight;
        switch (this.type) {
            case 'h':
                this.DijkstraWeight = 0.6;
                this.capacity = 16;
                break;
            case 'm':
                this.DijkstraWeight = 0.8;
                this.capacity = 8;
                break;
            case 's':
                this.DijkstraWeight = 1;
                this.capacity = 4;
                break;
        }
        this.speedPerQueue = this.capacity / 4;
    }

    isFull(key) {
        return this.capacity <= this.cars[key];
    }

    get isJammed() {
        for (const key in this.queues)
            if (this.queues[key].length > this.speedPerQueue)
                return true;
        return false;
    }

    get inQueue() {
        let res = 0;
        for (const key in this.queues)
            res += this.queues[key].length;
        return res;
    }

    get countOfCars() {
        let result = 0;
        for (const key in this.cars)
            result += this.cars[key];
        return result;
    }

    register() {
        roads[coordsToKey(this.x, this.y)] = this;
        simplRoads[coordsToKey(this.x, this.y)] = new SimplifiedRoad(this);
    }

    /**
     * Updates the adjacent buildings and sets the appropriate texturePath.
     * @param {*} firstUpdate - If true, the function will also update the adjacent roads.
     */
    updateDirections(firstUpdate) {
        let x = this.x;
        let y = this.y;

        // neigbouring buildings
        let top;
        let down;
        let left;
        let right;

        let isOnEdge = false;

        // on one of the y edges
        if (y > 0)
            top = this.layer[y - 1][x];
        else
            isOnEdge = true;

        if (y < mapHeight - 1)
            down = this.layer[y + 1][x];
        else
            isOnEdge = true;

        // on one of the x edges
        if (x > 0)
            left = this.layer[y][x - 1];
        else
            isOnEdge = true;

        if (x < mapWidth - 1)
            right = this.layer[y][x + 1];
        else
            isOnEdge = true;

        // if this is a pregenerated highway on the edge, outsiders will spawn here
        if (!this.deletable && firstUpdate && isOnEdge)
            entryPoints.push(this);

        let topIsRoad = top instanceof Road;
        let downIsRoad = down instanceof Road;
        let leftIsRoad = left instanceof Road;
        let rightIsRoad = right instanceof Road;

        let neighbours = [top, left, down, right];
        let neighboursAreRoads = [topIsRoad, leftIsRoad, downIsRoad, rightIsRoad];

        this.adjRoads = [];
        this.queueKeys = [];
        for (let i = 0; i < 4; i++) {
            let neighbor = neighbours[i];
            if (neighbor && neighboursAreRoads[i]) {
                this.adjRoads.push(neighbor);

                this.updateQueuesAndCars(neighbor);
            }
            else if (neighbor && neighbor instanceof Building) {
                neighbor.updateAdjBuildingsAndRoads();
                this.adjBuildings.push(neighbor);

                this.updateQueuesAndCars(neighbor);
                if (neighbor instanceof RZone) {
                    for (let i = 0; i < neighbor.households.length; i++) {
                        const household = neighbor.households[i];
                        for (let j = 0; j < household.members.length; j++)
                            household.members[j].car.changeRouteNextTimeToTarget = neighbor;
                    }
                }
            }
        }

        switch (this.adjRoads.length) {
            case 1:
                if (leftIsRoad || rightIsRoad)
                    this.directions = 'h';
                else
                    this.directions = 'v';
                break;
            case 2:
                if (leftIsRoad && rightIsRoad)
                    this.directions = 'h';
                else if (topIsRoad && downIsRoad)
                    this.directions = 'v';
                else if (topIsRoad && leftIsRoad)
                    this.directions = 't-ul';
                else if (topIsRoad && rightIsRoad)
                    this.directions = 't-ur';
                else if (downIsRoad && leftIsRoad)
                    this.directions = 't-dl';
                else if (downIsRoad && rightIsRoad)
                    this.directions = 't-dr';
                break;
            case 3:
                if (topIsRoad && leftIsRoad && rightIsRoad)
                    this.directions = '3j-u';
                else if (topIsRoad && rightIsRoad && downIsRoad)
                    this.directions = '3j-r';
                else if (leftIsRoad && downIsRoad && rightIsRoad)
                    this.directions = '3j-d';
                else if (downIsRoad && leftIsRoad && topIsRoad)
                    this.directions = '3j-l';
                break;
            case 4:
                this.directions = '4j';
                break;
            default:
                this.directions = 'h';
                break;
        }


        if (this.layer == planLayer)
            setImgOfCell(x, y, 'assets/roads/' + this.type + '-' + this.directions + '.png', LayerIDs.plan);
        else {
            setImgOfCell(x, y, 'assets/roads/' + this.type + '-' + this.directions + '.png', LayerIDs.Main);
            this.register();
        }

        // update adjacent roads
        if (firstUpdate)
            for (let i = 0; i < this.adjRoads.length; i++)
                this.adjRoads[i].updateDirections(false);
    }

    updateQueuesAndCars(neighbor) {
        if (!this.queues[coordsToKey(neighbor.x, neighbor.y)])
            this.queues[coordsToKey(neighbor.x, neighbor.y)] = [];
        this.queueKeys.push(coordsToKey(neighbor.x, neighbor.y));

        if (!this.cars[coordsToKey(neighbor.x, neighbor.y)])
            this.cars[coordsToKey(neighbor.x, neighbor.y)] = 0;

        for (let i = 0; i < this.queues[coordsToKey(neighbor.x, neighbor.y)].length; i++)
            this.queues[coordsToKey(neighbor.x, neighbor.y)][i].changeRouteNextTimeToTarget = this.queues[coordsToKey(neighbor.x, neighbor.y)][i].target;
    }

    moveCars() {
        shuffle(this.queueKeys);
        for (let j = 0; j < this.queueKeys.length; j++) {
            let queue = this.queues[this.queueKeys[j]];
            for (let i = 0; i < this.speedPerQueue && queue.length > 0 && !this.isFull(this.queueKeys[j]); i++) {
                let car = queue.shift();

                let cRoadKey = coordsToKey(this.x, this.y);

                let newLastRoadKey = coordsToKey(car.x, car.y);
                if (roads[newLastRoadKey]) {
                    if (car.lastRoadKey && roads[newLastRoadKey].cars[car.lastRoadKey])
                        roads[newLastRoadKey].cars[car.lastRoadKey]--;
                    car.lastRoadKey = newLastRoadKey;                    
                }
                roads[cRoadKey].cars[newLastRoadKey]++;

                car.x = this.x;
                car.y = this.y;
                car.cRoad = this;
                car.firstTimeInJammedJunction = false;

                //car.carIcon.style.transitionDelay = i * 5 + 'ms';
                car.drawOverlay();

                car.waiting = false;
            }
        }
    }

    drawOverlay(){
        //console.log(this.countOfCars / this.capacity);
        setCellOverlayColor(this.x, this.y, (this.countOfCars / this.capacity));
    }


    /** Places the first cell of the road onto the plan layer. */
    static setRoadStart(x, y) {
        previewCells.push(new COORD(x, y));
        planLayer[y][x] = new Road(x, y, buildingUnderBuilding.type, buildingUnderBuilding.deletable, planLayer);
        setImgOfCell(x, y, 'assets/roads/' + buildingUnderBuilding.type + '-h.png', LayerIDs.plan);

        startRoadPos = new COORD(x, y);
    }
    /** Places the road onto the main layer. */
    static setRoadEnd(x, y) {
        firstOfTwoPoints = true;
        this.drawRoadLine(x, y);
        clearPlanned();
    }

    /**
     * Draws the full line of road (wether on the main layer or not will be decided in the drawRoadCell function).
     * @param {*} x - The ending x position of the road.
     * @param {*} y - The ending y position of the road.
     */
    static drawRoadLine(x, y) {
        if (Math.abs(x - startRoadPos.x) >= Math.abs(y - startRoadPos.y)) {
            if (x < startRoadPos.x) {
                for (; x <= startRoadPos.x; x++)
                    this.drawRoadCell(x, startRoadPos.y);
            }
            else {
                for (; x >= startRoadPos.x; x--)
                    this.drawRoadCell(x, startRoadPos.y);
            }
        }
        else {
            if (y < startRoadPos.y) {
                for (; y <= startRoadPos.y; y++)
                    this.drawRoadCell(startRoadPos.x, y);
            }
            else {
                for (; y >= startRoadPos.y; y--)
                    this.drawRoadCell(startRoadPos.x, y);
            }
        }
    }

    static drawRoadCell(x, y) {
        if (!firstOfTwoPoints) { // The road is still being planned ==> plan layer
            if (!isOccupied(x, y)) {
                planLayer[y][x] = new Road(x, y, buildingUnderBuilding.type, buildingUnderBuilding.deletable, planLayer);
                planLayer[y][x].updateDirections(true);
            }
            else
                setImgOfCell(x, y, 'assets/red.png', LayerIDs.plan);
            previewCells.push(new COORD(x, y));
        }
        else { // The road is actually being placed ==> main layer
            if (!isOccupied(x, y)) {
                mainLayer[y][x] = new Road(x, y, buildingUnderBuilding.type, buildingUnderBuilding.deletable, mainLayer);
                mainLayer[y][x].updateDirections(true);
                mainLayer[y][x].register();
            }
        }
    }

    fillCellInfo() {
        cellInfo.innerText = `Speed: ${this.speedPerQueue} cars/min/direction \n Cars: ${this.countOfCars} \n Traffic jam: ${this.isJammed} \n In queue: ${this.inQueue}`;
    }
}

class SimplifiedRoad {
    constructor(road) {
        this.x = road.x;
        this.y = road.y;
        //this.type = road.type;
        this.DijkstraWeight = road.DijkstraWeight;
        this.adjRoads = [];

        for (let i = 0; i < road.adjRoads.length; i++)
            this.adjRoads.push(coordsToKey(road.adjRoads[i].x, road.adjRoads[i].y));
    }
}