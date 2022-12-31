const containers = document.getElementsByClassName("gameGrid");
let mapWidth = 60;
let mapHeight = 60;

let gameLayer = new Array(mapHeight);
for (let i = 0; i < mapHeight; i++)
    gameLayer[i] = new Array(mapWidth)


let entryPoints = []; // outsiders spawn here


function rnd(num) {
    return Math.floor(Math.random() * num);
}