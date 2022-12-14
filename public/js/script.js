const containers = document.getElementsByClassName("gameGrid");
let mapWidth = 60;
let mapHeight = 60;

function makeRows(rows, cols) {
    for (const container of containers) {
        container.style.setProperty('--grid-rows', rows);
        container.style.setProperty('--grid-cols', cols);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < rows; x++) {
                let cell = document.createElement('div');
                //cell.innerText = (c + 1);

                /*if (!rnd(30)) {
                    let image = document.createElement("img");
                    image.src = `assets/terrain/trees0${rnd(5) + 1}.png`;
                    cell.appendChild(image);
                }*/
                cell.id = `${container.id}(${x};${y})`;
                container.appendChild(cell).className = 'grid-item';
            }
        };
    }
};

makeRows(mapWidth, mapHeight);

var buldingLayer = new Array(mapHeight);
for (let i = 0; i < mapHeight; i++)
    buldingLayer[i] = new Array(mapWidth)

var terrainLayer = new Array(mapHeight);
for (let i = 0; i < mapHeight; i++)
    terrainLayer[i] = new Array(mapWidth);



function buildNewBaseMap() {
    const layers = ['b', 't'];

    for (const layer of layers) {
        let img = new Image();
        img.src = 'assets/maps/map1-' + layer + '.png';

        img.onload = () => {
            img.width = img.width;
            img.height = img.height;

            let canvas = document.createElement('canvas');
            canvas.width = mapWidth;
            canvas.height = mapHeight;

            canvas.getContext('2d', { willReadFrequently: true }).drawImage(img, 0, 0, img.width, img.height);
            let context = canvas.getContext('2d', { willReadFrequently: true });
            context.will

            for (let x = 0; x < mapWidth; x++) {
                for (let y = 0; y < mapHeight; y++) {
                    let pixelData = context.getImageData(x, y, 1, 1).data;
                    if (pixelData[3] > 0) {
                        if (layer == 't' && pixelData[1] == 255) //tree
                            drawCell(x, y, layer, `assets/terrain/trees0${rnd(5) + 1}.png`);
                        else if (layer == 'b' && pixelData[0] + pixelData[1] + pixelData[2] == 0) //main road
                            drawCell(x, y, layer, `assets/roads/mainRoad-h.png`);
                    }
                }
            }
        }
        console.log(img.src);
    }
}

function drawCell(x, y, layer, src) {
    let cell = document.getElementById(`${layer == 't' ? 'terrainGrid' : 'buildingGrid'}(${x};${y})`);
    let image = document.createElement("img");
    image.src = src;
    cell.appendChild(image);
}

buildNewBaseMap();


function rnd(num) {
    return Math.floor(Math.random() * num);
}




const mainDisplay = document.getElementById("mainDisplay");

var scale = 1,
    panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 };


function setTransform() {
    mainDisplay.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

document.onmousedown = function (e) {
    e.preventDefault();
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    panning = true;
}

document.onmouseup = function (e) {
    panning = false;
}

document.onmousemove = function (e) {
    e.preventDefault();
    if (!panning)
        return;

    pointX = (e.clientX - start.x);
    pointY = (e.clientY - start.y);
    setTransform();
}

document.onwheel = function (e) {
    //e.preventDefault();
    var xs = (e.clientX - pointX) / scale,
        ys = (e.clientY - pointY) / scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;

    setTransform();
}


// Make the DIV element draggable:
/*dragElement(mainDisplay);

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


document.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (e.deltaY / 120 < 0 && zoomAmount < 200)
        zoomAmount += 5;
    else if (zoomAmount > 20)
        zoomAmount -= 5;

    mainDisplay.style.top = (mainDisplay.offsetTop - zoomAmount) + "px";
    mainDisplay.style.left = (mainDisplay.offsetLeft - zoomAmount) + "px";

    mainDisplay.style.transform = `translate3d(-50%, -50%, 0px) scale(${zoomAmount}%)`;
});*/