function gObjectEnemyTr(scene, x, y){

  let sprite;
  this.gameobject;

  this.active = false;

  let mobs = scene.mobs;;
  let layer = scene.layer;;
  let blocks = scene.blocks;
  let effcts = scene.effcts;

  let BG = scene.maze.BG;

  let seffect;

  let growcount;

  let route;
  let routeresult;
  let stepCount;

  let nextr; 

  let gamemain;
  let tween;

  const WAIT = scene.GAMECONFIG.ENEMY.WAIT;

  this.create = ()=>{

    sprite = mobs.get(x, y, "enemy");
    sprite.setCollideWorldBounds(true);
    sprite.setSize(14,14);
    //sprite.setCircle(10);

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
    const fllist = scene.maze.blockposlist(BG.FLAG);
    //console.log("st FL"+fllist.length + "  BP"+bplist.length);

    //check flag area 5*5
    let cblist = [];
    if (fllist.length > 0){
      for (let i in bplist){
        if ((Math.abs(fllist[0].x - bplist[i].x)>3)||
        (Math.abs(fllist[0].y - bplist[i].y)>3)){
          cblist.push(bplist[i]);
        }
        //check func 5*5
      }
      //console.log("s FL"+fllist.length + " BL:"+cblist.length + "/" + bplist.length);
      for (let i in cblist){
        //effectbreak(cblist[i].x*16+8, cblist[i].y*16+8);
      }
    }
    if (cblist.length > 0){
      let num = Phaser.Math.Between(0, cblist.length-1);
      let bp = cblist[num];  
      layer.putTileAt(BG.FLOOR,bp.x,bp.y);
      sprite.x = bp.x*16+8;
      sprite.y = bp.y*16+8;
      effectbreak(sprite.x, sprite.y);
    }else{
      sprite.x = Phaser.Math.Between(1, BG.MAP_W-2)*16+8;
      sprite.y = Phaser.Math.Between(1, BG.MAP_H-2)*16+8;
    }
    sprite.setVisible(true);
    sprite.anims.play('popup_e',true);   
    growcount = -120;
    sprite.setVelocityX(0);
    sprite.setVelocityY(0);
    sprite.setVisible(true);
    //sprite.isCircle = true;
    sprite.clearTint();

    gamemain = scene.scene.get("GameMain");

    //gamemain.events.on("layerChange",()=>{
      //growcount  = -60;
      //routeresult = []; //routeReSearch
      //sprite.setVelocityX(0);
      //sprite.setVelocityY(0);
      
      //sprite.anims.play('down_e',true);  
    //});
    nextr = {x: Math.trunc((sprite.x+8)/16), y:Math.trunc((sprite.y+8)/16), vx:0, vy:0 };
    routeresult = [];
    //routeresult.push(nextr);
  }

  this.update = ()=>{

    if (!this.active) return;

    if ("deadstate" in sprite){
      if (!sprite.deadstate) return; 
      growcount = -120;
      //sprite.anims.play("kout_e");
      if ((Math.abs(sprite.body.velocity.x)<1)
        &&(Math.abs(sprite.body.velocity.y)<1)) {
        sprite.setVelocityX(0);
        sprite.setVelocityY(0);
        sprite.deadstate = false;
        //nextr = {x: sprite.x, y:sprite.y, vx:0, vy:0 };
        //routeresult = [];

        if (Boolean(tween))tween.stop();
        scene.timerOneShot = scene.time.delayedCall(3000, ()=>{
          delete sprite.deadstate;
          delete sprite.BONUSreceived; 
          sprite.setVisible(false);
          this.reborn();
          }, this
        );
      }
      return;
    }

    let mvmode = {type:false, vx:0, vy:0, push:false };
    let runmode = 0;

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

    //if (b1 && b2 && growcount > 0) 
    if (stepCount >15) 
    {
      routeresult = [];
      //growcount += WAIT;
      //console.log(b1);
    }
    if (!scene.maze.ready) return;
    if (growcount < WAIT){ growcount++; return; }else{
      //check
      let nextrouteget = false;
      if (routeresult.length < 1) {
        stepCount = 0;
        nextr = {x: Math.trunc((sprite.x+8)/16), y:Math.trunc((sprite.y+8)/16), vx:0, vy:0 };

        let target = {x:Math.trunc((scene.player.x)/16) ,y:Math.trunc(scene.player.y/16)}; 

        let bf = scene.maze.blockposlist(BG.FLAG);
        
        if (bf.length > 0){
          //FLAG DUMMY CHECK
          route[0].create(layer,
            {x:Math.trunc((sprite.x)/16),y:Math.trunc((sprite.y)/16)}
            ,{x:bf[0].x ,y:bf[0].y}
          );
          let w = route[0].result();
          
          if (w.length > 0){
            target = {x:bf[0].x ,y:bf[0].y}; 
          }
          /*
          if ((Math.abs(Math.trunc((sprite.x+8)/16) - bf[0].x)<2)&&
            (Math.abs(Math.trunc((sprite.y+8)/16) - bf[0].y)<2)){
              target = {x:bf[0].x ,y:bf[0].y}; console.log("near");
          }
          */
        }
        
        route[0].create(layer,
          {x:Math.trunc((sprite.x)/16),y:Math.trunc((sprite.y)/16)}
          ,{x:target.x ,y:target.y}
        );

        
        route[1].create(layer,
          {x:Math.trunc((sprite.x)/16),y:Math.trunc((sprite.y)/16)}
          ,{x:target.x ,y:target.y}
        );
        
        let wr = route[0].result(); //console.log("wr:"+wr.length);
        let wl = route[1].result(); //console.log("wl:"+wl.length);

        if (wr.length < wl.length) routeresult = wr; else routeresult = wl; 

        //routeresult = wr;

        //routeresult = route.result();
        //console.log(routeresult.length + " " + wr.length + "_" + wl.length
        //  + " " + Math.trunc(sprite.x/16) 
        //  + "," + Math.trunc(sprite.y/16)
        //);
        for (let i in routeresult){
          let r = routeresult[i];
          //effectbreak(r.x*16+8, r.y*16+8);
          runmode = 1;
        }
        nextrouteget = true;
      }
      //move
      if (routeresult.length > 0){
        nextr = routeresult.pop();
        //stepCount++;
        /*
        console.log(
          Object.entries(nextr) + " " + routeresult.length 
          + " " + Math.trunc(sprite.x/16) + "/" + nextr.x 
          + "," + Math.trunc(sprite.y/16) + "/" + nextr.y 
        );//w.x + " " + w.y);
        */

        let gt = layer.getTileAtWorldXY(nextr.x*16+8, nextr.y*16+8);
        let gt2 = layer.getTileAtWorldXY((nextr.x+nextr.vx)*16+8, (nextr.y+nextr.vy)*16+8);
        //console.log(gt2.index + " " + gt.index);
        if (gt.index != BG.FLOOR){
          runmode = 1;
          routeresult = [];
        }else{
          moveaction_tween=()=>{
          //if (routeresult.length >0){
            tween = scene.tweens.add({
              targets: sprite,
              x: nextr.x*16+8,
              y: nextr.y*16+8,
              ease: 'Quad',       // 'Linear','Cubic', 'Elastic', 'Bounce', 'Back'
              duration: 500,
              repeat: 0,            // -1: infinity
              yoyo: false
            });
            tween.play();
            sprite.tween = tween; 
          }

          moveaction_moveTo =()=>{  

            // if (gt_ud.index == BG.FLOOR && gt_lr.index == BG.FLOOR){//} && gt.index == BG.FLOOR){
              scene.physics.moveTo(
                sprite,
                (nextr.x + nextr.vx)*16+8,
                (nextr.y + nextr.vy)*16+8,
                40//,
                //maxtime
              );
            //}
          }
          //moveaction_tween();
          //if (!nextrouteget)
          moveaction_moveTo();
          //}
          //effectbreak(nextr.x*16+8, nextr.y*16+8);
          runmode = 1;
          
        }
        if (gt2.index == BG.FLAG) runmode=2;
        //console.log(gt2.index + " " + gt.index+" "+runmode);
        growcount = 0;
      }

      if (runmode != 0){
        inputc = {
          left:{isDown: (nextr.vx <0)?true:false},
          right:{isDown: (nextr.vx>0)?true:false},
          up:{isDown: (nextr.vy<0)?true:false},
          down:{isDown: (nextr.vy>0)?true:false},
          space:{isDown: (runmode == 2)?true:false}
        }
      }else{
              
        inputc = {
          left:{isDown: (Math.random()*10>3)?true:false},
          right:{isDown: (Math.random()*10>6)?true:false},
          up:{isDown: (Math.random()*10>3)?true:false},
          down:{isDown: (Math.random()*10>6)?true:false},
          space:{isDown: (Math.random()*10>8)?true:false}
        }
        growcount = 0;

      }
      //growcount = 0;
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

        if ((gt.index == BG.BLOCK)||(gt.index == BG.FLAG)){
          effectbreak(
            Math.trunc((sprite.x + mvmode.vx*10)/16)*16+8,
            Math.trunc((sprite.y + mvmode.vy*10)/16)*16+8
          );
          if (gt.index == BG.BLOCK) layer.putTileAtWorldXY(BG.FLOOR, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
          if (gt.index == BG.FLAG) {
            gamemain = scene.scene.get("GameMain");
            gamemain.events.emit("baseattack");
            growcount = -WAIT;
          }
        }
        //layer.putTileAtWorldXY(35, sprite.x + mvmode.vx*10, sprite.y + mvmode.vy*10);
        //}
      }
    }
    
    if (mvmode.type){
      if (runmode == 0){
        sprite.setVelocityX(mvmode.vx*30);
        sprite.setVelocityY(mvmode.vy*30);
      }
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



