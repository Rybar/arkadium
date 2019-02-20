import TileMap from "../gametin/TileMap.js";
import Texture from "../gametin/renderer/Texture.js";
import math from "../gametin/utils/math.js";

const texture = new Texture ("./res/img/protoTiles.png");

class Level extends TileMap {
    constructor(w, h){
        const tileSize = 16;
        const mapW = Math.floor(w / tileSize);
        const mapH = Math.floor(h / tileSize);
        const level = [];
        
        for (let y = 0; y < mapH; y++) {
            for (let x = 0; x < mapW; x++) {
                level.push({
                    x: math.rndInt(2)+1,
                    y: 0,
                });
            }
        }
        super(level, mapW, mapH, tileSize, tileSize, texture);

        //additional properties for wave effects
        this.map(tile =>{
            tile.w1 = 0;
            tile.w2 = 0;
            tile.oy = tile.pos.y;
        })
        
        this.bounds = {
            left: tileSize,
            right: w - tileSize * 2,
            top: tileSize,
            bottom: h - tileSize * 2 
        }
        this.blank = {x: 3, y: 0};
    }

    checkGround(pos) {
        const { blank, lastTile } = this;
        const tile = this.tileAtPixelPos(pos);
        if(lastTile === tile) {
            return "checked";
        }
        this.lastTile = tile;
        if(tile.frame !== blank) {
            this.setFrameAtPixelPos(pos,blank);
           // tile.w1 -= 100;
            return "solid";
        }
        return "cleared";
    }
}

export default Level;