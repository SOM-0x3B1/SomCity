let people = [];
let targetedPeople = [];

class Person {
    constructor() {        
        this.car = new Car();
        this.household;
        people.push(this);

        document.getElementById('mainStat-population-value').innerText = people.length;
    }

    remove(){
        people.splice(people.indexOf(this), 1);
        document.getElementById('mainStat-population-value').innerText = people.length;
        this.household = undefined;
        this.car.remove();
    }
}