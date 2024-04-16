let mapWidth = 60;
let mapHeight = 60;

/** The matrix that stores the real buildings and terrain. */
let mainLayer = new Array(mapHeight);
for (let i = 0; i < mapHeight; i++)
    mainLayer[i] = new Array(mapWidth);

/** The matrix that stores the buildings for preview. */
let planLayer = new Array(mapHeight);
for (let i = 0; i < mapHeight; i++)
    planLayer[i] = new Array(mapWidth);

let waterLayer = new Array(mapHeight);
for (let i = 0; i < mapHeight; i++)
    waterLayer[i] = new Array(mapWidth);

let windLayer = new Array(mapHeight);
for (let i = 0; i < mapHeight; i++)
    windLayer[i] = new Array(mapWidth);


/** The IDs of each layer. */
const LayerIDs = {
    Main: "mainGrid",
    plan: "planGrid"
}

/**
 * Generates the HTML grid element, and adds events to its cells.
 * @param {*} rows - The number of rows.
 * @param {*} cols  - The number of columns.
 */
function buildGrid(rows, cols) {
    let containers = document.getElementsByClassName("gameGrid"); // Gets the layer HTML elements

    for (const container of containers) {
        container.style.setProperty('--grid-rows', rows);
        container.style.setProperty('--grid-cols', cols);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < rows; x++) {
                let cell = document.createElement('div');
                cell.id = `${container.id}(${x};${y})`; // Adressing each cell

                if (container.id == LayerIDs.Main) {
                    let cellBoder = document.createElement('div');
                    cellBoder.className = 'cellBorder';
                    cellBoder.id = `cellBorder-${container.id}(${x};${y})`
                    cell.appendChild(cellBoder); // The squares that show the borders of each cell

                    cell.onclick = () => {
                        if (placing) {
                            if (buildingUnderBuilding instanceof Road) {
                                if (firstOfTwoPoints) {
                                    firstOfTwoPoints = false;
                                    aRoadPlanning.play();
                                }
                                else {
                                    Road.setRoadEnd(x, y);
                                    aRoadPlanning.stop();
                                }
                            }
                            else if (buildingUnderBuilding instanceof Zone) {
                                let newZone;

                                if (buildingUnderBuilding instanceof RZone)
                                    newZone = new RZone(x, y, mainLayer);
                                else if (buildingUnderBuilding instanceof CZone) {
                                    let p = buildingUnderBuilding.products[0];
                                    if (p == 5)
                                        newZone = new CZone(x, y, rnd(products.length - 1), mainLayer);
                                    else
                                        newZone = new CZone(x, y, p, mainLayer);
                                }
                                else if (buildingUnderBuilding instanceof IZone)
                                    newZone = new IZone(x, y, mainLayer);

                                if (newZone.place(x, y)) {
                                    newZone.register();
                                    aAllocate.playRandom();
                                }
                            }
                            else if (buildingUnderBuilding instanceof WaterTower) {
                                let newTower = new WaterTower(x, y, mainLayer);
                                newTower.place(x, y);
                                newTower.register();
                                aWater.playNext();
                            }
                            else if (buildingUnderBuilding instanceof WindTurbine) {
                                let newTower = new WindTurbine(x, y, mainLayer);
                                newTower.place(x, y);
                                newTower.register();
                                aPower.playNext();
                            }
                            else if (buildingUnderBuilding instanceof PowerPlant) {
                                let newPlant = new PowerPlant(x, y, mainLayer);
                                newPlant.place(x, y);
                                newPlant.register();
                                aPower.playNext();
                            }
                            else if (buildingUnderBuilding instanceof PoliceStation) {
                                let newPlant = new PoliceStation(x, y, mainLayer);
                                newPlant.place(x, y);
                                newPlant.register();
                                aPoliceStation.playNext();
                            }
                        }
                        else if (!bulldozing && mainLayer[y][x] instanceof Building) {
                            aCellinfo.playNext();
                            cell.appendChild(cellInfo);
                            cellInfo.style.display = 'inline-block';
                            mainLayer[y][x].fillCellInfo();
                            objectOfCellInfo = mainLayer[y][x];
                        }
                    }
                    cell.onmouseenter = () => {
                        if (placing) {
                            if (buildingUnderBuilding instanceof Road) {
                                clearPlanned();
                                if (firstOfTwoPoints)
                                    Road.setRoadStart(x, y); // Shows the preview of the first roadpiece
                                else
                                    Road.drawRoadLine(x, y); // Shows the whole preview line of the planned road
                            }
                            else if (buildingUnderBuilding instanceof Building)
                                buildingUnderBuilding.place(x, y);
                        }
                        else if (bulldozing) {
                            if (bulldozingFirstPos) {
                                clearPlanned();
                                // Please ignore the content of the following fors, I will make them prettier later
                                for (let ix = bulldozingFirstPos.x; bulldozingFirstPos.x < x ? ix <= x : ix >= x; bulldozingFirstPos.x < x ? ix++ : ix--)
                                    for (let iy = bulldozingFirstPos.y; bulldozingFirstPos.y < y ? iy <= y : iy >= y; bulldozingFirstPos.y < y ? iy++ : iy--)
                                        drawBulldoze(ix, iy);
                            }
                            else
                                drawBulldoze(x, y);
                        }
                        else if (cellInfo.style.display != 'none') {
                            cellInfo.style.display = 'none';
                            objectOfCellInfo = undefined;
                        }
                    }
                    cell.onmousedown = () => {
                        if (bulldozing)
                            bulldozingFirstPos = new COORD(x, y);
                    }
                    cell.onmouseup = () => {
                        if (bulldozing && bulldozingFirstPos) {
                            for (let ix = bulldozingFirstPos.x; bulldozingFirstPos.x < x ? ix <= x : ix >= x; bulldozingFirstPos.x < x ? ix++ : ix--) {
                                for (let iy = bulldozingFirstPos.y; bulldozingFirstPos.y < y ? iy <= y : iy >= y; bulldozingFirstPos.y < y ? iy++ : iy--) {
                                    let target = mainLayer[iy][ix];
                                    if (target && target instanceof Building && target.deletable) {
                                        aBulldoze.playNext();
                                        if (target instanceof Road)
                                            delete simplRoads[coordsToKey(ix, iy)];
                                        else if (target instanceof RZone)
                                            target.removeRZone();
                                        target.remove();
                                    }
                                    else if (target == 't') {
                                        aBulldoze.playNext();
                                        target = null;
                                        ereaseCell(ix, iy, LayerIDs.Main);
                                    }
                                }
                            }
                            clearPlanned();
                            bulldozingFirstPos = undefined;
                        }
                    }
                }

                container.appendChild(cell).className = 'grid-item';
            }
        };
    }
};

