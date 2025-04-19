function setupAnims(scene){

    //if (scene.events.listenerCount("AnimSupComp")>0) return;
    
    //PLAYER
    scene.anims.create({ key: 'left_p',
        frames: scene.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'right_p',
        frames: scene.anims.generateFrameNumbers('player', { start: 6, end: 7 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'up_p',
        frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'down_p',
        frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'push_left_p',
        frames: scene.anims.generateFrameNumbers('player', { start: 10, end: 11 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'push_right_p',
        frames: scene.anims.generateFrameNumbers('player', { start: 14, end: 15 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'push_up_p',
        frames: scene.anims.generateFrameNumbers('player', { start: 12, end: 13 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'push_down_p',
        frames: scene.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'popup_p',
        frames: scene.anims.generateFrameNumbers('player', { start: 28, end: 29 }),
        frameRate: 3, repeat: -1
    });
    scene.anims.create({ key: 'kout_p',
        frames: scene.anims.generateFrameNumbers('player', { start: 16, end: 17 }),
        frameRate: 4, repeat: -1
    });
    scene.anims.create({ key: 'ship_p',
        frames: scene.anims.generateFrameNumbers('player', { start: 20, end: 21 }),
        frameRate: 6, repeat: -1
    });

    //ENEMY
    scene.anims.create({ key: 'left_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 10, end: 11 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'right_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 14, end: 15 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'up_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 12, end: 13 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'down_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 8, end: 9 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'push_left_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 18, end: 19 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'push_right_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 22, end: 23 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'push_up_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 20, end: 21 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'push_down_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 16, end: 17 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'press_left_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 34, end: 35 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'press_right_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 38, end: 39 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'press_up_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 36, end: 37 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'press_down_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 32, end: 33 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'popup_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 0, end: 5 }),
        frameRate: 3, repeat: 0
    });
    scene.anims.create({ key: 'kout_e',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 6, end: 7 }),
        frameRate: 4, repeat: -1
    });

    //BLOCKS
    scene.anims.create({ key: 'bbox',
        frames: scene.anims.generateFrameNumbers('blocks', { start: 0, end: 0 }),
        frameRate: 1, repeat: -1
    });
    scene.anims.create({ key: 'break',
        frames: scene.anims.generateFrameNumbers('blocks', { start: 27, end: 35 }),
        frameRate: 8, repeat: 0
    });
    scene.anims.create({ key: 'hbox',
        frames: scene.anims.generateFrameNumbers('blocks', { start: 10, end: 19 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'hboxt',
        frames: scene.anims.generateFrameNumbers('blocks', { start: 10, end: 10 }),
        frameRate: 8, repeat: -1
    });
    scene.anims.create({ key: 'flag',
        frames: scene.anims.generateFrameNumbers('blocks', { start: 49, end: 49 }),
        frameRate: 8, repeat: -1
    });

    scene.anims.create({ key: 'ball',
        frames: scene.anims.generateFrameNumbers('blocks', { start: 37, end: 37 }),
        frameRate: 8, repeat: -1
    });

    //scene.events.on("AnimSupComp",()=>{},this);

}