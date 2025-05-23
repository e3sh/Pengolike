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

  let overfielderr

  let before_pos;

  const SPEED = scene.GAMECONFIG.PLAYER.SPEED;
  
  this.create = ()=>{

    sprite = friends.get(x, y, "player");
    sprite.setCollideWorldBounds(true);

    //sprite.setScale(1);
    sprite.setBodySize(15,15);
    //sprite.setCircle(7, 2, 1);

    this.gameobject = sprite;
    sprite.anims.play('popup_p',true); 
     
    inputc = scene.scene.get("Input");

    seffect = scene.seffect;

    before_space = {flag:inputc.space, dur:inputc.duration.space};
    before_pos = [];// {x:0, y:0, vx:0, vy:0, dur: 0};
  
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

    if ((inputc.left)||(inputc.right)||(inputc.up)||(inputc.down)){
      //before_pos.vx = mvmode.vx;
      //before_pos.vy = mvmode.vy;
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
              scene.toptile.removeTileAtWorldXY(sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10 -3);
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
                effectbreak(
                  Math.trunc((sprite.x + mvmode.vx*10)/16)*16+8,
                  Math.trunc((sprite.y + mvmode.vy*10)/16)*16+8
                );
                seffect[2].play();
                layer.putTileAtWorldXY(BG.FLOOR, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
                scene.toptile.removeTileAtWorldXY(sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10 -3);
              }
            }
          }

          blockpull=()=>{
            let blocktype = gt.index;
            layer.putTileAtWorldXY(BG.FLOOR, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
            scene.toptile.removeTileAtWorldXY(sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10 -3);
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

      moveaction_tw =()=>{  
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

        if (!(Boolean(gt_ud)&& Boolean(gt_lr) && Boolean(gt))) return; //err overrun
        if (!(("index" in gt_ud)&&("index" in gt_lr)&&("index" in gt))) return; //err overrun

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
      }

      moveaction_moveTo =()=>{  
        //Cornrt ajust
        
        let avx = 0;
        let avy = 0;

        let w = {vx:0, vy:0};

        before_pos.push({vx :mvmode.vx, vy:mvmode.vy});
        if (before_pos.length > 8){
          let st = "";
          for (let i in before_pos){
            st += before_pos[i].vx + ",";
          }
          st += "|";
          for (let i in before_pos){
            st += before_pos[i].vy + ",";
          }
          //console.log(st);
          w = before_pos.shift();
        }
        
        if (w.vx != mvmode.vx && w.vy != mvmode.vy){

          let cnx = w.vx + mvmode.vx;
          let cny = w.vy + mvmode.vy;

          if (Math.abs(cnx) == 1 && Math.abs(cny) == 1){
            avx = w.vx*16;
            avy = w.vy*16;
            //scene.infolayer.putTileAt(Phaser.Math.Between(1,90),Math.trunc(sprite.x/16),Math.trunc(sprite.y/16));
          }
          //}
          //console.log(w.vx +","+ w.vy + ",c:"+ cnx +","+cny+",a:"+avx+","+avy);
        }

        scene.physics.moveTo(
          sprite,
          sprite.x + mvmode.vx*16 + avx,//(Math.trunc((sprite.x+6)/16)+mvmode.vx)*16+8,
          sprite.y + mvmode.vy*16 + avy,//(Math.trunc((sprite.y+6)/16)+mvmode.vy)*16+8,
          SPEED//,
          //maxtime
        );
        //}
      }

      moveaction_slip =()=>{
        let gt = layer.getTileAtWorldXY(
          sprite.x + mvmode.vx*10, 
          sprite.y + mvmode.vy*10
        );

        let vx = 0;
        let vy = 0;

        if ((mvmode.vx != 0)&&(mvmode.vy == 0)){

            let gt_u = layer.getTileAtWorldXY(
            sprite.x + mvmode.vx*10, 
            sprite.y ,
          );

          let gt_d = layer.getTileAtWorldXY(
            sprite.x + mvmode.vx*10, 
            sprite.y + 15
          );

          //if ((gt != BG.FLOOR)) mvmode.vx = 0; 

          if ((gt_u == BG.FLOOR) && (gt_d != BG.FLOOR)) vy = -1; 
          if ((gt_u != BG.FLOOR) && (gt_d == BG.FLOOR)) vy = 1;
        }  

        if ((mvmode.vx == 0)&&(mvmode.vy != 0)){

          let gt_l = layer.getTileAtWorldXY(
            sprite.x  , 
            sprite.y + mvmode.vy*10
          );

          let gt_r = layer.getTileAtWorldXY(
            sprite.x + 15, 
            sprite.y + mvmode.vy*10
          );

          //if ((gt != BG.FLOOR)) mvmode.vy = 0; 

          if ((gt_l == BG.FLOOR) && (gt_r != BG.FLOOR)) vx = -1; 
          if ((gt_l != BG.FLOOR) && (gt_r == BG.FLOOR)) vx = 1;
        }  
        
        if (vx != 0 || vy != 0){
          //sprite.setCircle(1);
          if (vx != 0) sprite.setVelocityX((vx)*SPEED);
          if (vy != 0) sprite.setVelocityY((vy)*SPEED);
        }
      }  
      
      moveaction_normal =()=>{
        if (mvmode.dur<150){
          if (mvmode.vx != 0) sprite.setVelocityX(mvmode.vx*(SPEED));
          if (mvmode.vy != 0) sprite.setVelocityY(mvmode.vy*(SPEED));
        }else{
          sprite.setVelocityX(mvmode.vx*SPEED);
          sprite.setVelocityY(mvmode.vy*SPEED);
        }
      }
 
      //moveaction_tw();
      //moveaction_moveTo();
      //moveaction_slip();
      moveaction_normal();
 
      if (Boolean(mvmode.anim)){
        sprite.anims.play((mvmode.push?'push_':'')+mvmode.anim, true);}
    }else{
      //sprite.setVelocityX(sprite.body.velocity.x*0.1);
      //sprite.setVelocityY(sprite.body.velocity.y*0.1);
      //before_pos.vx = sprite.body.velocity.x; 
      //before_pos.vy = sprite.body.velocity.y; 
      //if (Math.trunc((sprite.x-7))%16 <2 ) sprite.setVelocityX(0);
      //if (Math.trunc((sprite.y-7))%16 <2 ) sprite.setVelocityY(0);
      
      if (mvmode.dur == 0){
        sprite.setVelocityX(0);
        sprite.setVelocityY(0);
      }
      
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


