import gt from "../../gametin/index.js";
const { Container, Camera, entity, math } = gt;
import Hero from "../entities/Hero.js";
import Pellet from "../entities/Pellet.js";
import Level from "../Level.js";

var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

class GameScreen extends Container {
  constructor(game, controls, onGameOver) {
    super();

    this.onGameOver = onGameOver;
    const level = new Level(game.w * 2, game.h * 2);

    this.controls = controls;
    const waveFrames = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
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

    const pellets = new Container();
    for(let i = 0; i < 100; i++){
      let x = Math.floor( Math.random()*level.w/16 ) * 16;
      let y = Math.floor( Math.random()*level.h/16 ) * 16;
      pellets.add(new Pellet(x, y));
    }
    // Add it all to the game camera
    camera.add(level);
    camera.add(pellets);
    camera.add(hero);

    // Keep references to things we need in "update"
    this.level = level;
    this.camera = camera;
    this.hero = hero;
    this.waveFrames = waveFrames;
    this.waveCooldown = 0;
    this.pellets = pellets;
   
  }

  update(dt, t) {
    stats.begin();

    super.update(dt, t);
    const { hero, level, controls, waveFrames, pellets } = this;
    this.waveCooldown-= dt;
    // Confine player to the level bounds
    const { pos } = hero;
    const { bounds: { top, bottom, left, right } } = level;
    pos.x = math.clamp(pos.x, left, right);
    pos.y = math.clamp(pos.y, top, bottom);
    const metrics = {
      pelletsCollected: 0
    }

    //this is where the wave magic happens. I've added a couple properties to each tile, w1 and w2,
    //to hold values from the wave buffer. 
    

      for(let i = level.mapW + 1, arr = level.children, lvl = level; i < arr.length-level.mapW; i++){
        arr[i].w2 =  (arr[i-1].w1 +
          arr[i+1].w1 +
          arr[i + lvl.mapW].w1 +
          arr[i - lvl.mapW].w1 ) / 2 - arr[i].w2  //smooth value by averaging neighbors
          arr[i].w2 = arr[i].w2 * 0.9 //magic number, is damping factor
      }
    
    level.children.map((tile, i, arr)=>{
      tile.pos.y = tile.oy - tile.w2*100;
      tile.scale.x = tile.scale.y = 1 + tile.w2*3;
      let waveFrame = math.clamp( Math.floor( math.range(tile.w2, -.4, 0.4,0,waveFrames.length) ), 0, waveFrames.length);
      tile.frame.y = waveFrames[waveFrame]; 
      [tile.w1 , tile.w2] = [tile.w2, tile.w1] //swap wave buffer values
    })

    // See if we're on new ground
    if(controls.action){
      const ground = level.checkGround(entity.center(hero));
      if (ground === "cleared" && this.waveCooldown < 0) {
        level.tileAtPixelPos(entity.center(hero)).w2 = 10; //magnitude of wave 
        this.waveCooldown = 1;  
        
      }
    }

    //collect pellets
    entity.hits(hero, pellets, function(pellet, pellets){
      pellets.remove(pellet);
      level.tileAtPixelPos(entity.center(hero)).w2 = 1; //magnitude of wave

    });

    stats.end();
  }
  
}

export default GameScreen;
