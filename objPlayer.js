function gObjectPlayer(scene, x, y){

  let sprite;
  this.gameobject;
  this.active = false;

  let inputc;
  let before_space

  let friends = scene.friends;
  let mobs = scene.mobs;
  let layer = scene.layer;
  let blocks = scene.blocks;
  let effcts = scene.effcts;

  let BG = scene.maze.BG;

  let seffect;

  let tween;
  let moveready;

  let before_pos;

  const SPEED = scene.GAMECONFIG.PLAYER.SPEED;
  
  this.create = ()=>{

    sprite = friends.get(x, y, "player");
    sprite.setCollideWorldBounds(true);

    //sprite.setScale(1);
    //sprite.setBodySize(12,12);
    sprite.setCircle(7, 2, 1);

    this.gameobject = sprite;
    sprite.anims.play('popup_p',true); 
     
    inputc = scene.scene.get("Input");

    seffect = scene.seffect;

    before_space = {flag:inputc.space, dur:inputc.duration.space};
    before_pos = {x:0, y:0, vx:0, vy:0, dur: 0};
  
    tween = scene.tweens.add({
      targets: sprite,
      x: sprite.x,
      y: sprite.y,
      ease: 'Linear',       // 'Linear','Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 100,
      repeat: 0,            // -1: infinity
      yoyo: false
    });
    tween.play();

    tween.on("complete",()=>{moveready = true;});
  }
  this.create();

  this.update = ()=>{
    if (!this.active) return;
    if (Boolean(this.gameobject.pausestate)) return;

    let mvmode = {type:false, vx:0, vy:0, push:false ,dur:0};

    if (inputc.left){
      mvmode.anim = 'left_p';
      mvmode.type = true;
      mvmode.vx =-1;
      mvmode.dur = inputc.duration.left;
    }
    if (inputc.right){
      mvmode.anim = 'right_p';
      mvmode.type = true;
      mvmode.vx =1;
      mvmode.dur = inputc.duration.right;
    }
    if (inputc.up){
      mvmode.anim = 'up_p';
      mvmode.type = true;
      mvmode.vy =-1;
      mvmode.dur = inputc.duration.up;
    }
    if (inputc.down){
      mvmode.anim = 'down_p';
      mvmode.type = true;
      mvmode.vy =1;
      mvmode.dur = inputc.duration.down;
    }

    //let b2 = ((Math.abs(sprite.body.velocity.x)<1)&&(Math.abs(sprite.body.velocity.y)<1));

    let blockoperation = false;
    let throwmode = false;
    if (inputc.space !== before_space.flag){//countstart
      if (!inputc.space) {
        blockoperation = true;
        throwmode = (before_space.dur > 1000)?true:false;
      }else{
        mvmode.push = true;
      }
    }
    before_space = {flag:inputc.space, dur:inputc.duration.space};

    if (inputc.space || inputc.xkey){
      mvmode.push = true;
      if (mvmode.type){
        let gt = layer.getTileAtWorldXY(
          sprite.x + mvmode.vx*10, 
          sprite.y + mvmode.vy*10
        );
        
        if ((gt.index == BG.BLOCK)||(gt.index == BG.BONUS)||(gt.index == BG.FLAG)) {//0=BLUEWALL

          blockpushbreak=()=>{
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
              if (blocktype==BG.BLOCK) {
                box.anims.play("bbox");
              }else{
                if (blocktype==BG.BONUS) box.anims.play("hbox");
                if (blocktype==BG.FLAG ) box.anims.play("flag");
              };
              box.setVelocityX(mvmode.vx*300);
              box.setVelocityY(mvmode.vy*300);
              box.boxtype = blocktype;

              seffect[0].play();
            
            }else{
              if (gt.index == BG.BLOCK){

                let box = effcts.get(//create(
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
          }

          blockpull=()=>{
            let blocktype = gt.index;
            layer.putTileAtWorldXY(BG.FLOOR, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
            let box = blocks.get(//create(
              Math.trunc((sprite.x + mvmode.vx*10)/16)*16+8,
              Math.trunc((sprite.y + mvmode.vy*10)/16)*16+8,"blocks"
            );

            box.setCollideWorldBounds(false);
            box.setScale(1);
            box.setPushable(true);
            if (blocktype==BG.BLOCK) {
              box.anims.play("bbox");
            }else{
              if (blocktype==BG.BONUS) box.anims.play("hbox");
              if (blocktype==BG.FLAG ) box.anims.play("flag");
            };
            box.setVelocityX(-mvmode.vx*300);
            box.setVelocityY(-mvmode.vy*300);
            box.boxtype = blocktype;

            //sprite.setVelocityX(-mvmode.vx*300);
            //sprite.setVelocityY(-mvmode.vy*300);

            seffect[0].play();
          }

          if (inputc.space) blockpushbreak();
          if (inputc.xkey) blockpull(); 
          mvmode.type = 0;
            //layer.putTileAtWorldXY(35, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
        }
      }
    }

    if (mvmode.type){
      let gt_ud = layer.getTileAtWorldXY(
        sprite.x, 
        sprite.y + mvmode.vy*10
      );

      let gt_lr = layer.getTileAtWorldXY(
        sprite.x + mvmode.vx*10, 
        sprite.y
      );

      let gt = layer.getTileAtWorldXY(
        sprite.x + mvmode.vx*10, 
        sprite.y + mvmode.vy*10
      );



      if (gt_ud.index == BG.FLOOR && gt_lr.index == BG.FLOOR && gt.index == BG.FLOOR){
       //console.log(mvmode.vx + "," + mvmode.vy + ":" + moveready);

        if (moveready){
 
          tween = scene.tweens.add({
            targets: sprite,
            x: (Math.trunc((sprite.x+7)/16)+mvmode.vx)*16+7,
            y: (Math.trunc((sprite.y+7)/16)+mvmode.vy)*16+7,
            ease: 'Linear',       // 'Linear','Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 200,
            repeat: 0,            // -1: infinity
            yoyo: false
          });
          tween.play();
          tween.on("complete",()=>{moveready = true;});
          
          moveready = false;
          /*
          effectbreak(
            (Math.trunc((sprite.x+7)/16)+mvmode.vx)*16+7
            ,(Math.trunc((sprite.y+7)/16)+mvmode.vy)*16+7
          );
          */
        }
      }
      //if (tween.ANIMATION_COMPLETE){
      /*
      if (mvmode.dur<30){
        sprite.setVelocityX(mvmode.vx*(SPEED/1.5));
        sprite.setVelocityY(mvmode.vy*(SPEED/1.5));
      }else{
        sprite.setVelocityX(mvmode.vx*SPEED);
        sprite.setVelocityY(mvmode.vy*SPEED);
      }
      */
      /*
      if (mvmode.dur<30){
        if (mvmode.vx != 0) sprite.setVelocityX(mvmode.vx*(SPEED/3));
        if (mvmode.vy != 0) sprite.setVelocityY(mvmode.vy*(SPEED/3));
      }else{
        if (mvmode.vx != 0) sprite.setVelocityX(mvmode.vx*SPEED);
        if (mvmode.vy != 0) sprite.setVelocityY(mvmode.vy*SPEED);
      }
      */        
      if (Boolean(mvmode.anim)){
        sprite.anims.play((mvmode.push?'push_':'')+mvmode.anim, true);}
    }else{
      //sprite.setVelocityX(sprite.body.velocity.x*0.1);
      //sprite.setVelocityY(sprite.body.velocity.y*0.1);
      //before_pos.vx = sprite.body.velocity.x; 
      //before_pos.vy = sprite.body.velocity.y; 
      //if (Math.trunc((sprite.x-7))%16 <2 ) sprite.setVelocityX(0);
      //if (Math.trunc((sprite.y-7))%16 <2 ) sprite.setVelocityY(0);
        //sprite.setVelocityX(0);
        //sprite.setVelocityY(0);
      
    }
  }

  function effectbreak(x,y){
    let box = effcts.get(x, y,"blocks");
      box.setCollideWorldBounds(false);
      box.setScale(1);
      box.setPushable(false);
      box.anims.play("break");
      box.on(Phaser.Animations.Events.ANIMATION_COMPLETE, ()=>{
        box.destroy();
    },this);
  }
} 


