class COORD{
    constructor(x, y){
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

function drawCell(x, y, src, layer) {
    let cell = getCell(x, y, layer);
    let image = document.createElement("img");
    image.src = src;
    image.id = `${layer}-img(${x};${y})`;
    cell.appendChild(image);
}

function ereaseCell(x, y, layer){
    let cell = getCell(x, y, layer);
    cell.innerHTML = '';
}

function addImgToCell(x, y, layer) {
    let cell = getCell(x, y, layer);
    if (cell.getElementsByTagName('img').length === 0) {
        let image = document.createElement("img");
        image.id = `${layer}-img(${x};${y})`;
        cell.appendChild(image);        
    }    
}

