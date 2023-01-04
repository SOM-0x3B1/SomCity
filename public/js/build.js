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
function startBuilding(selectedBuilding) {
    if (bulldozing)
        stopBulldoze();

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

    if (currentBackStrip && currentBackStrip.id != 'BS-' + selectedBuilding)
        currentBackStrip.style.width = '';
    if (!currentBackStrip || currentBackStrip.id != 'BS-' + selectedBuilding) {
        currentBackStrip = document.getElementById('BS-' + selectedBuilding);
        currentBackStrip.style.width = '100%';
    }

    switch (category) {
        case 'r':
            firstOfTwoPoints = true;
            switch (name) {
                case 'highway':
                    buildingUnderBuilding = new Road(null, null, 'h', 40, true, planLayer);
                    break;
                case 'mainRoad':
                    buildingUnderBuilding = new Road(null, null, 'm', 20, true, planLayer);
                    break;
                case 'street':
                    buildingUnderBuilding = new Road(null, null, 's', 10, true, planLayer);
                    break;
            }
            break;
        case 'z':
            switch (name) {
                case 'residential':
                    buildingUnderBuilding = new RZone(null, null, planLayer);
                    break;
            }
            break;
    }
}

/** Cancels the new building placement. */
function stopBuilding(){
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

        clearPlanned();
}

/** Starts the bulldozer. */
function startBulldoze() {
    if(placing)
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
    if (!mainLayer[y][x] || mainLayer[y][x] == 't')
        return false;
    else
        return true;
}


/** If the cell is deletable, draws the red overlay on top of them. */
function drawBulldoze(x, y) {
    let target = mainLayer[y][x];
    if(!bulldozingFirstPos)
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