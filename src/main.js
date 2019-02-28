import gt from "../gametin/index.js";
const {Game, KeyControls}  = gt;

import GameScreen from "./screens/GameScreen.js";
import TitleScreen from "./screens/TitleScreen.js";
import GameOverScreen from "./screens/GameOverScreen.js";

const game = new Game(427, 240, '#game');
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

function makeMosaic(width, height) { //totally stealing from deepnight here.
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    c.width = width * 3;
    c.height = height * 3;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0,0, c.width, c.height);
    for(var w = 0; w <= Const.GAMEWIDTH; w++){

        for(var h = 0; h <= Const.GAMEHEIGHT; h++){

            ctx.fillStyle = "#e0e0e0";
            ctx.fillRect(w*Const.SCALE, h*Const.SCALE, 2, 2);

            ctx.fillStyle = "#707070";
            ctx.fillRect(w*Const.SCALE, h*Const.SCALE + 2, 1, 1);

            ctx.fillStyle = "#f8f8f8";
            ctx.fillRect(w*Const.SCALE + 2, h*Const.SCALE, 1, 1);

        }
    }
    return {canvas: c, context: ctx};


} 

game.scene = new TitleScreen(game, controls, newGame);
game.run();