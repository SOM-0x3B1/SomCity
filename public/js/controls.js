/** Contains all the layers. */
const mainDisplay = document.getElementById("mainDisplay");

var scale = 0.7,
    panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 };


let sideAreaInterval;
let movementSpeed = 8;

let sideAreas = document.getElementsByClassName('sideAreas');
let movements = [
    () => { pointY += movementSpeed },
    () => { pointX -= movementSpeed },
    () => { pointY -= movementSpeed },
    () => { pointX += movementSpeed }
];

/** Updates the transform positions of the mainDisplay. */
function setTransform() {
    mainDisplay.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

document.onmousedown = (e) => {
    if (!placing && !bulldozing && !inMenu) {
        e.preventDefault();
        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        panning = true;
    }
}

document.onmouseup = (e) => {
    panning = false;
}

document.onmousemove = (e) => {
    if (!panning)
        return;
                
    e.preventDefault();    

    pointX = (e.clientX - start.x);
    pointY = (e.clientY - start.y);
    setTransform();
}

document.onwheel = (e) => {
    var xs = (e.clientX - pointX) / scale,
        ys = (e.clientY - pointY) / scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;

    setTransform();
}


document.onkeydown = (e) => {
    switch (e.key) {
        case 'Escape':
            stopModification();
            break;
        case 'w':
        case 'ArrowUp':
            pointY += 2 * movementSpeed;
            setTransform();
            break;
        case 'd':
        case 'ArrowRight':
            pointX -= 2 * movementSpeed;
            setTransform();
            break;
        case 's':
        case 'ArrowDown':
            pointY -= 2 * movementSpeed;
            setTransform();
            break;
        case 'a':
        case 'ArrowLeft':
            pointX += 2 * movementSpeed;
            setTransform();
            break;
        case 'b':
        case 'Delete':
            if (!bulldozing)
                startBulldoze();
            else
                stopModification();
            break;
    }
}

// Adds the camera movement events to the sideareas
for (let i = 0; i < sideAreas.length; i++) {
    const sideArea = sideAreas[i];
    sideArea.onmouseover = (() => {
        sideAreaInterval = setInterval(() => {
            if (placing || bulldozing) {
                movements[i]();
                setTransform();
            }
        }, 20);
    });
    sideArea.onmouseleave = (() => {
        clearInterval(sideAreaInterval);
    });
}