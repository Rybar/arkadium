import gt from "../gametin/index.js";
const {Game, KeyControls}  = gt;

import GameScreen from "./screens/GameScreen.js";
import TitleScreen from "./screens/TitleScreen.js";
import GameOverScreen from "./screens/GameOverScreen.js";

const game = new Game(640, 360, '#game');
const controls = new KeyControls();

function titleScreen(){
    game.scene = new TitleScreen(game, controls, newGame);
}

function gameOverScreen(result){
    console.log('game over');
    game.scene = new GameOverScreen(game, controls, result, titleScreen);
}

function newGame() {
    game.scene = new GameScreen(game, controls, gameOverScreen);
}

game.scene = new TitleScreen(game, controls, newGame);
game.run();