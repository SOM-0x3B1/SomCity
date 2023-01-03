let placing = false;
let bulldozing = false;
let firstOfTwoPoints = false;
let buildingUnderBuilding;
let currentCategory;
let currentBackStrip;

let previewCells = [];

function startBuilding(selectedBuilding) {
    if (bulldozing)
        stopBulldoze();

    placing = true;
    document.getElementById('cancel').style.opacity = 1;

    let id = selectedBuilding.split('-');
    let category = id[0];
    let name = id[1];

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
                    buildingUnderBuilding = new Road(null, null, 'h', 40, true, planningLayer);
                    break;
                case 'mainRoad':
                    buildingUnderBuilding = new Road(null, null, 'm', 20, true, planningLayer);
                    break;
                case 'street':
                    buildingUnderBuilding = new Road(null, null, 's', 10, true, planningLayer);
                    break;
            }
            break;
        case 'z':
            switch (name) {
                case 'residential':
                    buildingUnderBuilding = new RZone(null, null, planningLayer);
                    break;
            }
            break;
    }
}

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

        deletePlanned();
}

function stopModification() {
    if (placing) 
        stopBuilding();
    if (bulldozing) 
        stopBulldoze();    
}

function startBulldoze() {
    if(placing)
        stopBuilding();
    bulldozing = true;
    document.getElementById('cancel').style.opacity = 1;
    document.getElementById('bulldoze').style.filter = 'invert(1)';
    deletePlanned();
}

function stopBulldoze() {
    bulldozing = false;
    document.getElementById('cancel').style = '';
    document.getElementById('bulldoze').style = 'invert(0)';
    deletePlanned();
}

function deletePlanned() {
    for (const coord of previewCells) {
        planningLayer[coord.y][coord.x] = null;
        ereaseCell(coord.x, coord.y, LayerIDs.Planning);
    }
}

function isOccupied(x, y) {
    if (!mainLayer[y][x] || mainLayer[y][x] == 't')
        return false;
    else
        return true;
}


function drawBulldoze(x, y) {
    let target = mainLayer[y][x];
    deletePlanned();

    previewCells.push(new COORD(x, y));
    if (target) {
        if (target instanceof Building) {
            setImgOfCell(target.x, target.y, `assets/red.png`, LayerIDs.Planning);
            resizeImg(target.x, target.y, target.width, target.height, LayerIDs.Planning);
        }
        else if (target == 't')
            setImgOfCell(x, y, `assets/red.png`, LayerIDs.Planning);
    }
}