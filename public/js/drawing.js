class COORD {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Gets the cell of a given layer accoring to the coordinates.
 * @param {*} layerID - The string id of the layer.
 */
function getCell(x, y, layerID) {
    return document.getElementById(`${layerID}(${x};${y})`);
}

/**
 * Gets the img of a given layer accoring to the coordinates.
 * @param {*} layerID - The string id of the layer.
 */
function getImg(x, y, layerID) {
    return document.getElementById(`${layerID}-img(${x};${y})`);
}

/**
 * Sets the source of an existing image, or creates new one with the src.
 * @param {*} layerID - The string id of the layer.
 */
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

/**
 * Adds a new image to a cell (won't set its source).
 * @param {*} layerID - The string id of the layer.
 */
function addNewEmptyImgToCell(x, y, layerID) {
    let cell = getCell(x, y, layerID);
    if (cell.getElementsByTagName('img').length === 0) {
        let image = document.createElement("img");
        image.id = `${layerID}-img(${x};${y})`;
        cell.appendChild(image);
    }
}

/**
 * Deletes the images of a cell.
 * @param {*} layerID - The string id of the layer.
 */
function ereaseCell(x, y, layerID) {
    let cell = getCell(x, y, layerID);
    let images = cell.getElementsByTagName('img');
    for (const image of images) 
        image.remove();
}

/**
 * Resizes the image of a cell.
 * @param {*} layerID - The string id of the layer.
 */
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