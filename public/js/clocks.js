let tickCars = setInterval(() => {
    for (const car in movingCars)
        movingCars[car].move();
    for (const key in roads)
        roads[key].moveCars();
}, 100);