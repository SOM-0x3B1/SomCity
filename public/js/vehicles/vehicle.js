let movingCars = {};

class Vehicle {
    constructor(x, y) {
        this.id = guidGenerator();

        this.x = x;
        this.y = y;
        this.target;
        this.housingBuilding;

        //this.carIcon.id = `vehicle(${this.id})`;        

        this.route = [];
        this.nextRouteIndex = 0;
        this.lastRoadKey;
        this.cRoadKey;
        this.cQueue;
        this.waiting = false;

        this.firstTimeInJammedJunction = true;

        this.changeRouteNextTimeToTarget = undefined;

        this.shopping = false;
        this.originalTarget;
        this.targetShopTypes = {};

        this.enterTargetBuilding; // functions declared in a child class
        this.leaveTargetBuilding;
    }

    calcRoute(target) {
        if (this.housingBuilding)
            this.exitBuilding();

        /*if (this.route.length > 0) {
            let cWayPoint = this.route[this.cRoutePoint];
            this.lastWayPoint = this.route[this.cRoutePoint - 1];
            let nextRoad = roads[coordsToKey(cWayPoint.x, cWayPoint.y)];
            let queue = nextRoad.queues[coordsToKey(this.lastWayPoint.x, this.lastWayPoint.y)];
            queue.splice(queue.indexOf(this), 1);
        }*/

        movingCars[this.id] = this;
        this.nextRouteIndex = 0;

        this.changeRouteNextTimeToTarget = undefined;

        this.target = target;
        const targetEntrance = target.entrance;
        if (targetEntrance)
            this.route = this.Dijkstra(coordsToKey(this.x, this.y), coordsToKey(targetEntrance.x, targetEntrance.y));
        else
            this.changeRouteNextTimeToTarget = target;

        if (!this.changeRouteNextTimeToTarget)
            this.initiateMove();
    }


    addToNextQueue() {
        const route = this.route;
        const nextWayPoint = route[this.nextRouteIndex];
        const nextRoad = roads[coordsToKey(nextWayPoint.x, nextWayPoint.y)];
        nextRoad.queues[coordsToKey(this.x, this.y)].push(this);
        this.cQueue = nextRoad.queues[coordsToKey(this.x, this.y)];
        this.waiting = true;
    }

    initiateMove() {
        if (!this.waiting) {
            const route = this.route;

            this.nextRouteIndex++;
            /*let nextWayPoint = route[this.nextRouteIndex];
            let nextRoad = roads[coordsToKey(nextWayPoint.x, nextWayPoint.y)];*/;

            if (route.length > 0 && !this.changeRouteNextTimeToTarget) {
                if (this.nextRouteIndex < route.length) {
                    const nextWayPoint = route[this.nextRouteIndex];
                    const nextRoad = roads[coordsToKey(nextWayPoint.x, nextWayPoint.y)];

                    const cRoad = roads[coordsToKey(this.x, this.y)];
                    const adjacentShop = this.nextToAShop(cRoad.adjBuildings);
                    if (!this.shopping && adjacentShop && Object.keys(this.targetShopTypes).length > 0) {
                        this.changeRouteNextTimeToTarget = adjacentShop;
                        this.originalTarget = this.target;
                        this.shopping = true;
                    }

                    if (cRoad.adjRoads.length > 2 && !this.shopping) {
                        if (Object.keys(this.targetShopTypes).length > 0) {
                            const reachableTarget = this.findNearShops(6);
                            if (reachableTarget) {
                                this.changeRouteNextTimeToTarget = reachableTarget;
                                this.originalTarget = this.target;
                                this.shopping = true;
                            }
                        }

                        if (!this.shopping && nextRoad.isJammed) {
                            this.changeRouteNextTimeToTarget = this.target;
                            this.firstTimeInJammedJunction = true;
                        }
                    }

                    this.addToNextQueue();
                }
                else if (route.length > 0)
                    this.reachTargetBuilding();
            }
            else if (this.changeRouteNextTimeToTarget)
                this.calcRoute(this.changeRouteNextTimeToTarget);
        }
    }

    reachTargetBuilding() {
        delete movingCars[this.id];
        //roads[coordsToKey(this.x, this.y)].cars[coordsToKey(this.lastWayPoint.x, this.lastWayPoint.y)]--;
        if (this.lastRoadKey)
            roads[coordsToKey(this.x, this.y)].cars[this.lastRoadKey]--;

        //console.log(this.target);
        this.x = this.target.x;
        this.y = this.target.y;
        this.clearOverlay();
        this.waiting = false;
        this.lastRoadKey = undefined;

        this.housingBuilding = this.target;
        this.route = [];

        this.enterTargetBuilding();
    }

    exitBuilding() {
        this.leaveTargetBuilding()

        const entrance = this.housingBuilding.entrance;
        this.x = entrance.x;
        this.y = entrance.y;

        this.housingBuilding = undefined;
    }

