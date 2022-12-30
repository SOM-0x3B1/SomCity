const mainDisplay = document.getElementById("mainDisplay");

var scale = 1,
    panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 };


function setTransform() {
    mainDisplay.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

document.onmousedown = (e) => {
    e.preventDefault();
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    panning = true;
}

document.onmouseup = (e) => {
    panning = false;
}

document.onmousemove = (e) => {
    e.preventDefault();
    if (!panning)
        return;

    pointX = (e.clientX - start.x);
    pointY = (e.clientY - start.y);
    setTransform();
}

document.onwheel = (e) => {
    //e.preventDefault();
    var xs = (e.clientX - pointX) / scale,
        ys = (e.clientY - pointY) / scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;

    setTransform();
}


let sideAreaInterval;
let movementSpeed = 8;

let sideAreas = document.getElementsByClassName('sideAreas');
let movements = [
    () => { pointY += movementSpeed },
    () => { pointX -= movementSpeed },
    () => { pointY -= movementSpeed },
    () => { pointX += movementSpeed }
];

for (let i = 0; i < sideAreas.length; i++) {
    const sideArea = sideAreas[i];    
    sideArea.onmouseover = (() => {
        sideAreaInterval = setInterval(() => {
            movements[i]();
            setTransform();
        }, 20);
    });
    sideArea.onmouseleave = (() => {
        clearInterval(sideAreaInterval);
    });
}
