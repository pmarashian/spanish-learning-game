import Phaser from 'phaser'

import config from './config'

const gameConfig = Object.assign(config, {
  scene: []
});

class Game extends Phaser.Game {
  constructor () {
    super(gameConfig)
  }
}

window.game = new Game();
