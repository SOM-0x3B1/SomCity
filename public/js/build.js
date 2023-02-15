/** Placing a new building */
let placing = false;
let bulldozing = false;
/** The first coord of the bulldozer's areal selection */
let bulldozingFirstPos;

/** Wether the first position of a new road has been set */
let firstOfTwoPoints = false;
/** The new building that's being placed right now */
let buildingUnderBuilding;
let currentCategory;
let currentBackStrip;
let currentSecondaryBackstrip = document.getElementById('BS-z-commercial-5');
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

    let id = selectedBuilding.split('-');
    let category = id[0]; // eg. 'z', 'r'
    let name = id[1]; // eg. 'residential', 'highway'

    if (currentCategory && currentCategory.id != category)
        currentCategory.style.display = '';
    if (!currentCategory || currentCategory.id != category) {
        currentCategory = document.getElementById(category);
        currentCategory.style.display = 'inline-block';
    }

    let newBackStripID = 'BS-' + selectedBuilding;
    if (currentBackStrip && currentBackStrip.id != newBackStripID)
        currentBackStrip.style.width = '';
    if (!currentBackStrip || currentBackStrip.id != newBackStripID) {
        currentBackStrip = document.getElementById(newBackStripID);
        currentBackStrip.style.width = '100%';
    }

    if (subType != undefined) {
        let newSecBackStripID = 'BS-' + selectedBuilding + '-' + subType;
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
                    buildingUnderBuilding = new Road(null, null, 'h', true, planLayer);
                    break;
                case 'mainRoad':
                    buildingUnderBuilding = new Road(null, null, 'm', true, planLayer);
                    break;
                case 'street':
                    buildingUnderBuilding = new Road(null, null, 's', true, planLayer);
                    break;
            }
            break;
        case 'z':
            switch (name) {
                case 'residential':
                    buildingUnderBuilding = new RZone(null, null, planLayer);
                    break;
                case 'commercial':
                    if (!subType)
                        subType = currentSubType;
                    buildingUnderBuilding = new CZone(null, null, subType, planLayer);
                    break;
                case 'industrial':
                    buildingUnderBuilding = new IZone(null, null, planLayer);
                    break;
            }
            break;
        case 'u':
            switch(name){
                case 'waterTower':
                    buildingUnderBuilding = new WaterTower(null, null, planLayer);
                    showWaterOL(document.getElementById('BS-ol-water'));
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
    buildingUnderBuilding = null;

    document.getElementById('cancel').style = '';

    if (currentCategory)
        currentCategory.style.display = '';
    currentCategory = null;

    if (currentBackStrip)
        currentBackStrip.style.width = '';
    currentBackStrip = null;

    if(showWaterOverlay)
        hideWaterOL(document.getElementById('BS-ol-water'));

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
    let target = mainLayer[y][x];
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