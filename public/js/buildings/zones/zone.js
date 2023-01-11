class Zone extends Building {
    constructor(x, y, texture, layer) {
        super(x, y, 2, 2, texture, true, layer);        

        this.level = 0;

        this.buildingImg = new Image();
        this.buildingTexture = rnd(5);
        this.constructionPhase = 0;
        this.constructionInterval;

        this.started = false;
    }    
}