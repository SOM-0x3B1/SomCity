/** Placing a new building */
let placing = false;
let bulldozing = false;
/** The first coord of the bulldozer's areal selection */
let bulldozingFirstPos;

/** Wether the first position of a new road has been set */
let firstOfTwoPoints = false;
/** The new building that's being placed right now */
let placedBuilding;
let currentCategory;
let currentBackStrip;
const currentSecondaryBackstrip = document.getElementById('BS-z-commercial-5');
let currentSubType = 5;

/** The current cells that temporary contain new buildings on the plan layer */
let previewCells = [];


/** Cancels any active map modification. */
function stopModification() {
    if (placing)
        stopBuilding();
    if (bulldozing)
        stopBulldoze();
}

/** Starts a new building placement. */
function startBuilding(selectedBuilding, subType) {
    if (bulldozing)
        stopBulldoze();

    aSelectBuilding.playRandom();

    placing = true;
    document.getElementById('cancel').style.opacity = 1;

    const id = selectedBuilding.split('-');
    const category = id[0]; // eg. 'z', 'r'
    const name = id[1]; // eg. 'residential', 'highway'

    if (currentCategory && currentCategory.id != category)
        currentCategory.style.display = '';
    if (!currentCategory || currentCategory.id != category) {
        currentCategory = document.getElementById(category);
        currentCategory.style.display = 'inline-block';
    }

    const newBackStripID = 'BS-' + selectedBuilding;
    if (currentBackStrip && currentBackStrip.id != newBackStripID)
        currentBackStrip.style.width = '';
    if (!currentBackStrip || currentBackStrip.id != newBackStripID) {
        currentBackStrip = document.getElementById(newBackStripID);
        currentBackStrip.style.width = '100%';
    }

    if (subType != undefined) {
        const newSecBackStripID = 'BS-' + selectedBuilding + '-' + subType;
        if (currentSecondaryBackstrip && currentSecondaryBackstrip.id != newSecBackStripID)
            currentSecondaryBackstrip.style.width = '';
        if (!currentSecondaryBackstrip || currentSecondaryBackstrip.id != newSecBackStripID) {
            currentSecondaryBackstrip = document.getElementById(newSecBackStripID);
            currentSecondaryBackstrip.style.width = '100%';
        }
        currentSubType = subType;
    }

    switch (category) {
        case 'r':
            firstOfTwoPoints = true;
            switch (name) {
                case 'highway':
                    placedBuilding = new Road(null, null, 'h', true, planLayer);
                    break;
                case 'mainRoad':
                    placedBuilding = new Road(null, null, 'm', true, planLayer);
                    break;
                case 'street':
                    placedBuilding = new Road(null, null, 's', true, planLayer);
                    break;
            }
            break;
        case 'z':
            switch (name) {
                case 'residential':
                    placedBuilding = new RZone(null, null, planLayer);
                    break;
                case 'commercial':
                    if (!subType)
                        subType = currentSubType;
                    placedBuilding = new CZone(null, null, subType, planLayer);
                    break;
                case 'industrial':
                    placedBuilding = new IZone(null, null, planLayer);
                    break;
            }
            break;
        case 'u':
            switch (name) {
                case 'powerPlant':
                    placedBuilding = new PowerPlant(null, null, planLayer);
                    break;
                case 'windTurbine':
                    placedBuilding = new WindTurbine(null, null, planLayer);
                    showWindOL(document.getElementById('BS-ol-wind'));
                    break;
                case 'waterTower':
                    placedBuilding = new WaterTower(null, null, planLayer);
                    showWaterOL(document.getElementById('BS-ol-water'));
                    break;
            }
            break;
        case 's':
            switch (name) {
                case 'police':
                    placedBuilding = new PoliceStation(null, null, planLayer);
                    break;
            }
            break;
    }
}

/** Cancels the new building placement. */
function stopBuilding() {
    aRoadPlanning.stop();

    placing = false;
    firstOfTwoPoints = false;
    placedBuilding = null;

    document.getElementById('cancel').style = '';

    if (currentCategory)
        currentCategory.style.display = '';
    currentCategory = null;

    if (currentBackStrip)
        currentBackStrip.style.width = '';
    currentBackStrip = null;

    if (showWaterOverlay)
        hideWaterOL(document.getElementById('BS-ol-water'));
    if (showWindOverlay)
        hideWindOL(document.getElementById('BS-ol-wind'));

    clearPlanned();
}

/** Starts the bulldozer. */
function startBulldoze() {
    if (placing)
        stopBuilding();
    bulldozing = true;
    document.getElementById('cancel').style.opacity = 1;
    document.getElementById('bulldoze').style.filter = 'invert(1)';

    clearPlanned();
}

/** Cancels the bulldozer. */
function stopBulldoze() {
    bulldozing = false;
    bulldozingFirstPos = undefined;
    document.getElementById('cancel').style = '';
    document.getElementById('bulldoze').style = '';
    clearPlanned();
}

/** Clears the plan layer. */
function clearPlanned() {
    for (const coord of previewCells) {
        planLayer[coord.y][coord.x] = null;
        ereaseCell(coord.x, coord.y, LayerIDs.plan);
    }
}

/**
 * Is the position obstructed?
 * @returns true: the cell is not vacant. - false: the cell is vacant.
 */
function isOccupied(x, y) {
    if (!mainLayer[y] || x > mainLayer[y].length - 1 || (mainLayer[y][x] && mainLayer[y][x] != 't'))
        return true;
    else
        return false;
}


/** If the cell is deletable, draws the red overlay on top of them. */
function drawBulldoze(x, y) {
    const target = mainLayer[y][x];
    if (!bulldozingFirstPos)
        clearPlanned();

    previewCells.push(new COORD(x, y));
    if (target) {
        if (target instanceof Building && target.deletable) {
            setImgOfCell(target.x, target.y, `assets/red.png`, LayerIDs.plan);
            resizeImg(target.x, target.y, target.width, target.height, LayerIDs.plan);
        }
        else if (target == 't')
            setImgOfCell(x, y, `assets/red.png`, LayerIDs.plan);
    }
}