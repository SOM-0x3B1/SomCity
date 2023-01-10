let cellInfo = document.getElementById('cellInfo');

class Building {
    constructor(x, y, width, height, texture, deletable, layer) {
        this.x = x;
        this.y = y;
        this.adjBuildings = [];
        this.adjRoads = [];
        this.entrance;

        this.width = width
        this.height = height;
        this.texture = texture;
        this.facing = 0;

        this.deletable = deletable;

        this.layer = layer;
    }

    /** Places the building, and returns wether it was placed on a free area. */
    place(x, y) {
        clearPlanned();

        if (this.layer == planLayer)
            previewCells.push(new COORD(x, y))

        let occupied = false;
        for (let iy = y; iy < y + this.height; iy++) {
            for (let ix = x; ix < x + this.width; ix++) {
                if (!occupied)
                    occupied = isOccupied(ix, iy);
            }
        }

        if (!occupied && this.layer == mainLayer) {
            for (let iy = y; iy < y + this.height; iy++) {
                for (let ix = x; ix < x + this.width; ix++) {
                    ereaseCell(ix, iy, LayerIDs.Main);
                    mainLayer[iy][ix] = this;
                }
            }
        }

        if (!occupied) {
            setImgOfCell(x, y, this.texture, this.layer == mainLayer ? LayerIDs.Main : LayerIDs.plan);
            resizeImg(x, y, this.width, this.height, this.layer == mainLayer ? LayerIDs.Main : LayerIDs.plan);
        }
        else if (this.layer == planLayer) {
            setImgOfCell(x, y, 'assets/red.png', this.layer == mainLayer ? LayerIDs.Main : LayerIDs.plan);
            resizeImg(x, y, this.width, this.height, this.layer == mainLayer ? LayerIDs.Main : LayerIDs.plan);
        }

        return !occupied;
    }

    /** Updates the list of adjacent buildings. */
    updateAdjBuildingsAndRoads() {
        this.adjRoads = []; // clears adjacent roads
        this.adjBuildings = [];

        for (let ix = this.x; ix < this.x + this.width; ix++) {
            for (let iy = this.y; iy < this.y + this.height; iy++) {
                let top = false;
                let down = false;
                let left = false;
                let right = false;

                if (iy > 0)
                    top = this.layer[iy - 1][ix];
                if (iy < mapHeight - 1)
                    down = this.layer[iy + 1][ix];
                if (ix > 0)
                    left = this.layer[iy][ix - 1];
                if (ix < mapWidth - 1)
                    right = this.layer[iy][ix + 1];

                let topIsRoad = top instanceof Road;
                let downIsRoad = down instanceof Road;
                let leftIsRoad = left instanceof Road;
                let rightIsRoad = right instanceof Road;

                let neighbours = [top, left, down, right];
                let neighboursAreRoads = [topIsRoad, leftIsRoad, downIsRoad, rightIsRoad];

                for (let i = 0; i < 4; i++) {
                    if (neighbours[i] && neighboursAreRoads[i])
                        this.adjRoads.push(neighbours[i]);
                    else
                        this.adjBuildings.push(neighbours[i]);
                    //console.log(this.adjRoads);
                }
            }
        }

        this.entrance = this.adjRoads[rnd(this.adjRoads.length - 1)];

        if (this.entrance) {
            if (this.entrance.x < this.x)
                this.facing = 90;
            else if (this.entrance.y < this.y)
                this.facing = 180;
            else if (this.entrance.x > this.x + this.width - 1)
                this.facing = 270;
        }
    }

    /** Deletes this road. */
    remove() {
        for (let ix = this.x; ix < this.x + this.width; ix++)
            for (let iy = this.y; iy < this.y + this.height; iy++)
                mainLayer[iy][ix] = undefined;

        if (this instanceof Road)
            this.updateDirections(true);

        ereaseCell(this.x, this.y, LayerIDs.Main);
    }
}