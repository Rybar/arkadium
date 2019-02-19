import gt from "../../gametin/index.js";
const { Container, Camera, entity, math } = gt;
import Hero from "../entities/Hero.js";
import Level from "../Level.js";

class GameScreen extends Container {
  constructor(game, controls, onGameOver) {
    super();

    this.onGameOver = onGameOver;
    const level = new Level(game.w * 2, game.h * 2);
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
    const { hero, level } = this;
    // Confine player to the level bounds
    const { pos } = hero;
    const { bounds: { top, bottom, left, right } } = level;
    pos.x = math.clamp(pos.x, left, right);
    pos.y = math.clamp(pos.y, top, bottom);

    // See if we're on new ground
    const ground = level.checkGround(entity.center(hero));
    if (ground === "cleared") {
      this.onGameOver(this.stats);
    }
  }
}

export default GameScreen;
