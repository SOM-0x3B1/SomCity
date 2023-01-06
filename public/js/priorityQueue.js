const root = 0;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;
const parent = i => ((i + 1) >> 1) - 1;

class PriorityQueue {

    constructor() {
        this._heap = [];
    }

    size() {
        return this._heap.length;
    }

    peek() {
        return this._heap[0];
    }

    build_heap(values) {
        values.forEach(value => {
            this._heap.push(value);
        });

        let n = values.length;
        let lastNonLeafNode = (n >> 1) - 1;

        for (let i = lastNonLeafNode; i >= 0; i--) {
            this.heapify(i);
        }
    }

    heapify(i) {
        let node = i;
        let l = left(node);
        let r = right(node);
        let n = this.size();

        if (l < n && this._heap[node] > this._heap[l]) {
            node = l;
        }

        if (r < n && this._heap[node] > this._heap[r]) {
            node = r;
        }

        if (node !== i) {
            this.swap(node, i);
            this.heapify(node);
        }
    }

    insert(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this.heapifyUp();
        })
    }

    extract_min() {
        let poppedVal = this.peek();
        let last = this.size() - 1;
        let top = 0;

        // swap top with last
        if (last > top)
            this.swap(top, last);

        // remove last node
        this._heap.pop();

        this.heapifyDown();

        return poppedVal;
    }

    swap(i, j) {
        let temp = this._heap[i];
        this._heap[i] = this._heap[j];
        this._heap[j] = temp;
    }

    heapifyUp() {
        let node = this.size() - 1;

        while (node > 0 && this._heap[node] < this._heap[parent(node)]) {
            this.swap(node, parent(node));
            node = parent(node);
        }
    }

    heapifyDown() {
        let node = root;
        let n = this.size();
        let min;

        while (left(node) < n && this._heap[node] > this._heap[left(node)] ||
            right(node) < n && this._heap[node] > this._heap[right(node)]) {

            min = this._heap[left(node)];

            min = this._heap[right(node)] !== undefined ? Math.min(min, this._heap[right(node)]) : min;

            if (this._heap[node] < min) {
                break;
            }

            if (min === this._heap[left(node)]) {
                this.swap(node, left(node));
                node = left(node);
            } else {
                this.swap(node, right(node));
                node = right(node);
            }
        }
    }
}