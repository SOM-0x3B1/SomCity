class COORD {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function getCell(x, y, layer) {
    return document.getElementById(`${layer}(${x};${y})`);
}

function getImg(x, y, layer) {
    return document.getElementById(`${layer}-img(${x};${y})`);
}

function setImgOfCell(x, y, src, layer) {
    if (!getImg(x, y, layer)) {
        let cell = getCell(x, y, layer);
        let image = document.createElement("img");
        image.src = src;
        image.id = `${layer}-img(${x};${y})`;
        cell.appendChild(image);
    }
    else{
        addNewEmptyImgToCell(x, y, layer);
        getImg(x, y, layer).src = src;
    }
}

function addNewEmptyImgToCell(x, y, layer) {
    let cell = getCell(x, y, layer);
    if (cell.getElementsByTagName('img').length === 0) {
        let image = document.createElement("img");
        image.id = `${layer}-img(${x};${y})`;
        cell.appendChild(image);
    }
}

function ereaseCell(x, y, layer) {
    let cell = getCell(x, y, layer);
    cell.innerHTML = '';
}