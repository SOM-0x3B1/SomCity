let movingCars = {};

class Car {
    constructor() {
        let id = guidGenerator();
        let startingCell = entryPoints[rnd(entryPoints.length - 1)];

        this.x = startingCell.x;
        this.y = startingCell.y;
        this.target;

        this.color = '#' + rnd(16777215).toString(16);
        this.carIcon = document.createElement('div');
        this.carIcon.className = 'car';
        this.carIcon.id = `car(${this.x},${this.x})`;
        this.carIcon.style.backgroundColor = this.color;

        this.route = [];
        this.cRoutePoint = 0;

        this.drawOverlay();
    }

    calcRoute(target) {
        this.cRoutePoint = 0;
        this.target = target;
        let targetEntrance = target.entrance;
        if (targetEntrance)
            this.route = this.Dijkstra(coordsToKey(this.x, this.y), coordsToKey(targetEntrance.x, targetEntrance.y));
        console.log(this.route);
        /*this.route.forEach(i => {
            console.log(i);
        });*/
    }

    move() {
        if (this.route.length > 0) {
            if (this.cRoutePoint < this.route.length - 1) {
                this.cRoutePoint++;
                let cRoute = this.route[this.cRoutePoint];
                this.x = cRoute.x;
                this.y = cRoute.y;
                this.drawOverlay();
            }
            else {
                delete movingCars[this.id];
                this.enterTargetBuilding();
            }
        }
        else
            this.calcRoute(this.target);
    }

    enterTargetBuilding() {
        this.x = this.target.x;
        this.y = this.target.y;
        this.clearOverlay();
    }

    drawOverlay() {
        getCell(this.x, this.y, LayerIDs.Main).appendChild(this.carIcon);
    }

    clearOverlay() {
        this.carIcon.remove();
    }


    //https://gist.github.com/Prottoy2938/66849e04b0bac459606059f5f9f3aa1a
    Dijkstra(startKey, finishKey) {
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        let path = []; //to return at end
        let smallestKey;
        //build up initial state
        for (let vertexKey in roads) {
            if (vertexKey === startKey) {
                distances[vertexKey] = 0;
                nodes.enqueue(vertexKey, 0);
            } else {
                distances[vertexKey] = Infinity;
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
                    path.push(new COORD(roads[smallestKey].x, roads[smallestKey].y));
                    smallestKey = previous[smallestKey];
                }
                break;
            }
            if (smallestKey || distances[smallestKey] !== Infinity) {
                for (let i = 0; i < roads[smallestKey].adjRoads.length; i++) {
                    //find neighboring node
                    let nextNodeKey = roads[smallestKey].adjRoads[i];
                    //calculate new distance to neighboring node
                    let candidate = distances[smallestKey] + /*nodes[nextNodeKey].weight*/ 1;

                    if (candidate < distances[nextNodeKey]) {
                        //updating new smallest distance to neighbor
                        distances[nextNodeKey] = candidate;
                        //updating previous - How we got to neighbor
                        previous[nextNodeKey] = smallestKey;
                        //enqueue in priority queue with new priority
                        nodes.enqueue(nextNodeKey, candidate);
                    }
                }
            }
        }
        return path.concat(new COORD(roads[smallestKey].x, roads[smallestKey].y)).reverse();
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