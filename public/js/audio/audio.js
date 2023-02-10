let masterVolume = 0;
let musicVolume = 0;
let ambientVolume = 0;
let sfxVolume = 0;


const musics = [];
const ambients = [];
let sfxs = [];

const aMenuMusic = new Audio('assets/music/SomCity2.mp3');
aMenuMusic.loop = true;
musics.push(aMenuMusic);


const aaWind = new Ambience('wind');
aaWind.load();

const aaDay = new Ambience('day');
aaDay.load();


const aClicks = new VariedSFX('menuClicks/click', 24);
aClicks.load();

const aSelectBuilding = new VariedSFX('planning/select', 3);
aSelectBuilding.load(); 

const aAllocate = new VariedSFX('planning/allocate', 4);
aAllocate.load();

const aHover = new VariedSFX('hover', 5);
aHover.load();

const aHoverButton = new VariedSFX('planning/hoverButton', 3);
aHoverButton.load();

const aToggleOverlay = new VariedSFX('toggleOverlay', 3);
aToggleOverlay.load();

const aRoadPlanning = new SemiLoopedSFX('planning/expandStart', 'planning/expanding', 'planning/expandStop');
aRoadPlanning.load();


function setMaster(value) {
    masterVolume = value / 100;
    for (let i = 0; i < musics.length; i++)
        musics[i].volume = musicVolume * masterVolume;
    for (let i = 0; i < ambients.length; i++)
        ambients[i].volume = ambientVolume * masterVolume;
    for (let i = 0; i < sfxs.length; i++)
        sfxs[i].volume = sfxVolume * masterVolume;
}


function setMusic(value) {
    musicVolume = value / 100;
    for (let i = 0; i < musics.length; i++)
        musics[i].volume = musicVolume * masterVolume;
}
function setAmbient(value) {
    ambientVolume = value / 100;
    for (let i = 0; i < ambients.length; i++)
        ambients[i].volume = ambientVolume * masterVolume;
}
function setSFX(value) {
    sfxVolume = value / 100;
    for (let i = 0; i < sfxs.length; i++)
        sfxs[i].volume = sfxVolume * masterVolume;
}

setMusic(30);
setAmbient(60);
setSFX(50);
setMaster(80);


aMenuMusic.play();