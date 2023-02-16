let people = [];
let statPopulation = document.getElementById('mainStat-population-value');
let unemployed = [];
let statUnemployed = document.getElementById('mainStat-unemployed-value');
//let lookForJob = [];
let globalSchedule = {};
let criminals = [];
let potentialCriminals = [];

class Person {
    constructor(household, id) {
        this.id = id;
        this.car = new PrivateCar(this);
        this.household = household;
        this.workplace;
        this.proneToCrime = rnd(10) == 0;
        if (this.proneToCrime)
            potentialCriminals.push(this);

        people.push(this);
        unemployed.push(this);

        statPopulation.innerText = people.length;
        statUnemployed.innerText = unemployed.length;
    }

    lookForJob() {
        if (freeWorkplaces.length > 0 && !this.workplace) {
            this.workplace = freeWorkplaces[rnd(freeWorkplaces.length - 1)];

            let nightShifter = this.workplace.hasNightShift && rnd(3) == 0;

            this.workplace.addWorker(this, nightShifter);
            unemployed.splice(unemployed.indexOf(this), 1);

            let starttime;
            let endTime
            if (!nightShifter) {
                starttime = this.workplace.opens1 + rnd(12) * 5;
                endTime = this.workplace.closes1 + rnd(12) * 5;
            }
            else {
                starttime = this.workplace.opens2 + rnd(12) * 5;
                endTime = this.workplace.closes2 + rnd(12) * 5;
            }

            Schedule.addNewEvent(this, starttime, this.workplace);
            Schedule.addNewEvent(this, endTime, this.household.homeZone);

            statUnemployed.innerText = unemployed.length;
        }
    }

    remove() {
        people.splice(people.indexOf(this), 1);
        unemployed.splice(unemployed.indexOf(this), 1);
        document.getElementById('mainStat-population-value').innerText = people.length;
        document.getElementById('mainStat-unemployed-value').innerText = people.length;
        this.household = undefined;
        this.car.remove();
    }
}

class Schedule {
    constructor(person, target) {
        this.person = person;
        this.target = target;
    }

    static addNewEvent(person, time, target) {
        if (!globalSchedule[time])
            globalSchedule[time] = [];
        globalSchedule[time].push(new Schedule(person, target));
    }
}