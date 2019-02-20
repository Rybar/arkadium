import gt from "../../gametin/index.js";
const { Container, Camera, entity, math } = gt;
import Hero from "../entities/Hero.js";
import Level from "../Level.js";

class GameScreen extends Container {
  constructor(game, controls, onGameOver) {
    super();

    this.onGameOver = onGameOver;
    const level = new Level(game.w * 2, game.h * 2);

    this.controls = controls;
    const hero = new Hero(controls);
    hero.pos = {
      x: 16 * Math.round(level.w/16/2),
      y: 16 * Math.round(level.h/16/2)
    };

    const camera = this.add(
      new Camera(
        hero,
        { w: game.w, h: game.h },
        { w: level.w, h: level.h }, 0.1
      )
    );

    this.stats = {
      pellets: 0,
      maxPellets: level.totalFreeSots,
      lives: 3,
      score: 0
    }

    // Add it all to the game camera
    camera.add(level);
    //camera.add(this.baddies);
    camera.add(hero);

    // Keep references to things we need in "update"
    this.level = level;
    this.camera = camera;
    this.hero = hero;
   
  }

  update(dt, t) {
    super.update(dt, t);
    const { hero, level, controls } = this;
    // Confine player to the level bounds
    const { pos } = hero;
    const { bounds: { top, bottom, left, right } } = level;
    pos.x = math.clamp(pos.x, left, right);
    pos.y = math.clamp(pos.y, top, bottom);

    //this is where the wave magic happens. I've added a couple properties to each tile, w1 and w2,
    //to hold values from the wave buffer. 
    

      for(let i = level.mapW + 1, arr = level.children, lvl = level; i < arr.length-level.mapW; i++){
        arr[i].w2 =  (arr[i-1].w1 +
          arr[i+1].w1 +
          arr[i + lvl.mapW].w1 +
          arr[i - lvl.mapW].w1 ) / 2 - arr[i].w2  //smooth value by averaging neighbors
          arr[i].w2 = arr[i].w2 * 0.95 //magic number, is damping factor
      }


    

    level.children.map((tile, i, arr)=>{
      tile.pos.y = tile.oy + tile.w2;
      [tile.w1 , tile.w2] = [tile.w2, tile.w1] //swap wave buffer values
    })

    // See if we're on new ground
    if(controls.action){
      const ground = level.checkGround(entity.center(hero));
      if (ground === "cleared") {
        level.tileAtPixelPos(entity.center(hero)).w2 = 60;
      }
    }
   
  }
}

export default GameScreen;
