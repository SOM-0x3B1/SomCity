let entryPoints = []; // outsiders spawn here
let roads = {};

let startRoadPos;

class Road extends Building {
    constructor(x, y, type, capacity, deletable, layer) {
        // eg. h as highway
        super(x, y, 1, 1, '', deletable, layer);

        this.type = type;
        this.directions; // eg. 3j-u, v, h, etc.
        this.capacity = capacity; // how many cars can it hold
        this.cars = 0;
    }

    register() {
        roads[coordsToKey(this.x, this.y)] = new SimplifiedRoad(this);
    }

    /**
     * Updates the adjacent buildings and sets the appropriate texture.
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
        for (let i = 0; i < 4; i++) {
            if (neighbours[i] && neighboursAreRoads[i])
                this.adjRoads.push(neighbours[i]);
            else if (neighbours[i] && neighbours[i] instanceof Building){
                neighbours[i].updateAdjBuildingsAndRoads();
                this.adjBuildings.push(neighbours[i]);                
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
        else{
            setImgOfCell(x, y, 'assets/roads/' + this.type + '-' + this.directions + '.png', LayerIDs.Main);
            this.register();
        }

        // update adjacent roads
        if (firstUpdate)
            for (let i = 0; i < this.adjRoads.length; i++)
                this.adjRoads[i].updateDirections(false);
    }


    /** Places the first cell of the road onto the plan layer. */
    static setRoadStart(x, y) {
        previewCells.push(new COORD(x, y));
        planLayer[y][x] = new Road(x, y, buildingUnderBuilding.type, buildingUnderBuilding.capacity, buildingUnderBuilding.deletable, planLayer);
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
                planLayer[y][x] = new Road(x, y, buildingUnderBuilding.type, buildingUnderBuilding.capacity, buildingUnderBuilding.deletable, planLayer);
                planLayer[y][x].updateDirections(true);
            }
            else
                setImgOfCell(x, y, 'assets/red.png', LayerIDs.plan);
            previewCells.push(new COORD(x, y));
        }
        else { // The road is actually being placed ==> main layer
            if (!isOccupied(x, y)) {
                mainLayer[y][x] = new Road(x, y, buildingUnderBuilding.type, buildingUnderBuilding.capacity, buildingUnderBuilding.deletable, mainLayer);
                mainLayer[y][x].updateDirections(true);
                mainLayer[y][x].register();
            }
        }
    }
}

class SimplifiedRoad{
    constructor(road){
        this.x = road.x;
        this.y = road.y;
        this.type = road.type;
        this.adjRoads = [];
        
        for (let i = 0; i < road.adjRoads.length; i++)
            this.adjRoads.push(coordsToKey(road.adjRoads[i].x, road.adjRoads[i].y));              
    }
}