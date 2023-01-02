const containers = document.getElementsByClassName("gameGrid");
let mapWidth = 60;
let mapHeight = 60;

let mainLayer = new Array(mapHeight);
for (let i = 0; i < mapHeight; i++)
    mainLayer[i] = new Array(mapWidth)

let planningLayer = new Array(mapHeight);
for (let i = 0; i < mapHeight; i++)
    planningLayer[i] = new Array(mapWidth)


let entryPoints = []; // outsiders spawn here


function rnd(num) {
    return Math.floor(Math.random() * num);
}