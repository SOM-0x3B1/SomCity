class Road {
    constructor(x, y, type, capacity, deletable) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.directions; // pl. 3j-u, v, h, etc.
        this.capacity = capacity;
        this.cars = 0;
        this.deletable = deletable;

        this.adjRoads = [];
        this.destination = [];
    }

    updateDirections(firstUpdate) {
        let x = this.x;
        let y = this.y;

        let top = false;
        let down = false;
        let left = false;
        let right = false;

        if (y > 0)
            top = gameLayer[y - 1][x];
        if (y < mapHeight - 1)
            down = gameLayer[y + 1][x];
        if (x > 0)
            left = gameLayer[y][x - 1];
        if (x < mapWidth - 1)
            right = gameLayer[y][x + 1];

        let topIsRoad = top instanceof Road;
        let downIsRoad = down instanceof Road;
        let leftIsRoad = left instanceof Road;
        let rightIsRoad = right instanceof Road;

        let neighBours = [top, left, down, right];
        let neighBoursAreRoards = [topIsRoad, leftIsRoad, downIsRoad, rightIsRoad];

        this.adjRoads = [];
        for (let i = 0; i < 4; i++) {
            if (neighBours[i] && neighBoursAreRoards[i])
                this.adjRoads.push(neighBours[i]);
        }

        /*if(this.adjRoads.length > 1)
            console.log(this.adjRoads.length);*/

        switch (this.adjRoads.length) {
            case 1:
                if (leftIsRoad || rightIsRoad)
                    this.directions = 'h';
                else
                    this.directions = 'v';
                break;
            case 2:
                if (leftIsRoad && rightIsRoad)
                    this.directions = 'h';
                else if (topIsRoad && downIsRoad)
                    this.directions = 'v';
                else if (topIsRoad && leftIsRoad)
                    this.directions = 't-ul';
                else if (topIsRoad && rightIsRoad)
                    this.directions = 't-ur';
                else if (downIsRoad && leftIsRoad)
                    this.directions = 't-dl';
                else if (downIsRoad && rightIsRoad)
                    this.directions = 't-dr';
                break;
            case 3:
                if (topIsRoad && leftIsRoad && rightIsRoad)
                    this.directions = '3j-u';
                else if (topIsRoad && rightIsRoad && downIsRoad)
                    this.directions = '3j-r';
                else if (leftIsRoad && downIsRoad && rightIsRoad)
                    this.directions = '3j-d';
                else if (downIsRoad && leftIsRoad && topIsRoad)
                    this.directions = '3j-l';
                break;
            case 4:
                this.directions = '4j';
                break;
            /*default:
                this.directions = 'h';*/
        }


        getImg(x, y).src = 'assets/roads/' + this.type + '-' + this.directions + '.png';

        if (firstUpdate)
            for (let i = 0; i < this.adjRoads.length; i++)
                this.adjRoads[i].updateDirections(false);
    }
}


/*if (topIsRoad && downIsRoad && leftIsRoad && rightIsRoad) {
    this.directions = '4j';
    this.adjRoads = [top, down, left, right];
}
else if(topIsRoad && leftIsRoad && rightIsRoad)
{
    this.directions = '3j-u';
    this.adjRoads = [top, left, right];
}
else if(topIsRoad && rightIsRoad && downIsRoad)
{
    this.directions = '3j-r';
    this.adjRoads = [top, right, down];
}
else if(leftIsRoad && downIsRoad && rightIsRoad)
{
    this.directions = '3j-d';
    this.adjRoads = [down, left, right];
}
else if(downIsRoad && leftIsRoad && topIsRoad)
{
    this.directions = '3j-l';
    this.adjRoads = [down, left, top];
}
else if(leftIsRoad && rightIsRoad){
    this.directions = 'h';
    this.adjRoads = [left, right];
}
else if(topIsRoad && downIsRoad){
    this.directions = 'v';
    this.adjRoads = [top, down];
    console.log(y);
}
else if(topIsRoad && leftIsRoad){
    this.directions = 't-ul';
    this.adjRoads = [left, right];
}
else if(topIsRoad && downIsRoad){
    this.directions = 'v';
    this.adjRoads = [top, down];
    console.log(y);
}
else if(leftIsRoad && rightIsRoad){
    this.directions = 'h';
    this.adjRoads = [left, right];
}
else if(topIsRoad && downIsRoad){
    this.directions = 'v';
    this.adjRoads = [top, down];
    console.log(y);
}
else if(topIsRoad){
    this.directions = 'v'
    this.adjRoads = [top];
}
else if(downIsRoad){
    this.directions = 'v'
    this.adjRoads = [down];
}
else if(leftIsRoad){
    this.directions = 'h'
    this.adjRoads = [left];
}       
else if(rightIsRoad){
    this.directions = 'h'
    this.adjRoads = [right];
}
else
    this.directions = 'h';*/