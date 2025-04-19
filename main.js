"use strict";
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 500 },
            debug: false
        }
    },
    scene: [
        loadScene,
        inputScene,
        TitleScene,
        GameScene,
        uiScene,
        UIDebugScene
    ]
};

const  game = new Phaser.Game(config);
