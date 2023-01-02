class Building{
    constructor(x, y, width, height, type, layer){
        this.x = x;
        this.y = y;

        this.width = width
        this.height = height;

        this.type = type;

        if(layer == planningLayer)
            this.layer = planningLayer;
        else
            this.layer = mainLayer;
    }
}