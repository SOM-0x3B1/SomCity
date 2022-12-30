class Road {
    constructor(x, y, type, capacity, deletable) {
        this.x = x;
        this.y = y;
        this.type = type; // eg. h as highway
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
            top = gameLayer[y - 1][x];
        else
            isOnEdge = true;

        if (y < mapHeight - 1)
            down = gameLayer[y + 1][x];
        else
            isOnEdge = true;

        // on one of the x edges
        if (x > 0)
            left = gameLayer[y][x - 1];
        else
            isOnEdge = true;

        if (x < mapWidth - 1)
            right = gameLayer[y][x + 1];
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

        getImg(x, y).src = 'assets/roads/' + this.type + '-' + this.directions + '.png';

        // update adjacent roads
        if (firstUpdate)
            for (let i = 0; i < this.adjRoads.length; i++)
                this.adjRoads[i].updateDirections(false);
    }
}