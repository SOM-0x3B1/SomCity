class Zone extends Building {
    constructor(x, y, texture, layer) {
        super(x, y, 2, 2, texture, true, layer);        

        this.development = 0;
    }    
}