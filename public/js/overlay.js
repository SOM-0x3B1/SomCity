let showTrafficOverlay = false;

function toggleTrafficOL(){
    showTrafficOverlay = !showTrafficOverlay;
    if(!showTrafficOverlay)
    {
        let overlayCells = document.getElementsByClassName('cellBorder');
        for (let i = 0; i < overlayCells.length; i++)
            overlayCells[i].style.backgroundColor = 'transparent';
    }
}