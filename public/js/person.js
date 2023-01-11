let people = [];
let targetedPeople = [];
//let lookForJob = [];

class Person {
    constructor() {        
        this.car = new Car();
        this.household;
        this.job;
        people.push(this);

        document.getElementById('mainStat-population-value').innerText = people.length;
    }

    lookForJob(){
        if(freeWorkplaces.length > 0)
            freeWorkplaces[rnd(freeWorkplaces.length - 1)].addWorker(this);
    }

    remove(){
        people.splice(people.indexOf(this), 1);
        document.getElementById('mainStat-population-value').innerText = people.length;
        this.household = undefined;
        this.car.remove();
    }
}