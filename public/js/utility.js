function rnd(num) {
    return Math.round(Math.random() * num);
}

/** Creates a string key from two numbers ('x,y') */
function coordsToKey(x, y) {
    return `${x},${y}`;
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
function guidGenerator() {    
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}



/*addEventListener('fullscreenchange', (e) => {
    let slider = document.getElementById('fullscreen');
    if (!document.fullscreenElement &&
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        slider.checked = false;
        document.getElementById('fullscreenSVG').src = "media/fullscreen-svgrepo-com.svg";
    }
    else{
        slider.checked = true;        
        document.getElementById('fullscreenSVG').src = "media/exit-fullscreen-svgrepo-com.svg";
    }
});

function toggleFullScreen() {  
    if (!document.fullscreenElement &&
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}*/