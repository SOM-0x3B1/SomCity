/** Contains all the layers. */
const mainDisplay = document.getElementById("mainDisplay");

let panning = false,
    scaling = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 },
    scale = 0.7,
    startScale = 0.7,
    startPinchDistance = 0;


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


/** Mouse control */
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
    const xs = (e.clientX - pointX) / scale,
        ys = (e.clientY - pointY) / scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);

    if (delta > 0) 
        scale *= 1.2
    else
        scale /= 1.2;
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;

    for (let i = 0; i < ambients.length; i++)
        ambients[i].changeD(ambients[i].calcD());

    setTransform();
}

/** Touch control */
document.ontouchstart = (e) => {
    if (e.touches.length === 2) {
        scaling = true;
        startPinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY);
        startScale = scale;

        start = { x: pointX, y: pointY};
    }
    else if (!inMenu) {
        start = { x: e.touches[0].clientX - pointX, y: e.touches[0].clientY - pointY };
        panning = true;
    }
}
document.ontouchend = (e) => {
    panning = false;
    scaling = false;
}
document.ontouchmove = (e) => {
    if (scaling) {
        e.preventDefault();

        let pinchDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY);

        scale = startScale * pinchDistance / startPinchDistance;

        let midpointX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        let midpointY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        let xs = (midpointX - start.x) / startScale,
            ys = (midpointY - start.y) / startScale;
        pointX = midpointX - xs * scale;
        pointY = midpointY - ys * scale;

        for (let i = 0; i < ambients.length; i++)
            ambients[i].changeD(ambients[i].calcD());

        setTransform();

    } else if (panning) {
        e.preventDefault();

        pointX = (e.touches[0].clientX - start.x);
        pointY = (e.touches[0].clientY - start.y);

        setTransform();
    }
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

document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
    }
},
    { passive: false }
);