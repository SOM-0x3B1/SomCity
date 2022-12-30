function getCell(x, y){
    return document.getElementById(`mainGrid(${x};${y})`);
}

function getImg(x, y){
    return document.getElementById(`img(${x};${y})`);
}

function drawCell(x, y, src) {
    let cell = getCell(x, y);
    let image = document.createElement("img");
    image.src = src;
    image.id = `img(${x};${y})`;
    cell.appendChild(image);
}

function addImgToCell(x, y,) {
    let cell = getCell(x, y);
    let image = document.createElement("img");
    image.id = `img(${x};${y})`;
    cell.appendChild(image);
}