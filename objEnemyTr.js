function gObjectEnemyTr(scene, x, y){

  let sprite;
  this.gameobject;

  let mobs = scene.mobs;;
  let layer = scene.layer;;
  let blocks = scene.blocks;
  let effcts = scene.effcts;

  let BG = scene.maze.BG;

  let seffect;

  let growcount;

  let route;
  let routeresult;

  let nextr; 

  let gamemain;

  this.create = ()=>{

    sprite = mobs.get(x, y, "enemy");
    sprite.setCollideWorldBounds(true);
    sprite.setSize(14,14);

    this.gameobject = sprite;
    sprite.anims.play('popup_e',true);   

    growcount = 0;

    route = [];
    route[0] = new routecheck(scene.maze,0);
    route[1] = new routecheck(scene.maze,1);

    routeresult = [];
  }
  this.create();

  this.reborn = ()=>{
    //console.log("reborn" + sprite.x + "," + sprite.y);
    const bplist  = scene.maze.blockposlist();

    if (bplist.length > 0){
      let num = Phaser.Math.Between(0, bplist.length-1);
      let bp = bplist[num];  
      layer.putTileAt(BG.FLOOR,bp.x,bp.y);
      sprite.x = bp.x*16+8;
      sprite.y = bp.y*16+8;
      effectbreak(sprite.x, sprite.y);
    }else{
      sprite.x = Phaser.Math.Between(1, BG.MAP_W-2)*16+8;
      sprite.y = Phaser.Math.Between(1, BG.MAP_H-2)*16+8;
    }
    sprite.anims.play('popup_e',true);   
    growcount = -120;
    sprite.setVelocityX(0);
    sprite.setVelocityY(0);
    sprite.setVisible(true);
    //sprite.isCircle = true;
    sprite.clearTint();

    gamemain = scene.scene.get("GameMain");

    gamemain.events.on("layerChange",()=>{
      growcount  = -60;
      routeresult = []; //routeReSearch
      //sprite.setVelocityX(0);
      //sprite.setVelocityY(0);
      
      //sprite.anims.play('down_e',true);  
    });
    nextr = {x: sprite.x, y:sprite.y, vx:0, vy:0 };
    routeresult = [];
  }

  this.update = ()=>{

    if ("deadstate" in sprite){
      if (!sprite.deadstate) return; 
      growcount = -120;
      //sprite.anims.play("kout_e");
      if ((Math.abs(sprite.body.velocity.x)<1)
        &&(Math.abs(sprite.body.velocity.y)<1)) {
        sprite.setVelocityX(0);
        sprite.setVelocityY(0);
        sprite.deadstate = false;
        scene.timerOneShot = scene.time.delayedCall(3000, ()=>{
          delete sprite.deadstate;
          this.reborn();
          }, this
        );
      }
      return;
    }

    let mvmode = {type:false, vx:0, vy:0, push:false };

    let inputc = {
      left:{isDown: false},
      right:{isDown: false},
      up:{isDown: false},
      down:{isDown: false},
      space:{isDwon: false}
    }
    
    let b1 = ((Math.trunc((sprite.x+8)/16) == nextr.x+nextr.vx)&&
      (Math.trunc((sprite.y+8)/16) == nextr.x+nextr.vy));

    let b2 = ((Math.abs(sprite.body.velocity.x)<1)&&
      (Math.abs(sprite.body.velocity.y)<1));
    //b2 = true;

    if (b1 && b2 && growcount > 0) 
    {
      growcount +=60;
      //console.log(b1);
    }
    if (!scene.maze.ready) return;
    if (growcount < 30){ growcount++; return; }else{
      if (routeresult.length < 1) {
        route[0].create(layer,
          {x:Math.trunc((sprite.x)/16),y:Math.trunc((sprite.y)/16)}
          ,{x:Math.trunc((scene.player.x)/16),y:Math.trunc(scene.player.y/16)}
        );

        route[1].create(layer,
          {x:Math.trunc((sprite.x)/16),y:Math.trunc((sprite.y)/16)}
          ,{x:Math.trunc(scene.player.x/16),y:Math.trunc(scene.player.y/16)}
        );

        let wr = route[0].result();
        let wl = route[1].result();

        if (wr.length < wl.length) routeresult = wr; else routeresult = wl; 

        //routeresult = route.result();
        //console.log(routeresult.length + " " + wr.length + "_" + wl.length
        //  + " " + Math.trunc(sprite.x/16) 
        //  + "," + Math.trunc(sprite.y/16)
        //);
        for (let i in routeresult){
          let r = routeresult[i];
          effectbreak(r.x*16+8, r.y*16+8);
        }
      }else{
        nextr = routeresult.pop();

        //console.log(
        //  Object.entries(nextr) + " " + routeresult.length 
        //  + " " + Math.trunc(sprite.x/16) + "/" + nextr.x 
        //  + "," + Math.trunc(sprite.y/16) + "/" + nextr.y 
        //);//w.x + " " + w.y);

        let gt = layer.getTileAtWorldXY(nextr.x*16+8, nextr.y*16+8);
        if (gt.index != BG.FLOOR){
          routeresult = [];
        }else{
          //sprite.setVelocityX(0);
          //sprite.setVelocityY(0);

          sprite.x = nextr.x*16+8;
          sprite.y = nextr.y*16+8;
          effectbreak(nextr.x*16+8, nextr.y*16+8);
        }
      }

      inputc = {
        left:{isDown: (nextr.vx <0)?true:false},
        right:{isDown: (nextr.vx>0)?true:false},
        up:{isDown: (nextr.vy<0)?true:false},
        down:{isDown: (nextr.vy>0)?true:false},
        space:{isDown: (Math.random()*10>99)?true:false}
      }
      /*      
      inputc = {
        left:{isDown: (Math.random()*10>3)?true:false},
        right:{isDown: (Math.random()*10>6)?true:false},
        up:{isDown: (Math.random()*10>3)?true:false},
        down:{isDown: (Math.random()*10>6)?true:false},
        space:{isDown: (Math.random()*10>8)?true:false}
      }
      */
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
          this.reborn();
          return;
        }

        if (gt.index == BG.BLOCK){
          effectbreak(
            Math.trunc((sprite.x + mvmode.vx*10)/16)*16+8,
            Math.trunc((sprite.y + mvmode.vy*10)/16)*16+8
          );
          layer.putTileAtWorldXY(BG.FLOOR, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
        }
        //layer.putTileAtWorldXY(35, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
        //}
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



