let startRoadX;
let startRoadY;

class Road extends Building {
    constructor(x, y, type, capacity, deletable, layer) {
        // eg. h as highway
        super(x, y, 1, 1, type, layer);

        this.directions; // eg. 3j-u, v, h, etc.
        this.capacity = capacity; // how many cars can it hold
        this.cars = 0;
        this.deletable = deletable;

        this.adjRoads = []; // adjacent roads
        this.destination = []; // not road neighbours
    }

    updateDirections(firstUpdate) {
        let x = this.x;
        let y = this.y;

        // neigbouring buildings
        let top = false;
        let down = false;
        let left = false;
        let right = false;

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

        if (this.layer == planningLayer)
            getImg(x, y, 'planningGrid').src = 'assets/roads/' + this.type + '-' + this.directions + '.png';
        else
            getImg(x, y, 'mainGrid').src = 'assets/roads/' + this.type + '-' + this.directions + '.png';

        // update adjacent roads
        if (firstUpdate)
            for (let i = 0; i < this.adjRoads.length; i++)
                this.adjRoads[i].updateDirections(false);
    }

    static setRoadStart(x, y) {
        addImgToCell(x, y, 'planningGrid');
        previewCells.push(new COORD(x, y));
        planningLayer[y][x] = new Road(x, y, buildingUnderBuilding.type, buildingUnderBuilding.capacity, buildingUnderBuilding.deletable, planningLayer);
        getImg(x, y, 'planningGrid').src = 'assets/roads/' + buildingUnderBuilding.type + '-h.png';

        startRoadX = x;
        startRoadY = y;
    }
    static setRoadEnd(x, y) {
        firstOfTwoPoints = true;
        this.drawRoadLine(x, y);        
        deletePlanned();
    }

    static drawRoadLine(x, y) {
        if (Math.abs(x - startRoadX) >= Math.abs(y - startRoadY)) {
            if (x < startRoadX) {
                for (; x <= startRoadX; x++)
                    this.drawRoadCell(x, startRoadY);
            }
            else {
                for (; x >= startRoadX; x--)
                    this.drawRoadCell(x, startRoadY);
            }
        }
        else {
            if (y < startRoadY) {
                for (; y <= startRoadY; y++)
                    this.drawRoadCell(startRoadX, y);
            }
            else {
                for (; y >= startRoadY; y--)
                    this.drawRoadCell(startRoadX, y);
            }
        }
    }

    static drawRoadCell(x, y) {
        if (!firstOfTwoPoints) {
            addImgToCell(x, y, 'planningGrid');
            planningLayer[y][x] = new Road(x, y, buildingUnderBuilding.type, buildingUnderBuilding.capacity, buildingUnderBuilding.deletable, planningLayer);
            planningLayer[y][x].updateDirections(true);
            previewCells.push(new COORD(x, y));
        }
        else {
            addImgToCell(x, y, 'mainGrid');
            mainLayer[y][x] = new Road(x, y, buildingUnderBuilding.type, buildingUnderBuilding.capacity, buildingUnderBuilding.deletable);
            mainLayer[y][x].updateDirections(true);            
        }
    }
}