buildGrid(mapWidth, mapHeight);


/** Fills the grid with objects  */
async function buildNewBaseMap() {
    const maps = ['b', 't', 'w', 'wind']; // 'b' as buildings, 't' as terrain, 'w' as water
    let canvas = document.createElement('canvas');
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    let context = canvas.getContext('2d', { willReadFrequently: true });

    for (const layer of maps) {
        let img = new Image();
        img.src = 'assets/maps/map1-' + layer + '.png';

        img.onload = () => {
            context.drawImage(img, 0, 0, img.width, img.height);

            for (let x = 0; x < mapWidth; x++) {
                for (let y = 0; y < mapHeight; y++) {
                    let pixelData = context.getImageData(x, y, 1, 1).data; // Get a pixel
                    if (pixelData[3] > 0) { // Is not transparent
                        if (layer == 't' && pixelData[1] == 255 && !mainLayer[y][x]) { // Tree, and there's no road
                            setImgOfCell(x, y, `assets/terrain/trees0${1 + rnd(4)}.png`, LayerIDs.Main);
                            mainLayer[y][x] = 't';
                        }
                        else if (layer == 'b' && pixelData[0] + pixelData[1] + pixelData[2] == 0) { // Undeletable highways
                            addNewEmptyImgToCell(x, y, LayerIDs.Main);
                            mainLayer[y][x] = new Road(x, y, 'h', false, mainLayer);
                            mainLayer[y][x].updateDirections(true);
                            mainLayer[y][x].register();
                        }
                        else if (layer == 'w') {
                            switch (pixelData[2]) {
                                case 255:
                                    waterLayer[y][x] = 4;
                                    break;
                                case 160:
                                    waterLayer[y][x] = 3;
                                    break;
                                case 111:
                                    waterLayer[y][x] = 2;
                                    break;
                                case 50:
                                    waterLayer[y][x] = 1;
                                    break;
                                case 0:
                                    waterLayer[y][x] = 0;
                                    break;
                            }
                        }
                        else if (layer == 'wind') {
                            switch (pixelData[0] + pixelData[1] + pixelData[2]) {
                                case 255*3:
                                    windLayer[y][x] = 3;
                                    break;
                                case 140*3:
                                    windLayer[y][x] = 2;
                                    break;
                                case 80*3:
                                    windLayer[y][x] = 1;
                                    break;
                                case 0:
                                    windLayer[y][x] = 0;
                                    break;
                            }
                        }
                    }
                }
            }
        }
        await img.decode();
    }
}