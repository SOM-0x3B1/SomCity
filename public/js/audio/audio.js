let masterVolume = 0;
let musicVolume = 0;
let ambientVolume = 0;
let sfxVolume = 0;


const musics = [];
const ambients = [];
let sfxs = [];

const aMenuMusic = new Audio('assets/music/SomCity3.mp3');
aMenuMusic.loop = true;
musics.push(aMenuMusic);


const aaWind = new Ambience('wind', () => { return 1 - scale / 6; });
aaWind.load();
const aaDay = new Ambience('day', () => { return scale / 2 - 0.3; });
aaDay.load();
const aaNight = new Ambience('night', () => { return scale / 2 - 0.3; });
aaNight.load();
const aaTraffic = new Ambience('traffic', () => { return scale / 1.5 - 0.2; });
aaTraffic.load();


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
const aBulldoze = new VariedSFX('bulldoze', 3);
aBulldoze.load();
const aCellinfo = new VariedSFX('cellinfo', 3);
aCellinfo.load();
const aWater = new VariedSFX('water', 1);
aWater.load();
const aPower = new VariedSFX('power', 1);
aPower.load();


const aRoadPlanning = new SemiLoopedSFX('planning/expandStart', 'planning/expanding', 'planning/expandStop');
aRoadPlanning.load();


function setMaster(value) {
    masterVolume = value / 100;
    for (let i = 0; i < musics.length; i++)
        musics[i].volume = musicVolume * masterVolume;
    for (let i = 0; i < ambients.length; i++)
        ambients[i].a.volume = ambientVolume * masterVolume * ambients[i].dModifier;
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
        ambients[i].a.volume = ambientVolume * masterVolume * ambients[i].dModifier;
}
function setSFX(value) {
    sfxVolume = value / 100;
    for (let i = 0; i < sfxs.length; i++)
        sfxs[i].volume = sfxVolume * masterVolume;
}

setMaster(80);
setMusic(30);
setAmbient(50);
setSFX(60);


aMenuMusic.play();