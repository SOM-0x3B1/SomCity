const container = document.getElementById("buildingGrid");

function makeRows(rows, cols) {
    container.style.setProperty('--grid-rows', rows);
    container.style.setProperty('--grid-cols', cols);
    for (c = 0; c < (rows * cols); c++) {
        let cell = document.createElement("div");
        //cell.innerText = (c + 1);
        

        if(!Math.floor(Math.random()*30)){
            let image = document.createElement("img");
            image.src = 'assets/terrain/trees.png';
            cell.appendChild(image);
        }
        
        container.appendChild(cell).className = "grid-item";        
    };
};

makeRows(50, 50);