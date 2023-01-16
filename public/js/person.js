let people = [];
let targetedPeople = [];
let unemployed = [];
//let lookForJob = [];
let globalSchedule = {};

class Person {
    constructor(household) {
        this.id = guidGenerator();
        this.car = new Car();
        this.household = household;
        this.job;
        people.push(this);
        unemployed.push(this);

        document.getElementById('mainStat-population-value').innerText = people.length;
    }

    lookForJob() {
        if (freeWorkplaces.length > 0) {
            let workplace = freeWorkplaces[rnd(freeWorkplaces.length - 1)];

            let nightShifter = workplace.hasNightShift && rnd(4) == 0;

            workplace.addWorker(this, nightShifter);
            unemployed.splice(unemployed.indexOf(this), 1);

            let starttime;
            let endTime
            if (!nightShifter) {
                starttime = workplace.opens1 + rnd(12) * 5;                
                endTime = workplace.closes1 + rnd(12) * 5;    
            }
            else{
                starttime = workplace.opens2 + rnd(12) * 5;
                endTime = workplace.closes2 + rnd(12) * 5;
            }

            Schedule.addNewEvent(this, starttime, workplace);
            Schedule.addNewEvent(this, endTime, this.household.homeZone);
        }
    }

    remove() {
        people.splice(people.indexOf(this), 1);
        document.getElementById('mainStat-population-value').innerText = people.length;
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