
function buildGrid(rows, cols) {
    for (const container of containers) {
        container.style.setProperty('--grid-rows', rows);
        container.style.setProperty('--grid-cols', cols);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < rows; x++) {
                let cell = document.createElement('div');
                cell.id = `${container.id}(${x};${y})`;
                cell.appendChild(document.createElement('div')).className = 'cellBorder';

                cell.onclick = () => {
                    if (placing) {
                        if (buildingUnderBuilding instanceof Road) {
                            if (firstOfTwoPoints){
                                Road.setRoadStart(x, y);
                                firstOfTwoPoints = false;
                            }
                            else
                                Road.setRoadEnd(x, y);
                        }
                    }
                }

                container.appendChild(cell).className = 'grid-item';
            }
        };
    }
};

buildGrid(mapWidth, mapHeight);


function buildNewBaseMap() {
    const maps = ['b', 't']; // b as buildings, t as roads
    let canvas = document.createElement('canvas');
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    let context = canvas.getContext('2d', { willReadFrequently: true });

    for (const layer of maps) {
        let img = new Image();
        img.src = 'assets/maps/map1-' + layer + '.png';

        img.onload = () => {
            context.drawImage(img, 0, 0, img.width, img.height);

            for (let x = 0; x < mapWidth; x++) {
                for (let y = 0; y < mapHeight; y++) {
                    let pixelData = context.getImageData(x, y, 1, 1).data; // get a pixel
                    if (pixelData[3] > 0) { // is not transparent
                        if (layer == 't' && pixelData[1] == 255 && !gameLayer[y][x]) { //tree, and there's no road
                            drawCell(x, y, `assets/terrain/trees0${rnd(5) + 1}.png`);
                            gameLayer[y][x] = 't';
                        }
                        else if (layer == 'b' && pixelData[0] + pixelData[1] + pixelData[2] == 0) { //undeletable highways
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