    drawOverlay() {
        /*if (this.lastRoadKey) {            
            let lastPos = this.route[this.lastRoadKey];*/
        /*if (lastPos)
            this.carIcon.style.transitionDelay = [].indexOf.call(getCell(lastPos.x, lastPos.y, LayerIDs.Main).getElementsByClassName('car'), this.carIcon) * 2 + 'ms';*/
        getCell(this.x, this.y, LayerIDs.Main).appendChild(this.carIcon);
        /*this.carIcon.style.transitionDuration = '0';
        this.carIcon.style.left = '-50%';            
        window.getComputedStyle(this.carIcon).opacity;
        window.getComputedStyle(this.carIcon).transitionDuration;
        this.carIcon.style.transitionDuration = '100ms';
        this.carIcon.style.left = '50%';
    }*/
    }

    clearOverlay() {
        this.carIcon.remove();
    }


    //https://gist.github.com/Prottoy2938/66849e04b0bac459606059f5f9f3aa1a
    Dijkstra(startKey, finishKey) {
        const nodes = new PriorityQueue();
        const scores = {};
        const previous = {};
        const finish = simplRoads[finishKey];
        let path = []; //to return at end
        let smallestKey;
        //build up initial state
        for (let vertexKey in simplRoads) {
            if (vertexKey === startKey) {
                scores[vertexKey] = 0;
                nodes.enqueue(vertexKey, 0);
            } else {
                scores[vertexKey] = Infinity;
                nodes.enqueue(vertexKey, Infinity);
            }
            previous[vertexKey] = null;
        }
        // as long as there is something to visit
        while (nodes.values.length) {
            smallestKey = nodes.dequeue().val;
            if (smallestKey === finishKey) {
                //WE ARE DONE
                //BUILD UP PATH TO RETURN AT END
                while (previous[smallestKey]) {
                    path.push(new COORD(simplRoads[smallestKey].x, simplRoads[smallestKey].y));
                    smallestKey = previous[smallestKey];
                }
                break;
            }
            if (smallestKey || scores[smallestKey] !== Infinity) {
                for (let i = 0; i < simplRoads[smallestKey].adjRoads.length; i++) {
                    //find neighboring node
                    let nextNodeKey = simplRoads[smallestKey].adjRoads[i];
                    //calculate new distance to neighboring node
                    let gscore = scores[smallestKey] + simplRoads[nextNodeKey].DijkstraWeight + (roads[nextNodeKey].isJammed ? 10 : 0) /*+ this.heuristic(simplRoads[nextNodeKey], finish)*/;
                    //console.log(gscore);

                    if (gscore < scores[nextNodeKey]) {
                        //updating new smallest distance to neighbor
                        scores[nextNodeKey] = gscore;
                        //updating previous - How we got to neighbor
                        previous[nextNodeKey] = smallestKey;
                        //enqueue in priority queue with new priority
                        nodes.enqueue(nextNodeKey, gscore);
                    }
                }
            }
        }
        return path.concat(new COORD(simplRoads[smallestKey].x, simplRoads[smallestKey].y)).reverse();
    }
    heuristic(node, finish) {
        return (Math.abs(finish.x - node.x) + Math.abs(finish.y - node.y)) / 10;
    }


    nextToAShop(adjBuildings) {
        for (const b of adjBuildings) {
            if (b instanceof CZone && b.storage > 0 && b.customerQueue.length < b.maxCustomers && b.production > 0) {
                for (const product of b.products) {
                    if (this.targetShopTypes[product])
                        return b;
                }
            }
        }
    }

    findNearShops(depth) {
        let root;
        if (this.housingBuilding)
            root = roads[coordsToKey(this.housingBuilding.entrance.x, this.housingBuilding.entrance.y)];
        else
            root = roads[coordsToKey(this.x, this.y)];

        let queue = [new BFSRoad(root, 0)];
        let visited = {};
        let current;

        while (queue.length > 0 && (!current || current.depth < depth)) {
            current = queue.shift();
            visited[coordsToKey(current.road.x, current.road.y)] = true;
            let adjBuildings = current.road.adjBuildings;
            for (const b of adjBuildings) {
                if (b instanceof CZone && b.storage > 0 && b.customerQueue.length < b.maxCustomers && b.production > 0) {
                    for (const product of b.products) {
                        if (this.targetShopTypes[product])
                            return b;
                    }
                }
            }

            let adjRoads = current.road.adjRoads;
            for (let i = 0; i < adjRoads.length; i++) {
                let cKey = coordsToKey(adjRoads[i].x, adjRoads[i].y);
                if (!visited[cKey])
                    queue.push(new BFSRoad(adjRoads[i], current.depth + 1));
            }
        }

        return null;
    }


    remove() {
        this.clearOverlay();
        //movingCars.splice(movingCars.indexOf(this), 1);
    }
}

class BFSRoad {
    constructor(road, depth) {
        this.road = road;
        this.depth = depth;
    }
}