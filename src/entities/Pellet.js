import gt from "../../gametin/index.js";
const { TileSprite, Texture, math } = gt;
const texture = new Texture('./res/img/protoTiles.png');
class Pellet extends TileSprite {
    constructor(x, y){
        super(texture, 16,16);
        this.w = 16;
        this.h = 16;
        this.pos.x = x;
        this.pos.y = y;
        const { anims } = this;
        anims.add('idle', [
            {x:15, y:0}
        ])

    }

    update(dt, t){
        this.anims.play('idle');
        super.update(dt);
    }
}
export default Pellet;