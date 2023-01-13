let tickCars = setInterval(() => {
    for (const car in movingCars)
        movingCars[car].initiateMove();
    for (const key in roads)
        roads[key].moveCars();

    if(objectOfCellInfo)
        objectOfCellInfo.fillCellInfo();
}, 100);

let lookForJob = setInterval(() => {
    shuffle(unemployed);
    for (let i = 0; i < unemployed.length; i++)
        unemployed[i].lookForJob();
}, 5000);