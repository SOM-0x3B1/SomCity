let people = [];
let targetedPeople = [];
let unemployed = [];
//let lookForJob = [];

class Person {
    constructor() {        
        this.car = new Car();
        this.household;
        this.job;
        people.push(this);
        unemployed.push(this);

        document.getElementById('mainStat-population-value').innerText = people.length;
    }

    lookForJob(){
        if(freeWorkplaces.length > 0){
            freeWorkplaces[rnd(freeWorkplaces.length - 1)].addWorker(this);
            unemployed.splice(unemployed.indexOf(this), 1);
        }
    }

    remove(){
        people.splice(people.indexOf(this), 1);
        document.getElementById('mainStat-population-value').innerText = people.length;
        this.household = undefined;
        this.car.remove();
    }
}