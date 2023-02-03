let inMenu = true;

function assignSounds() {
    let menuOptions = document.getElementsByClassName('menuOption');

    for (let i = 0; i < menuOptions.length; i++) {
        menuOptions[i].onclick = () => { aClicks.playNext(); };
    }
}
assignSounds();


function startNew() {
    inMenu = false;
    showGame();
}

async function showGame() {
    document.getElementById('game').style.display = 'inline-block';
    await sleep(1);
    buildNewBaseMap();
    document.getElementById('game').style.opacity = '1';

    await sleep(2000);

    document.getElementById('titleScreen').style.display = 'none';
}

function showSettings() {
    document.getElementById('settingsWindow').style.display = 'flex';
}