let movingCars = {};

class Car {
    constructor() {
        this.id = guidGenerator();
        let startingCell = entryPoints[rnd(entryPoints.length - 1)];

        this.x = startingCell.x;
        this.y = startingCell.y;
        this.target;
        this.housingBuilding;

        this.color = '#' + rnd(16777215).toString(16);
        this.carIcon = document.createElement('div');
        this.carIcon.className = 'car';
        this.carIcon.id = `car(${this.id})`;
        this.carIcon.style.backgroundColor = this.color;

        this.route = [];
        this.cRoutePoint = 1;
        this.lastRoutePoint = 0;
        this.waiting = false;

        this.drawOverlay();
    }

    calcRoute(target) {
        if(this.housingBuilding)
            this.exitBuilding();

        movingCars[this.id] = this;
        this.cRoutePoint = 1;
        this.target = target;
        let targetEntrance = target.entrance;
        if (targetEntrance)
            this.route = this.Dijkstra(coordsToKey(this.x, this.y), coordsToKey(targetEntrance.x, targetEntrance.y));
        //console.log(this.route);
        /*this.route.forEach(i => {
            console.log(i);
        });*/
    }

    move() {
        if (!this.waiting) {
            if (this.route.length > 0) {
                if (this.cRoutePoint < this.route.length - 1) {
                    let cWayPoint = this.route[this.cRoutePoint];
                    this.lastWayPoint = this.route[this.cRoutePoint - 1];
                    roads[coordsToKey(cWayPoint.x, cWayPoint.y)].queues[coordsToKey(this.lastWayPoint.x, this.lastWayPoint.y)].push(this);
                    //console.log(roads[coordsToKey(cWayPoint.x, cWayPoint.y)].queues[coordsToKey(lastWayPoint.x, lastWayPoint.y)]);
                    this.waiting = true;
                    /*this.x = cRoute.x;
                    this.y = cRoute.y;*/
                }
                else
                    this.enterTargetBuilding();
            }
            else
                this.calcRoute(this.target);
        }
    }

    enterTargetBuilding() {
        delete movingCars[this.id];
        roads[coordsToKey(this.x, this.y)].cars--;

        //console.log(this.target);
        this.x = this.target.x;
        this.y = this.target.y;
        this.clearOverlay();
        if (!this.target.started)
            this.target.startConstruction();
        this.waiting = false;

        this.housingBuilding = this.target;
    }

    exitBuilding(){
        this.x = this.housingBuilding.entrance.x;
        this.y = this.housingBuilding.entrance.y;
        this.housingBuilding = undefined;
    }

    drawOverlay() {
        /*this.carIcon.style.left = '-50%';
        let lastPos = this.route[this.lastRoutePoint];
        if (lastPos)
            this.carIcon.style.transitionDelay = [].indexOf.call(getCell(lastPos.x, lastPos.y, LayerIDs.Main).getElementsByClassName('car'), this.carIcon) * 2 + 'ms';*/
        getCell(this.x, this.y, LayerIDs.Main).appendChild(this.carIcon);
        //this.carIcon.style.left = '50%';
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
                    let gscore = scores[smallestKey] + simplRoads[nextNodeKey].DijkstraWeight + (roads[nextNodeKey].full ? 6 : 0) /*+ this.heuristic(simplRoads[nextNodeKey], finish)*/;
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


    remove() {
        this.clearOverlay();
        //movingCars.splice(movingCars.indexOf(this), 1);
    }
}

/*let astar = {
    init: (nodes) => {
        for (const key in nodes) {
            let node = nodes[key];
            node.f = 0;
            node.g = 0;
            node.h = 0;
            node.cost = 1;
            node.visited = false;
            node.closed = false;
            node.parent = null;
        }
    },
    search: (startKey, endKey, heuristic) => {
        let nodes = {};
        for (const key in roads)
            nodes[key] = {...roads[key]}
        astar.init(nodes);

        let start = nodes[startKey];
        let end = nodes[endKey];
        heuristic = heuristic || astar.manhattan;

        let openHeap = new PriorityQueue((n) => {return n.f});
        openHeap.insert(start);

        while (openHeap.size() > 0) {

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.            
            let currentNode = openHeap.extract_min();

            // End case -- result has been found, return the traced path.
            if (currentNode === end) {
                let curr = currentNode;
                let ret = [];
                while (curr.parent != nodes[startKey]) {
                    ret.push(new COORD(curr.x, curr.y));
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
            let neighbors = currentNode.adjRoads;         

            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = nodes[neighbors[i]];


                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                let gScore = currentNode.g + neighbor.cost;
                let beenVisited = neighbor.visited;
                //console.log(beenVisited);

                if (!beenVisited || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor.x, neighbor.y, end.x, end.y);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.insert(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        console.log(getCell(neighbor.x, neighbor.y, LayerIDs.Main));
                        openHeap.heapify(openHeap._heap.indexOf(neighbor));                        
                    }
                }
            }
        }

        // No result was found - empty array signifies failure to find path.
        return [];
    },
    manhattan: (node1X, node1Y, node2X, node2Y) => {
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

        let d1 = Math.abs(node1X - node2X);
        let d2 = Math.abs(node1Y - node2Y);
        return d1 + d2;
    }
};*/