class COORD {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function getCell(x, y, layerID) {
    return document.getElementById(`${layerID}(${x};${y})`);
}

function getImg(x, y, layerID) {
    return document.getElementById(`${layerID}-img(${x};${y})`);
}

function setImgOfCell(x, y, src, layerID) {
    if (!getImg(x, y, layerID)) {
        let cell = getCell(x, y, layerID);
        let image = document.createElement("img");
        image.src = src;
        image.id = `${layerID}-img(${x};${y})`;
        cell.appendChild(image);
    }
    else{
        addNewEmptyImgToCell(x, y, layerID);
        getImg(x, y, layerID).src = src;
    }
}

function addNewEmptyImgToCell(x, y, layerID) {
    let cell = getCell(x, y, layerID);
    if (cell.getElementsByTagName('img').length === 0) {
        let image = document.createElement("img");
        image.id = `${layerID}-img(${x};${y})`;
        cell.appendChild(image);
    }
}

function ereaseCell(x, y, layerID) {
    let cell = getCell(x, y, layerID);
    let images = cell.getElementsByTagName('img');
    for (const image of images) 
        image.remove();
}

function resizeImg(x, y, width, height, layerID){
    let img = getImg(x, y, layerID);
    if(layerID == LayerIDs.Main){
        img.style.width = `calc(${width} * 100% + ${width} * var(--grid-gap))`;
        img.style.height = `calc(${height} * 100% + ${height} * var(--grid-gap))`;  
    }
    else{
        img.style.width = `calc(${width} * 100%)`;
        img.style.height = `calc(${height} * 100%)`;  
    }
}