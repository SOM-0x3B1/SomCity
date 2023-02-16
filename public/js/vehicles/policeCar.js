let policeCars = [];
let movingPoliceCars = 0;

class PoliceCar extends Vehicle {
    constructor(station) {
        let startingCell = entryPoints[rnd(entryPoints.length - 1)];
        super(startingCell.x, startingCell.y);

        this.station = station;

        this.carIcon = document.createElement('div');
        this.carIcon.className = 'policeCar';
        this.carIconIsBlue = false;
        this.drawOverlay();

        this.lightInterval = setInterval(() => {
            if (this.carIconIsBlue)
                this.carIcon.style.boxShadow = '0 0 1em rgb(255, 0, 0)';
            else
                this.carIcon.style.boxShadow = '0 0 1em rgb(0, 0, 255)';
            this.carIconIsBlue = !this.carIconIsBlue;
        }, 200);

        policeCars.push(this);
    }

    enterTargetBuilding() {
        if (this.housingBuilding != this.station)
            this.calcRoute(this.station);
        /*else if (this.onTheRoad) {
            this.housingBuilding.activeTrucks.splice(this.housingBuilding.activeTrucks.indexOf(this), 1);
            this.onTheRoad = false;
        }*/
        movingPoliceCars--;

        if (aaPolice.playing && movingPoliceCars == 0)
            aaPolice.fadeOut(0.2);

        clearInterval(this.lightInterval);
    }

    leaveTargetBuilding() {
        movingPoliceCars++;

        this.lightInterval = setInterval(() => {
            if (this.carIconIsBlue)
                this.carIcon.style.boxShadow = '0 0 1em rgb(255, 0, 0)';
            else
                this.carIcon.style.boxShadow = '0 0 1em rgb(0, 0, 255)';
            this.carIconIsBlue = !this.carIconIsBlue;
        }, 200);

        if (!aaPolice.playing)
            aaPolice.fadeIn(0.2);
    }
}