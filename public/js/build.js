let placing = false;
let firstOfTwoPoints = false;
let buildingUnderBuilding;
let currentCategory;
let currentBackStrip;

let previewCells = [];

function startBuilding(selectedBuilding) {
    placing = true;
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

    if (category === 'r') {
        firstOfTwoPoints = true;

        switch (name) {
            case 'highway':
                buildingUnderBuilding = new Road(null, null, 'h', 40, true);
                break;
            case 'mainRoad':
                buildingUnderBuilding = new Road(null, null, 'm', 20, true);
                break;
            case 'street':
                buildingUnderBuilding = new Road(null, null, 's', 10, true);
                break;
        }
    }
}

function stopBuilding(){
    if (placing) {
        placing = false;
        firstOfTwoPoints = false;
        buildingUnderBuilding = null;

        if (currentCategory)
            currentCategory.style.display = '';
        currentCategory = null;

        if (currentBackStrip)
            currentBackStrip.style.width = '';
        currentBackStrip = null;

        deletePlanned();
    }
}


function deletePlanned(){
    for (const coord of previewCells) {
        planningLayer[coord.y][coord.x] = null;
        ereaseCell(coord.x, coord.y, 'planningGrid');
    }
}

function isOccupied(x, y){
    if(!mainLayer[y][x] || mainLayer[y][x] == 't')
        return false;
    else
        return true;
}