import gt from "../../gametin/index.js";
import entity from "../../gametin/utils/entity.js";
const { TileSprite, Texture, math } = gt;
const texture = new Texture('./res/img/protoTiles.png');

class Hero extends TileSprite {
    constructor(controls) {
        super(texture, 16, 16);
        this.w = 16;
        this.h = 16;
        //this.anchor = {x: -8, y: -8 };
        this.rate = 0.5;
        this.curTime = 0;
        this.curFrame = 0;
        this.controls = controls;

        const { anims } = this;
        anims.add('walk', [
            {x: 4, y: 0 },
            {x: 4, y: 0 },
            {x: 4, y: 0 },
            {x: 4, y: 0 }
            ], 0.07);
        this.speed = 0.1;
        this.dir = {
            x: 0,
            y: 0
        };


    }
    

    update (dt, t) {
        
        const { pos, speed, rate, anims, controls, dir } = this;
        const { x, y } = controls;
        
        if(speed != 0){
            anims.play('walk');
        } 
        if(x && x !== dir.x){
            dir.x = x;
            dir.y = 0;
            pos.y = Math.round(pos.y / 16) * 16; //y snapping

        } else if (y && y !== dir.y) {
            dir.y = y;
            dir.x = 0;
            pos.x = Math.round(pos.x / 16) * 16; //x snapping
        }

        pos.x += dir.x * dt * (16 / speed);
        pos.y += dir.y * dt * (16 / speed);

        
        super.update(dt);
        
    }
}
export default Hero;