class Building {
    constructor(x, y, width, height, texture, deletable, layer) {
        this.x = x;
        this.y = y;

        this.width = width
        this.height = height;

        this.texture = texture;

        this.deletable = deletable;

        this.layer = layer;
    }

    place(x, y) {
        deletePlanned();

        if (this.layer == planningLayer)
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
            setImgOfCell(x, y, this.texture, this.layer == mainLayer ? LayerIDs.Main : LayerIDs.Planning);
            resizeImg(x, y, this.width, this.height, this.layer == mainLayer ? LayerIDs.Main : LayerIDs.Planning);
        }
        else if (this.layer == planningLayer) {
            setImgOfCell(x, y, 'assets/red.png', this.layer == mainLayer ? LayerIDs.Main : LayerIDs.Planning);
            resizeImg(x, y, this.width, this.height, this.layer == mainLayer ? LayerIDs.Main : LayerIDs.Planning);
        }
    }

    updateAdjRoads() {
        let top = false;
        let down = false;
        let left = false;
        let right = false;

        if (this.y > 0)
            top = this.layer[this.y - 1][this.x];
        if (this.y < mapHeight - 1)
            down = this.layer[this.y + 1][this.x];
        if (this.x > 0)
            left = this.layer[this.y][this.x - 1];
        if (this.x < mapWidth - 1)
            right = this.layer[this.y][this.x + 1];

        let topIsRoad = top instanceof Road;
        let downIsRoad = down instanceof Road;
        let leftIsRoad = left instanceof Road;
        let rightIsRoad = right instanceof Road;

        let neighbours = [top, left, down, right];
        let neighboursAreRoads = [topIsRoad, leftIsRoad, downIsRoad, rightIsRoad];

        this.adjRoads = []; // adjacent roads
        for (let i = 0; i < 4; i++) {
            if (neighbours[i] && neighboursAreRoads[i])
                this.adjRoads.push(neighbours[i]);
        }
    }

    remove() {
        for (let ix = this.x; ix < this.x + this.width; ix++)
            for (let iy = this.y; iy < this.y + this.height; iy++)
                mainLayer[iy][ix] = undefined;

        if (this instanceof Road)
            this.updateDirections(true);

        ereaseCell(this.x, this.y, LayerIDs.Main);
    }
}