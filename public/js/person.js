let people = [];
let targetedPeople = [];

class Person {
    constructor() {        
        this.car = new Car();
        this.household;
        people.push(this);

        document.getElementById('mainStat-population-value').innerText = people.length + ' / ' + maxPopulation;
    }
}