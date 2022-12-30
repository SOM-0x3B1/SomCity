const mainDisplay = document.getElementById("mainDisplay");

var scale = 1,
    panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 };


function setTransform() {
    mainDisplay.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

document.onmousedown = function (e) {
    e.preventDefault();
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    panning = true;
}

document.onmouseup = function (e) {
    panning = false;
}

document.onmousemove = function (e) {
    e.preventDefault();
    if (!panning)
        return;

    pointX = (e.clientX - start.x);
    pointY = (e.clientY - start.y);
    setTransform();
}

document.onwheel = function (e) {
    //e.preventDefault();
    var xs = (e.clientX - pointX) / scale,
        ys = (e.clientY - pointY) / scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;

    setTransform();
}


// Make the DIV element draggable:
/*dragElement(mainDisplay);

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


document.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (e.deltaY / 120 < 0 && zoomAmount < 200)
        zoomAmount += 5;
    else if (zoomAmount > 20)
        zoomAmount -= 5;

    mainDisplay.style.top = (mainDisplay.offsetTop - zoomAmount) + "px";
    mainDisplay.style.left = (mainDisplay.offsetLeft - zoomAmount) + "px";

    mainDisplay.style.transform = `translate3d(-50%, -50%, 0px) scale(${zoomAmount}%)`;
});*/