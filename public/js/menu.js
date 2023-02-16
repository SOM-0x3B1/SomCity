let inMenu = true;
let inGame = false;

function assignSounds() {
    /*let menuOptions = document.getElementsByClassName('menuOption');
    for (let i = 0; i < menuOptions.length; i++) {
        menuOptions[i].onclick = () => { aClicks.playNext(); };
    }*/

    let backStrips = document.getElementsByClassName('backStrip');
    for (let i = 0; i < backStrips.length; i++)
        backStrips[i].parentElement.onmouseover = () => { aHover.playRandom(); };

    let buildCategories = document.getElementsByClassName('buildCategory');
    for (let i = 0; i < buildCategories.length; i++)
        buildCategories[i].getElementsByTagName('img')[0].onmouseover = () => { aHoverButton.playRandom(); };
}
assignSounds();

function connect(){
    document.getElementById('titleScreen').style.display = 'inline-block';
    document.getElementById('connectScreen').style.display = 'none';
    aClicks.playNext();
    aMenuMusic.play();
}

function startNew() {
    aClicks.playNext();
    aaWind.fadeIn(0.01);
    aaDay.fadeIn(0.01);

    loadClocks();

    inMenu = false;
    showGame();
}
async function showGame() {
    inGame = true;
    document.getElementById('game').style.display = 'inline-block';
    await sleep(1);
    buildNewBaseMap();
    document.getElementById('game').style.opacity = '1';

    await sleep(2000);

    document.getElementById('titleScreen').style.display = 'none';
}

function showSettings() {
    aClicks.playNext();

    inMenu = true;
    document.getElementById('settingsWindow').style.display = 'flex';
}
function closeSettings() {
    aClicks.playNext();

    if (inGame)
        inMenu = false;
    document.getElementById('settingsWindow').style.display = 'none';
}