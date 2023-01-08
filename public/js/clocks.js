let tickCars = setInterval(()=>{
    people.forEach(i => {
        i.car.move();
    });
}, 100);