let time = 900;
let timeVaule = document.getElementById('mainStat-time-value');
let night = false;

let body = document.getElementById('body');
let game = document.getElementById('game');

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

    if (time == 420) {
        if(night){
            aaDay.fadeIn();
            aaNight.fadeOut();
            body.style.backgroundColor = 'rgb(15, 15, 15)';
            game.style.backgroundColor = 'rgb(15, 15, 15)';
        }
        night = false;
    }
    else if (time == 1020) {
        if(!night){
            aaDay.fadeOut();
            aaNight.fadeIn();
            body.style.backgroundColor = 'rgb(8, 8, 8)';
            game.style.backgroundColor = 'rgb(8, 8, 8)';
        }
        night = true;
    }

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
        iAllStorage += iZones[i].production;
        if (iZones[i].storage > iZones[i].storageCapacity) {
            iAllStorage -= iZones[i].storage - iZones[i].storageCapacity;
            iZones[i].storage = iZones[i].storageCapacity;
        }
    }

    let cZoneQueue = new PriorityQueue();
    //shuffle(cZones);
    for (let i = 0; i < cZones.length; i++)
        cZoneQueue.enqueue(cZones[i], cZones[i].storage);
    while (cZoneQueue.values.length > 0)
        cZoneQueue.dequeue().val.requestProducts();
}, 500);

let tickShops = setInterval(() => {
    for (let i = 0; i < cZones.length; i++)
        cZones[i].serveCustomers();
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
}, 500);


let tickBars = setInterval(() => {
    if (people.length > 0) {
        let rbar = document.getElementById('mainStat-demands-bar-r');
        let rvalue
        if (countOfAllJobs > 0)
            rvalue = (countOfFreeJobs / countOfAllJobs) * 100 - (unemployed.length / people.length) * 100;
        else
            rvalue = -100;

        if (rvalue >= 0) {
            if (rvalue > 100)
                rvalue = 100;
            rbar.style.top = '';
            rbar.style.bottom = 'calc(50% - 2pt)';
        }
        else {
            if (rvalue < -100)
                rvalue = -100;
            rbar.style.bottom = '';
            rbar.style.top = 'calc(50% + 2pt)';
        }
        rbar.style.height = Math.abs(rvalue / 2) + '%';


        for (let i = 0; i < productDemands.length; i++) {
            let cbar = document.getElementById('mainStat-demands-bar-c' + (i + 1));
            let cvalue = (productDemands[i] / people.length / 3 * 100);
            if (cvalue > 50)
                cvalue = 50;
            cbar.style.height = cvalue + '%';
        }


        let ibar = document.getElementById('mainStat-demands-bar-i');
        let ivalue;
        if (countOfAllJobs > 0) {
            if (iAllOptimalStorage > 0)
                ivalue = (1 - cAllStorage / cAllOptimalStorage) * 100 - (iAllStorage / iAllOptimalStorage) * 50;
            else
                ivalue = (1 - cAllStorage / cAllOptimalStorage) * 100;
        }
        else
            ivalue = -100;

        if (ivalue >= 0) {
            if (ivalue > 100)
                ivalue = 100;
            ibar.style.top = '';
            ibar.style.bottom = 'calc(50% - 2pt)';
        }
        else {
            if (ivalue < -100)
                ivalue = -100;
            ibar.style.bottom = '';
            ibar.style.top = 'calc(50% + 2pt)';
        }
        ibar.style.height = Math.abs(ivalue / 2) + '%';
    }
}, 500);
