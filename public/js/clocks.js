let time = 0;
let timeVaule = document.getElementById('mainStat-time-value');

let mainTick = setInterval(() => {
    time++;
    if (time > 1439)
        time = 0;
    let hours = Math.floor(time / 60);
    timeVaule.innerText = hours;
    let minutes = time - hours * 60;

    if (minutes.toString().length < 2)
        timeVaule.innerText += ':0';
    else
        timeVaule.innerText += ':';
    timeVaule.innerText += minutes % 60;


    let cSchedules = globalSchedule[time];
    if (cSchedules) {
        for (let i = 0; i < cSchedules.length; i++) {
            let car = cSchedules[i].person.car;
            if (!car.waiting)
                car.calcRoute(cSchedules[i].target);
            else
                car.changeRouteNextTimeToTarget = cSchedules[i].target;
        }
    }
}, 50);

let tickIndustry = setInterval(() => {
    shuffle(iZones);
    for (let i = 0; i < iZones.length; i++) {
        iZones[i].storage += iZones[i].production;
        if (iZones[i].storage > iZones[i].storageCapacity)
            iZones[i].storage = iZones[i].storageCapacity
    }

    shuffle(cZones);
    for (let i = 0; i < cZones.length; i++)
        cZones[i].requestProducts();

}, 500);

let tickShops = setInterval(() => {
    for (let i = 0; i < cZones.length; i++)
        cZones[i].serveCustomers();

    if (people.length > 0) {
        for (let i = 0; i < productDemands.length; i++) {
            let bar = document.getElementById('mainStat-demands-bar-c' + (i + 1));
            let value = (productDemands[i] / people.length * 100);
            if(value > 50)
                value = 50;
            bar.style.height = value + '%';
        }
    }
}, 200);

let tickRoads = setInterval(() => {
    for (const car in movingCars)
        movingCars[car].initiateMove();
    for (const key in roads)
        roads[key].moveCars();
    if (objectOfCellInfo)
        objectOfCellInfo.fillCellInfo();
}, 50);


let tickJobs = setInterval(() => {
    shuffle(unemployed);
    for (let i = 0; i < unemployed.length; i++)
        unemployed[i].lookForJob();
}, 5000);

let tickOverlays = setInterval(() => {
    if (showTrafficOverlay) {
        for (const key in roads)
            roads[key].drawOverlay();
    }
}, 500);

let tickNeeds = setInterval(() => {
    for (let i = 0; i < households.length; i++)
        households[i].addNeeds();
}, 3000);