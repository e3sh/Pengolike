function gObjectPlayer(scene, x, y){

  let sprite;
  this.gameobject;

  let inputc;

  let mobs = scene.mobs;;
  let layer = scene.layer;;
  let blocks = scene.blocks;

  let BG = scene.maze.BG;

  let seffect;

  this.create = ()=>{

    sprite = mobs.get(x, y, "player");
    sprite.setCollideWorldBounds(true);
    sprite.setScale(1);

    this.gameobject = sprite;

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
      frameRate: 4, repeat: -1
    });
    
    sprite.anims.play('popup_p',true);   

    scene.physics.add.collider(mobs, mobs);
    scene.physics.add.collider(mobs, layer);
    scene.physics.add.collider(mobs, blocks);

    inputc = scene.input.keyboard.createCursorKeys();

    seffect = scene.seffect;
  }

  this.update = ()=>{

    let mvmode = {type:false, vx:0, vy:0, push:false };

    if (inputc.left.isDown){
      mvmode.anim = 'left_p';
      mvmode.type = true;
      mvmode.vx =-1;
    }
    if (inputc.right.isDown){
      mvmode.anim = 'right_p';
      mvmode.type = true;
      mvmode.vx =1;
    }
    if (inputc.up.isDown){
      mvmode.anim = 'up_p';
      mvmode.type = true;
      mvmode.vy =-1;
    }
    if (inputc.down.isDown){
      mvmode.anim = 'down_p';
      mvmode.type = true;
      mvmode.vy =1;
    }

    //if (false){
    if (inputc.space.isDown){
      mvmode.push = true;
      if (mvmode.type){
        let gt = layer.getTileAtWorldXY(
          sprite.x + mvmode.vx*10, 
          sprite.y + mvmode.vy*10
        );
        if ((gt.index == BG.BLOCK)||(gt.index == BG.BONUS)) {//0=BLUEWALL
          let gt2 = layer.getTileAtWorldXY(sprite.x + mvmode.vx*26, sprite.y + mvmode.vy*26);
          if (gt2.index == BG.FLOOR){
            //layer.putTileAtWorldXY(gt.index, sprite.x + mvmode.vx*26, sprite.y + mvmode.vy*26);
            let blocktype = gt.index;//次の行でtileを書き換えるので数値を保管する(Objectなのでgtでも参照される)
            layer.putTileAtWorldXY(BG.FLOOR, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
            let box = blocks.get(//create(
              Math.trunc((sprite.x + mvmode.vx*10)/16)*16+8,
              Math.trunc((sprite.y + mvmode.vy*10)/16)*16+8,"blocks"
            );

            box.setCollideWorldBounds(false);
            box.setScale(1);
            box.setPushable(true);
            if (blocktype==0) {box.anims.play("bbox");}else{box.anims.play("hbox");};
            box.setVelocityX(mvmode.vx*200);
            box.setVelocityY(mvmode.vy*200);
            box.boxtype = blocktype;

            seffect[0].play();
          }else{
            if (gt.index == BG.BLOCK){

              let box = blocks.get(//create(
              Math.trunc((sprite.x + mvmode.vx*10)/16)*16+8,
              Math.trunc((sprite.y + mvmode.vy*10)/16)*16+8,"blocks");
              box.setCollideWorldBounds(false);
              box.setScale(1);
              box.setPushable(false);
              box.anims.play("break");
              box.on(Phaser.Animations.Events.ANIMATION_COMPLETE, ()=>{
                //box.setVisible(false);
                //box.setActive(false);
                box.destroy();
              },this);
              seffect[2].play();
              layer.putTileAtWorldXY(BG.FLOOR, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
            }
          }
            //layer.putTileAtWorldXY(35, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
        }
      }
    }

    if (mvmode.type){
      sprite.setVelocityX(mvmode.vx*60);
      sprite.setVelocityY(mvmode.vy*60);
      if (Boolean(mvmode.anim)){
        sprite.anims.play((mvmode.push?'push_':'')+mvmode.anim, true);}
        
    }else{
        sprite.setVelocityX(0);
        sprite.setVelocityY(0);
    }
  }
} 

//function gObjectBlock(scene, x, y){}
//function gObjectEnemy(scene, x, y){}
//function gObjectMob(scene, x, y){}


