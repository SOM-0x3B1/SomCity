function rnd(num) {
    return Math.floor(Math.random() * num);
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