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

  const SPEED = scene.GAMECONFIG.PLAYER.SPEED;
  
  this.create = ()=>{

    sprite = friends.get(x, y, "player");
    sprite.setCollideWorldBounds(true);
    sprite.setScale(1);

    this.gameobject = sprite;
    sprite.anims.play('popup_p',true); 

    inputc = scene.scene.get("Input");

    seffect = scene.seffect;

    before_space = {flag:inputc.space, dur:inputc.duration.space};
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
    }
    if (inputc.right){
      mvmode.anim = 'right_p';
      mvmode.type = true;
      mvmode.vx =1;
    }
    if (inputc.up){
      mvmode.anim = 'up_p';
      mvmode.type = true;
      mvmode.vy =-1;
    }
    if (inputc.down){
      mvmode.anim = 'down_p';
      mvmode.type = true;
      mvmode.vy =1;
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

    if (inputc.space){
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

          if (inputc.zkey) {blockpull(); }else{ blockpushbreak();}
            //layer.putTileAtWorldXY(35, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
        }
      }
    }

    if (mvmode.type){
      sprite.setVelocityX(mvmode.vx*SPEED);
      sprite.setVelocityY(mvmode.vy*SPEED);
      if (Boolean(mvmode.anim)){
        sprite.anims.play((mvmode.push?'push_':'')+mvmode.anim, true);}
    }else{
        sprite.setVelocityX(0);
        sprite.setVelocityY(0);
    }
  }
} 


