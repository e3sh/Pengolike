class GameScene extends Phaser.Scene {
    constructor() {
      super({key:"GameMain", active:false});
    }

    maze;
    rf;

    player;   
    friends;
    blocks;
    mobs;

    layer;

    cursors;
    zkey;

    seffect;
    music;

    gText;

    stage;
    result;
    killcount;
    basehp;

    wave;
    mapchange;

    goverf;
    endwait;

    xtalblockerr;

    GAMECONFIG;

    preload() {}
 
    create() {
      //map create
      const MAP_W = 17;//17
      const MAP_H = 17;

      const BGBLOCK = 0;

      let level = [[]];
      //init 
      for (let i=0; i<MAP_H; i++){//y
        level[i] = [];
        for (let j=0; j<MAP_W; j++){//x
          level[i][j] = BGBLOCK;//Phaser.Math.Between(0,39);
        }
      }

      const map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
      const tiles = map.addTilesetImage("bgtiles");
      this.layer = map.createLayer(0, tiles, 0, 0);

      this.maze = new mazemake(this.layer, MAP_W, MAP_H);
      this.maze.init();

      //game object physics.sprite.body setup
      this.friends = this.physics.add.group();
      this.mobs = this.physics.add.group();
      this.blocks = this.physics.add.group();
      //this.blocks.create(100,100,"blocks");
      
      this.blocks.children.iterate(function(child){
        child.setScale(1);
        child.anims.play("break");
      });

      this.effcts = this.physics.add.group();

      const coldstart = true;//(this.events.listenerCount("gsColdStartComp")>0)?false:true;
      if (coldstart) {
        //BG collison
        this.layer.setCollisionBetween(0, 34, true, false, this.layer); 
        this.layer.setCollisionBetween(49,50, true, false, this.layer); 
        
        const blockstop = (p, b)=>{
          this.layer.putTileAtWorldXY(p.boxtype, p.x, p.y);
          this.seffect[1].play();
          p.destroy();
          this.events.emit("layerChange");
        }
        
        this.physics.add.collider(this.blocks, this.layer, blockstop, null, this);

      //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        const keyobj_z =  this.input.keyboard.addKey("Z");
        this.zkey = {push:false, lock:false};
        keyobj_z.on("down", ()=> {if (!this.zkey.lock) {this.zkey.push = true; this.zkey.lock = true; }}); 
        keyobj_z.on("up", ()=> { this.zkey.push = false;});

      // audio events
        this.seffect = [];

        this.seffect[0] = this.sound.add("push");
        this.seffect[1] = this.sound.add("pop");
        this.seffect[2] = this.sound.add("break");
        this.seffect[3] = this.sound.add("clear");
        this.seffect[4] = this.sound.add("use");
        this.seffect[5] = this.sound.add("get");
        this.seffect[6] = this.sound.add("bow");
        this.seffect[7] = this.sound.add("damage");
        this.seffect[8] = this.sound.add("miss");
        this.seffect[9] = this.sound.add("powup");

        this.music = this.sound.add("bgm");
      
        //camera setup
        this.cameras.main.zoom = 2.0;
        this.cameras.main.centerOn(132, 150);
      }
      //game running status
      this.rf = false;
      this.ft = 0;

      this.stage = 0;
      this.result = "...";

      this.wave = 1;
      this.mapchange = 0;

      //Game Moving Object setup
      this.wp = [];

      this.wp.push(new gObjectPlayer(this, 0,0));
      this.player = this.wp[0].gameobject;
      this.player.setSize(15,15);

      for (let i=0; i<1; i++){
        const w = new gObjectEnemyTr(this, 0, 0);
        w.gameobject.deadstate = true;
        w.BONUSreceived = true;
        w.gameobject.setVisible(false);
        this.wp.push(w);
      }

      //collision setting
      const hitenemy = (p, b)=>{
        if ("deadstate" in b){
          if (!("BONUSreceived" in b)) this.basehp++;
          b.x = 0;
          b.y = 0;
          b.setVisible(false);
          this.seffect[4].play();
          b.BONUSreceived = true;
          //console.log("!");
          return;    
        } 

        if ("invincible" in p) return;
        if ("pausestate" in p){
          if (p.pausestate) return;
        }
        if (!Boolean(p.pausestate)){
          p.anims.play("kout_p");
          this.seffect[6].play();
          this.basehp--;
        }
        p.pausestate = true;
        this.timerOneShot = this.time.delayedCall(300, ()=>{
            p.pausestate = false;
            p.invincible = true;
          }, this
        );

        this.timerOneShot = this.time.delayedCall(500, ()=>{
            delete p.invincible; 
          }, this
        );
      }

      if (coldstart){
        this.physics.add.collider(this.friends, this.mobs, hitenemy,null, this);
        //this.physics.add.overlap(this.friends, this.mobs, hitenemy,null, this);
        this.physics.add.collider(this.friends, this.layer);
        this.physics.add.collider(this.friends, this.blocks);;

        this.physics.add.collider(this.mobs, this.mobs);
        this.physics.add.collider(this.mobs, this.layer);
      }
      const hitblock = (p, b)=>{
        if (!('deadstate' in p)){
          p.setTint("0xff7f7f");
          this.killcount++;
          p.deadstate = true;
          if ("tween" in p) p.tween.stop();
          p.setVelocityX(b.body.velocity.x);
          p.setVelocityY(b.body.velocity.y);
          
          
          this.timerOneShot = this.time.delayedCall(500, ()=>{
            const tween = this.tweens.add({
              targets: p,
              x: b.x,
              y: b.y,
              ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
              duration: 100,
              repeat: 0,            // -1: infinity
              yoyo: false
            });
            tween.play();
            
          }, this
          );
          
          p.anims.play("kout_e");
        }
      }

      if (coldstart){
        this.physics.add.overlap(this.mobs, this.blocks, hitblock, null, this);

        //[SCROLL config]
        //this.cameras.main.startFollow(this.player);
        //
        this.scene.launch("UI");
        this.scene.launch("Debug");

        this.events.on("baseattack",()=>{
          this.basehp--;
          this.seffect[7].play();
          if (this.basehp<=0){
            let bf = this.maze.blockposlist(this.maze.BG.FLAG);
            if (bf.length >0){
              this.layer.putTileAt(this.maze.BG.BFLAG, bf[0].x, bf[0].y);
            }
          }
        });
        this.events.on("shutdown", ()=>{
          //this.events.removeAllListeners(); //NG

          this.events.removeListener("baseattack");
          this.events.removeListener("shutdown");
        });
      }
      //this.events.on("gsColdStartComp",()=>{},this);
      //
      this.GAMECONFIG = {
        INITALHP:3, //GameStartHP
        WAVEBONUS:0,//WaveChangeBonus
        XTALBONUS:5,//BoxLineBounus
        RESETCOST:30, //
      }

      this.killcount = 0;
      this.basehp = this.GAMECONFIG.INITALHP;

      this.goverf = false;

      //this.music.setVolume(0.6);
      this.music.play({volume:0.5, loop:true, rate:1.0});
      this.seffect[3].play();
    }

    ////======================
    update() {

      if (this.cursors.space.isDown){
        if (this.goverf && this.endwait){
          //Title Return;
          this.scene.stop("UI");
          this.scene.stop("Debug");
          this.scene.start("Title");//restart();
        }
      }

      for (let i in this.wp){this.wp[i].update();}
     
      //this.gText.setText(
      //  "STAGE:" + this.stage + " "
      //  +this.result
      //);
      
      if (this.maze.ready){
        if (!this.rf) {
          //this.seffect[3].play();
          //this.stage++;
          this.mapchange++;
          //this.killcount = 0;
          //this.basehp += 10;

          this.goverf = false;
          this.endwait = false;

          this.maze.draw(true);
          this.rf = true;
        
          const bplist  = this.maze.blockposlist();

          for (let i=0; i<3; i++){
            let num = Phaser.Math.Between(0, bplist.length-1);
            let bp = bplist[num];  
            this.layer.putTileAt(this.maze.BG.BONUS,bp.x,bp.y);
            let w = bplist.splice(num,1);//delete use block
            //console.log(num +"/" + bplist.length + " " + Object.entries(w[0]));
          }
          for (let i=0; i<this.mapchange; i++){
            let num = Phaser.Math.Between(0, bplist.length-1);
            if (num >= 0){    
              let bp = bplist[num];  
              this.layer.putTileAt(this.maze.BG.WALL,bp.x,bp.y);
              let w = bplist.splice(num,1);//delete use block
              //console.log(num +"/" + bplist.length + " " + Object.entries(w[0]));
            }
          }
          this.layer.putTileAt(this.maze.BG.FLAG, 9, 13);

          this.zkey.lock = false;

          for (let i in this.wp){this.wp[i].active = true;}

          let bb = this.maze.blockposlist(this.maze.BG.BONUS);
          if (bb.length < 3){ 
            this.xtalblockerr = true;
            this.events.emit("popupPG");
          }else{
            this.xtalblockerr = false;
            this.events.emit("eracePG");
          }
        }
      }else{        
        //map genarate anim drawing (maze ready == false)
        this.maze.draw(false);
        this.maze.step();this.maze.step();

        this.player.x = this.maze.MW/2*16+16;
        this.player.y = this.maze.MH/2*16+16;
        delete this.player.invincible;
        
        for (let i in this.wp){
          this.wp[i].active = false;
          if (i != 0){
            this.wp[i].gameobject.deadstate = true;
            this.wp[i].gameobject.setVisible(false);
            this.wp[i].gameobject.x = 0;
            this.wp[i].gameobject.y = 0;
          }
        }
      }
      
      if (this.rf){

        this.result = "";//(this.killcount)?"KILL:"+this.killcount:"";//" lx:" + count_x + " ly:" +count_y;

        if (this.wave*3 <= this.killcount){
          this.wave++;  
          this.basehp += this.GAMECONFIG.WAVEBONUS; //wave clear bonus
          this.killcount = 0;
          this.result = "NEXTWAVE";
          this.seffect[3].play();
          this.events.emit("wavec");
          //if (this.wave > 3){
            const w = new gObjectEnemyTr(this, 0, 0);
            w.gameobject.deadstate = true;
            w.BONUSreceived = true;
            w.gameobject.setVisible(false);
            w.active = true;
            this.wp.push(w);
          //}
          let rate = 1.0 + (0.3/20)*this.wave;
          this.music.setRate(rate);
        }

        const BG = this.maze.BG;
  
        let bb = this.maze.blockposlist(BG.BONUS);
        let bf = this.maze.blockposlist(BG.FLAG);
  
        if (bb.length >= 3){
          let wx,wy;
          //first Bonus Block Search
          FBBS_LABEL:
          for (let i=0; i<this.maze.MH; i++){
            for (let j=0; j<this.maze.MW; j++){
              let gt = this.layer.getTileAt( j ,i);
              if (gt.index == BG.BONUS){
                wx = j; wy = i;
                break FBBS_LABEL;
              }
            }
          }

          let count_x, count_y, countwork;
          count_x = 0; countwork = 0;
          for(let i=0; i<this.maze.MW; i++){
            let gt = this.layer.getTileAt( i, wy);
            if (gt.index == BG.BONUS){
              countwork++;
              if (count_x < countwork) count_x = countwork;
            } else countwork = 0;
          }

          count_y = 0; countwork = 0;
          for(let i=0; i<this.maze.MH; i++){
            let gt = this.layer.getTileAt(wx, i);
            if (gt.index == BG.BONUS){
              countwork++;
              if (count_y < countwork) count_y = countwork;
            } else countwork = 0;
          }
          //CLEAR CHECK
          this.result = (this.killcount)?"KILL:"+this.killcount:"";//" lx:" + count_x + " ly:" +count_y;
          if ((count_x >=3)||(count_y >=3)){
            this.player.anims.play('popup_p',true);
            this.seffect[9].play();
            this.result ="CLEAR";

            this.basehp += this.GAMECONFIG.XTALBONUS;//bonus

            this.maze.init();
            this.rf = false;
            //this.events.emit("clear");
          }
        }

        if (this.zkey.push){
          if (this.xtalblockerr) {
            this.basehp += this.GAMECONFIG.RESETCOST;
            this.events.emit("eracePG");
            this.xtalblockerr = false;
          }
          if (this.basehp > this.GAMECONFIG.RESETCOST) {
            this.basehp -= this.GAMECONFIG.RESETCOST;
            this.player.anims.play('popup_p',true);
            this.seffect[2].play();
            this.result ="RESET";
            this.maze.init();
            this.rf = false;
            //this.stage--;
            //this.events.emit("clear");
            //console.log("z  --");
          }else{
            this.zkey.lock = false;
          }
        }

        if (this.basehp <= 0){
          this.basehp = 0;
          this.result ="GAMEOVER";

          if (!this.goverf){
            this.wp[0].active = false;
            this.player.anims.play("kout_p");
            this.seffect[8].play();
            this.player.invincible = true;

            this.music.stop();

            this.events.emit("gameover");

            this.timerOneShot = this.time.delayedCall(3000, ()=>{
            for (let i in this.wp){
                this.wp[i].active = false;
              }
              this.events.emit("retTitle");
              this.endwait = true;
            }, this
          );
          this.goverf = true;
          } else {
            this.player.invincible = true;
          }
          //this.events.emit("clear");
        }

        if (this.rf){
          //this.result += " F:" + bf.length;
        }

      }
    }
}
