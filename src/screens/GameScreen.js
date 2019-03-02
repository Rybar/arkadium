import gt from "../../gametin/index.js";
const { Container, Camera, entity, math } = gt;
import Hero from "../entities/Hero.js";
import Level from "../Level.js";

const levelData = TileMaps.testMap1;



class GameScreen extends Container {
  constructor(game, controls, onGameOver) {
    super();

    this.onGameOver = onGameOver;
    const level = new Level(levelData);

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
    console.log(level);
    const pellets = new Container();
    pellets.children = level.pellets;
    
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
    this.elapsedFrames = 0;
   
  }

  update(dt, t) {
    //stats.begin();
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
    //for loop  is for performance sake, and I need to start and stop at specific points just inside the map grid to
    //prevent out-of-range errors. i start is one row down and 1 cell in, i end is 1 row from bottom.
    
      for(let i = level.mapW + 1, arr = level.children, lvl = level; i < arr.length-level.mapW; i++){
        arr[i].w2 =  (arr[i-1].w1 +
          arr[i+1].w1 +
          arr[i + lvl.mapW].w1 +
          arr[i - lvl.mapW].w1 ) / 2 - arr[i].w2;  //smooth value by averaging neighbors
          arr[i].w2 = arr[i].w2 * 0.9 //magic number, is damping factor
      }

      level.children.map((tile, i, arr)=>{
        //to create the wave effect, I'm bumping the tile's y value and scale
        tile.pos.y = tile.oy - tile.w2*10;
        tile.scale.x = tile.scale.y = 1 + tile.w2;
        //and also the sprites frame Y value. see the spritesheet to make sense of what's happening here
        let waveFrame = math.clamp( Math.floor( math.range(tile.w2, -.4, 0.4,0,waveFrames.length) ), 0, waveFrames.length);
        //set the frame to further down the spritesheet
        tile.frame.y = waveFrames[waveFrame];

        //swap wave buffer values, final step of wave propogation effect
        [tile.w1 , tile.w2] = [tile.w2, tile.w1] 
      })
  
    if (level.checkGround(entity.center(hero)) === "cleared" && this.waveCooldown < 0) {
      level.tileAtPixelPos(entity.center(hero)).w2 = -5; //magnitude of wave
      this.waveCooldown = 1;   
    }

    //collect pellets
    entity.hits(hero, pellets, function(pellet, pellets){
      pellets.remove(pellet);
      level.tileAtPixelPos(entity.center(hero)).w2 = -.5; //magnitude of wave

    });

    //stats.end();
  }
  
}

export default GameScreen;
