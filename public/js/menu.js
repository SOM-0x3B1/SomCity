function assignSounds() {
    let menuOptions = document.getElementsByClassName('mainMenuOption');

    for (let i = 0; i < menuOptions.length; i++) {
        console.log(menuOptions[i]);
        menuOptions[i].onclick = () => { aClicks.playNext(); };
    }
}
assignSounds();


function startNew() {
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