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
    {
      key: "tree",
      image: "assets/images/tree.png",
      audio: "assets/audio/arbol.mp3",
      word: "arbol",
      x: 400,
      y: 250,
      scale: 0.75,
    },
    {
      key: "house",
      image: "assets/images/house.png",
      audio: "assets/audio/casa.mp3",
      word: "casa",
      x: 550,
      y: 270,
      scale: 0.75,
    },
  ];

  this.sounds = {};

  this.currentQuestion = {};
};

gameScene.preload = function () {
  this.load.image("background", "assets/images/background-city.png");

  for (let i = 0; i < this.data.length; i++) {
    let item = this.data[i];
    this.load.image(item.key, item.image);
    this.load.audio(`${item.key}Audio`, item.audio);
  }

  this.load.audio(`correctAudio`, "assets/audio/correct.mp3");
  this.load.audio(`wrongAudio`, "assets/audio/wrong.mp3");
};

gameScene.create = function () {
  this.add.sprite(0, 0, "background").setOrigin(0, 0).setDepth(-10);
  this.text = this.add.text(10, 10, " ", {
    font: "24px Open Sans",
    color: "#ffffff",
  });

  this.correctAudio = this.sound.add("correctAudio");
  this.wrongAudio = this.sound.add("wrongAudio");

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

    sprite.itemData = { ...item };

    this.sounds[item.key] = this.sound.add(`${item.key}Audio`);

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

    sprite.on(
      "pointerdown",
      function () {
        if (this.checkAnswer(item)) {
          this.correctAudio.play();
          this.displayNextQuestion();
        } else {
          this.wrongAudio.play();
        }
      },
      this
    );

    this.items.add(sprite, true);
  }

  this.displayNextQuestion();
};

gameScene.checkAnswer = function (answer) {
  return answer.key === this.currentQuestion.key;
};

gameScene.displayNextQuestion = function () {
  const { itemData } = Phaser.Math.RND.pick(this.items.getChildren());

  this.text.setText(itemData.word);
  this.sounds[itemData.key].play();

  this.currentQuestion = { ...itemData };
};

gameScene.update = function () {};

const gameConfig = Object.assign(config, {
  scene: [gameScene],
});

const game = new Phaser.Game(gameConfig);
