import Phaser from "phaser";

import config from "./config";

const gameScene = new Phaser.Scene("Game");

gameScene.init = function () {
  this.data = [
    {
      key: "building",
      image: "assets/images/building.png",
      audio: "assets/audio/edificio.mp3",
      word: "edificio",
      x: 90,
      y: 250,
      scale: 1,
    },
    {
      key: "car",
      image: "assets/images/car.png",
      audio: "assets/audio/auto.mp3",
      word: "auto",
      x: 250,
      y: 300,
      scale: 1,
    },
  ];
};

gameScene.preload = function () {
  this.load.image("background", "assets/images/background-city.png");

  for (let i = 0; i < this.data.length; i++) {
    let item = this.data[i];
    this.load.image(item.key, item.image);
    this.load.audio(`${item.key}Audio`, item.audio);
  }
};

gameScene.create = function () {
  this.add.sprite(0, 0, "background").setOrigin(0, 0).setDepth(-10);

  this.items = this.add.group();
  for (let i = 0; i < this.data.length; i++) {
    let item = this.data[i];

    let sprite = new Phaser.GameObjects.Sprite(
      gameScene,
      item.x,
      item.y,
      item.key
    )
      .setScale(item.scale)
      .setInteractive();

    sprite.hoverOutTween = this.tweens.add({
      targets: sprite,
      duration: 100,
      paused: true,
      alpha: 1,
      scaleX: item.scale,
      scaleY: item.scale,
    });

    sprite.hoverTween = this.tweens.add({
      targets: sprite,
      duration: 300,
      alpha: 0.7,
      scaleX: item.scale * 1.15,
      scaleY: item.scale * 1.15,
      paused: true,
    });

    sprite.on("pointerover", function () {
      !sprite.hoverOutTween.paused && sprite.hoverOutTween.stop();
      sprite.hoverTween.play();
    });

    sprite.on("pointerout", function () {
      !sprite.hoverTween.paused && sprite.hoverTween.stop();
      sprite.hoverOutTween.play();
    });

    sprite.on("pointerdown", function () {});

    this.items.add(sprite, true);
  }
};

gameScene.update = function () {};

const gameConfig = Object.assign(config, {
  scene: [gameScene],
});

const game = new Phaser.Game(gameConfig);
