const containers = document.getElementsByClassName("gameGrid");
let mapWidth = 80;
let mapHeight = 80;

var gameLayer = new Array(mapHeight);
for (let i = 0; i < mapHeight; i++)
    gameLayer[i] = new Array(mapWidth)

function rnd(num) {
    return Math.floor(Math.random() * num);
}