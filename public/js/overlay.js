let showTrafficOverlay = false;
let showWaterOverlay = false;

function toggleTrafficOL(backStrip) {
    showTrafficOverlay = !showTrafficOverlay;
    if (!showTrafficOverlay) {
        let overlayCells = document.getElementsByClassName('cellBorder');
        for (let i = 0; i < overlayCells.length; i++)
            overlayCells[i].style.backgroundColor = 'transparent';

        backStrip.style.width = '';
    }
    else
        backStrip.style.width = '100%';

    aToggleOverlay.playNext();
}

function toggleWaterOL(backStrip) {
    showWaterOverlay = !showWaterOverlay;
    let overlayCells = document.getElementsByClassName('cellBorder');
    if (!showWaterOverlay) {
        for (let x = 0; x < mapWidth; x++)
            for (let y = 0; y < mapHeight; y++)
                overlayCells[x + y * 60].style.backgroundColor = 'transparent';
        backStrip.style.width = '';
    }
    else {
        backStrip.style.width = '100%';
        for (let y = 0; y < mapWidth; y++)
            for (let x = 0; x < mapHeight; x++)
                overlayCells[x + y * 60].style.backgroundColor = `rgb(15, 15, ${15 + waterLayer[y][x] * 48})`;
    }

    aToggleOverlay.playNext();
}