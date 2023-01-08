class Car {
    constructor() {
        let startingCell = entryPoints[rnd(entryPoints.length - 1)];

        this.x = startingCell.x;
        this.y = startingCell.y;
        this.targetEntrance;

        this.color = '#' + rnd(16777215).toString(16);

        this.route = [];
        this.cRoutePoint = 0;
    }

    calcRoute(targetEntrance) {
        this.cRoutePoint = 0;
        this.targetEntrance = targetEntrance;
        if(targetEntrance)
            this.route = astar.search(listOfRoads.indexOf(roads[coordsToKey(this.x, this.y)]), listOfRoads.indexOf(roads[coordsToKey(targetEntrance.x, targetEntrance.y)]));
        /*this.route.forEach(i => {
            console.log(i);
        });*/
    }

    drawOverlay(){
        let carIcon = document.createElement('div');
        carIcon.className = 'car';
        carIcon.style.backgroundColor = this.color;
        getCell(this.x, this.y, LayerIDs.Main).appendChild(carIcon);
        console.log(carIcon);
    }
}

const astar = {
    init: (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            node.f = 0;
            node.g = 0;
            node.h = 0;
            node.cost = 1;
            node.visited = false;
            node.closed = false;
            node.parent = null;
        }
    },
    search: (startIndex, endIndex, heuristic) => {
        let nodes = [...listOfRoads];

        astar.init(nodes);

        let start = nodes[startIndex];
        let end = nodes[endIndex];

        heuristic = heuristic || astar.manhattan;

        let openHeap = new PriorityQueue();

        openHeap.insert(start);

        while (openHeap.size() > 0) {

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            let currentNode = openHeap.extract_min();

            // End case -- result has been found, return the traced path.
            if (currentNode === end) {
                let curr = currentNode;
                let ret = [];
                while (curr.parent != start) {
                    ret.push(new COORD(curr.x, curr.y));
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
            let neighbors = [...currentNode.adjRoads]

            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];

                /*if(neighbor.closed || neighbor.isWall()) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }*/

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                let gScore = currentNode.g + neighbor.cost;
                let beenVisited = neighbor.visited;

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
};