function gObjectEnemy(scene, x, y){

  let sprite;
  this.gameobject;

  let mobs = scene.mobs;;
  let layer = scene.layer;;
  let blocks = scene.blocks;

  let BG = scene.maze.BG;

  let seffect;

  let growcount;

  this.create = ()=>{

    sprite = mobs.get(x, y, "enemy");
    sprite.setCollideWorldBounds(true);
    sprite.setScale(1);

    this.gameobject = sprite;

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
      frameRate: 4, repeat: 0
    });
    
    sprite.anims.play('popup_e',true);   

    //scene.physics.add.collider(mobs, mobs);
    //scene.physics.add.collider(mobs, layer);
    //scene.physics.add.collider(mobs, blocks);

    growcount = 0;
  }

  this.update = ()=>{

    let mvmode = {type:false, vx:0, vy:0, push:false };

    let inputc = {
      left:{isDown: false},
      right:{isDown: false},
      up:{isDown: false},
      down:{isDown: false},
      space:{isDwon: false}
    }
    
    if (growcount < 60){ growcount++; return; }else{
      inputc = {
        left:{isDown: (Math.random()*10>5)?true:false},
        right:{isDown: (Math.random()*10>5)?true:false},
        up:{isDown: (Math.random()*10>5)?true:false},
        down:{isDown: (Math.random()*10>5)?true:false},
        space:{isDown: (Math.random()*10>8)?true:false}
      }
      growcount = 0;
    }

    if (inputc.left.isDown){
      mvmode.anim = 'left_e';
      mvmode.type = true;
      mvmode.vx =-1;
    }
    if (inputc.right.isDown){
      mvmode.anim = 'right_e';
      mvmode.type = true;
      mvmode.vx =1;
    }
    if (inputc.up.isDown){
      mvmode.anim = 'up_e';
      mvmode.type = true;
      mvmode.vy =-1;
    }
    if (inputc.down.isDown){
      mvmode.anim = 'down_e';
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

        if (!Boolean(gt)){
          let st =  "(" + sprite.x + "," + sprite.y +")"
          //console.log(gt + "/" + sprite + "/" + sprite.x + "," + sprite.y);
          sprite.x = Phaser.Math.Between(1, BG.MAP_W-2)*16+8;
          sprite.y = Phaser.Math.Between(1, BG.MAP_H-2)*16+8; 
          sprite.anims.play('popup_e',true);   
          growcount = 0;
          sprite.setVelocityX(0);
          sprite.setVelocityY(0);
  
          //console.log("reset sp "+ st + sprite.x + "," + sprite.y);
          return;
        }

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
            //seffect[0].play();
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
              //seffect[2].play();
              layer.putTileAtWorldXY(BG.FLOOR, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
            }
          }
            //layer.putTileAtWorldXY(35, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
        }
      }
    }
    
    if (mvmode.type){

      sprite.setVelocityX(mvmode.vx*30);
      sprite.setVelocityY(mvmode.vy*30);
      if (Boolean(mvmode.anim)){
        sprite.anims.play((mvmode.push?'push_':'')+mvmode.anim, true);}
        
    }else{
        //sprite.setVelocityX(0);
        //sprite.setVelocityY(0);
    }
  }
} 



