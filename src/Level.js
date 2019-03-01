import TileMap from "../gametin/TileMap.js";
import Texture from "../gametin/renderer/Texture.js";
import math from "../gametin/utils/math.js";
import TileSprite from "../gametin/renderer/TileSprite.js";
import Pellet from "./entities/Pellet.js";

const texture = new Texture ("./res/img/protoTiles.png");

const TILES = {
    hero: 16,
    pellet: 16
}

const LAYER = {
    GROUND: 0,
    PELLETS: 1
}
class Level extends TileMap {
    constructor(map){
        //console.log(map);
        const tileSize = 16;
        const textureWidthInTiles = Math.floor( texture.img.width / tileSize );
        const textureHeightInTiles = Math.floor( texture.img.height / tileSize );
        const mapW = map.width;
        const mapH = map.height;
        const w = mapW * tileSize;
        const h = mapH * tileSize;
        const level = [];
        const pellets = [];
        
        map.layers[LAYER.GROUND].data.forEach( (tileIndex)=>{
            level.push({
                x: tileIndex-1 % textureHeightInTiles,
                y: Math.floor(tileIndex / textureWidthInTiles)
            })
        });

        map.layers[LAYER.PELLETS].data.forEach( (tileIndex, index)=>{
            if(tileIndex == TILES.pellet){
                let x = tileSize * (index % mapH);
                let y = tileSize * Math.floor(index / mapW);
                pellets.push(new Pellet(x, y));
            }
            
        });
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
        this.tail = {x: 4, y: 0};
        this.pellets = pellets;
    }

    checkGround(pos) {
        const { tail, lastTile } = this;
        const tile = this.tileAtPixelPos(pos);
        if(lastTile === tile) {
            return "checked";
        }
        this.lastTile = tile;
        if(tile.frame !== tail) {
            this.setFrameAtPixelPos(pos,tail);
           // tile.w1 -= 100;
            return "solid";
        }
        return "cleared";
    }
}

export default Level;