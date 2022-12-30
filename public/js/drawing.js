function drawCell(x, y, src) {
    let cell = document.getElementById(`mainGrid(${x};${y})`);
    let image = document.createElement("img");
    image.src = src;
    cell.appendChild(image);
}