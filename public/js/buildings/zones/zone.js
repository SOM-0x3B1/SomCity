let freeWorkplaces = [];

class Zone extends Building {
    constructor(x, y, texturePath, layer) {
        super(x, y, 2, 2, texturePath, true, layer);        

        this.level = 0;
        this.waterConsumption = 0;

        this.buildingImg = new Image();        
        this.constructionPhase = 0;
        this.constructionInterval;

        this.started = false;
    }    

    startConstruction(){
        this.started = true;
        this.buildingImg.src = `assets/construction/construction${this.constructionPhase}.png`;
        getCell(this.x, this.y, LayerIDs.Main).appendChild(this.buildingImg);
        resizeStaticImg(this.buildingImg, 2, 2);        

        this.constructionInterval = setInterval(() => {
            this.constructionPhase++;
            if (this.constructionPhase > 4)
                this.finishConstruction();
            else{
                this.buildingImg.src = `assets/construction/construction${this.constructionPhase}.png`;
            }
        }, 3000);
    }
}