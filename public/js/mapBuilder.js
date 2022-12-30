
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


/*var terrainLayer = new Array(mapHeight);
for (let i = 0; i < mapHeight; i++)
    terrainLayer[i] = new Array(mapWidth);*/


function buildNewBaseMap() {
    const layers = ['b', 't'];
    let canvas = document.createElement('canvas');
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    let context = canvas.getContext('2d', { willReadFrequently: true });

    for (const layer of layers) {
        let img = new Image();
        img.src = 'assets/maps/map1-' + layer + '.png';

        img.onload = () => {
            context.drawImage(img, 0, 0, img.width, img.height);

            for (let x = 0; x < mapWidth; x++) {
                for (let y = 0; y < mapHeight; y++) {
                    let pixelData = context.getImageData(x, y, 1, 1).data;
                    if (pixelData[3] > 0) {
                        if (layer == 't' && pixelData[1] == 255 && !gameLayer[y][x]) { //tree, and there's no road
                            drawCell(x, y, `assets/terrain/trees0${rnd(5) + 1}.png`);
                            gameLayer[y][x] = 't';
                        }
                        else if (layer == 'b' && pixelData[0] + pixelData[1] + pixelData[2] == 0) { //main road
                            addImgToCell(x, y);
                            gameLayer[y][x] = new Road(x, y, 'h', 40, false);
                            gameLayer[y][x].updateDirections(true);
                        }
                    }
                }
            }
        }
    }
}

buildNewBaseMap();