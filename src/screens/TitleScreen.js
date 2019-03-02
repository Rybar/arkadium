import Container from "../../gametin/Container.js";
import Texture from "../../gametin/renderer/Texture.js";
import TileSprite from "../../gametin/renderer/TileSprite.js";

const texture = new Texture("./res/img/title.png");
const airshiptex = new Texture("./res/img/airship.png");
class TitleScreen extends Container {
    constructor(game, controls, onStart) {
        super();
        this.onStart = onStart;
        this.controls = controls;
        // this.title = this.add(new TileSprite(texture));
        // this.title.pivot = {x:150, y:100}
        // this.title.rotation = Math.PI/4; //45 degrees I think?
        for(let i = 0; i < 125; i++){
            let slice = this.add(new TileSprite(airshiptex, 126,126));
            slice.pivot = {x: 126/2, y:126/2};
            slice.scale.y = 1;
            slice.frame.x = i;
            slice.pos.y = 100-i;
        }

        for(let i = 0; i < 125; i++){
            let slice = this.add(new TileSprite(airshiptex, 126,126));
            slice.pivot = {x: 126/2, y:126/2};
            slice.scale.y = .75;
            slice.frame.x = i;
            slice.pos.x = 200;
            slice.pos.y = 100-i;
        }
        // this.airship = this.add(new TileSprite(airshiptex, 126, 126));
        // this.airship.pivot = {x:126/2, y:126/2};
        // this.airship.frame.x = 10;
        this.globalrotate = 0;
        controls.reset();
    }
    update(dt, t){
        const {controls, globalrotate} = this;
        this.globalrotate += .01;
        this.children.map(slice=>{
            slice.rotation = this.globalrotate;
        })
    //    airship.rotation += .01;
    //    airship.frame.x += 1;
    //    airship.pos.y += 1;
    //    if(airship.frame.x > 125){
    //         airship.frame.x = 0;
    //         airship.pos.y = 0;
    //     }
        if(controls.action){
            this.onStart();
            
        }
    }
}

export default TitleScreen