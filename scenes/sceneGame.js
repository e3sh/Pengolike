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

    gText;

    stage;
    result;
    killcount;

    preload() {
      this.load.image("bgtiles", "assets/Blocks.png");
      this.load.image('ascfont', 'assets/aschr.png');

      this.load.spritesheet('player', 'assets/Pengo.png', { frameWidth: 16, frameHeight: 16 });

      this.load.spritesheet('blocks', 'assets/Blocks.png', { frameWidth: 16, frameHeight: 16 });
      this.load.spritesheet('enemy', 'assets/Enemy.png', { frameWidth: 16, frameHeight: 16 });

      this.load.audio("push", ["assets/push.mp3"]);
      this.load.audio("pop", ["assets/pop.mp3"]);
      this.load.audio("break", ["assets/break.mp3"]);
      this.load.audio("clear", ["assets/clear.mp3"]);

      this.load.start();
    }
  
    ////======================
    create() {
      const config = {
        image: 'ascfont',
        width: 8,
        height: 8,
        offset: { x: 0, y: 128 },
        chars: Phaser.GameObjects.RetroFont.TEXT_SET1,
        charsPerRow: 16,
        spacing: { x: 0, y: 0 }
      };
      this.cache.bitmapFont.add('font', Phaser.GameObjects.RetroFont.Parse(this, config));
    
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

      //UI
      this.gText = this.add.bitmapText(0, 16*MAP_H, 'font', 'PHASER 3');
      this.gText.setScale(1);

      //sprite anime setup
      setupAnims( this );
      //

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

      //BG collison
      this.layer.setCollisionBetween(0, 34, true, false, this.layer); 
      
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
      keyobj_z.on("up", ()=> {this.zkey.push = false;});

     // audio events
      this.seffect = [];

      this.seffect[0] = this.sound.add("push");
      this.seffect[1] = this.sound.add("pop");
      this.seffect[2] = this.sound.add("break");
      this.seffect[3] = this.sound.add("clear");

      //game running status
      this.rf = false;
      this.ft = 0;
      
      //camera setup
      this.cameras.main.zoom = 2.0;
      this.cameras.main.centerOn(132, 150);

      //game running status
      this.rf = false;
      this.ft = 0;

      this.stage = 0;
      this.result = "...";

      //Game Moving Object setup
      this.wp = [];

      this.wp.push(new gObjectPlayer(this, 0,0));
      this.player = this.wp[0].gameobject;
      this.player.setSize(15,15);

      const w = new gObjectEnemyTr(this, 0, 0);
      w.gameobject.deadstate = true;
      w.gameobject.setVisible(false);
      this.wp.push(w);

      for (let i=0; i<3; i++){
        const w = new gObjectEnemy(this, 0, 0);
        w.gameobject.deadstate = true;
        w.gameobject.setVisible(false);
        this.wp.push(w);
      }

      //collision setting
      const hitenemy = (p, b)=>{
        p.anims.play("kout_p");
      }

      this.physics.add.overlap(this.friends, this.mobs, hitenemy,null, this);
      this.physics.add.collider(this.friends, this.layer);
      this.physics.add.collider(this.friends, this.blocks);;

      this.physics.add.collider(this.mobs, this.mobs);
      this.physics.add.collider(this.mobs, this.layer);

      const hitblock = (p, b)=>{
        if (!('deadstate' in p)){
          p.setTint("0xff7f7f");
          this.killcount++;
          p.deadstate = true;
          p.setVelocityX(b.body.velocity.x);
          p.setVelocityY(b.body.velocity.y);
          p.anims.play("kout_e");
        }
      }
      this.physics.add.overlap(this.mobs, this.blocks, hitblock, null, this);
      
      //[SCROLL config]
      //this.cameras.main.startFollow(this.player);
      //
      this.scene.launch("UI");
      this.scene.launch("Debug");
    }

    ////======================
    update() {

      for (let i in this.wp){this.wp[i].update();}
     
      this.gText.setText(
        "STAGE:" + this.stage + " "
        +this.result
      );
      
      if (this.maze.ready){
        if (!this.rf) {
          //this.seffect[3].play();
          this.stage++;
          this.killcount = 0;

          this.maze.draw(true);
          this.rf = true;
        
          const bplist  = this.maze.blockposlist();

          for (let i=0; i<3; i++){
            let num = Phaser.Math.Between(0, bplist.length-1);
            let bp = bplist[num];  
            this.layer.putTileAt(this.maze.BG.BONUS,bp.x,bp.y);
            let w = bplist.splice(num,1);
            //console.log(num +"/" + bplist.length + " " + Object.entries(w[0]));
          }
          this.zkey.lock = false;
        }
      }else{        
        //map genarate anim drawing (maze ready == false)
        this.maze.draw(false);
        this.maze.step();this.maze.step();

        this.player.x = this.maze.MW/2*16+16;
        this.player.y = this.maze.MH/2*16+16;
      }
      
      if (this.rf){
        const BGBONUS = 10;
        let wx,wy;

        //first Bonus Block Search
        FBBS_LABEL:
        for (let i=0; i<this.maze.MH; i++){
          for (let j=0; j<this.maze.MW; j++){
            let gt = this.layer.getTileAt( j ,i);
            if (gt.index == BGBONUS){
              wx = j; wy = i;
              break FBBS_LABEL;
            }
          }
        }

        let count_x, count_y, countwork;
        count_x = 0; countwork = 0;
        for(let i=0; i<this.maze.MW; i++){
          let gt = this.layer.getTileAt( i, wy);
          if (gt.index == BGBONUS){
            countwork++;
            if (count_x < countwork) count_x = countwork;
          } else countwork = 0;
        }

        count_y = 0; countwork = 0;
        for(let i=0; i<this.maze.MH; i++){
          let gt = this.layer.getTileAt(wx, i);
          if (gt.index == BGBONUS){
            countwork++;
            if (count_y < countwork) count_y = countwork;
          } else countwork = 0;
        }
        //CLEAR CHECK
        this.result = (this.killcount)?"KILL:"+this.killcount:"";//" lx:" + count_x + " ly:" +count_y;
        if ((count_x >=3)||(count_y >=3)){
          this.player.anims.play('popup_p',true);
          this.seffect[3].play();
          this.result ="CLEAR";
          this.maze.init();
          this.rf = false;
          this.events.emit("clear");
        }

        if (this.zkey.push){
          this.player.anims.play('popup_p',true);
          this.seffect[2].play();
          this.result ="RESET";
          this.maze.init();
          this.rf = false;
          this.stage--;
          this.events.emit("clear");
        }

      }
    }
}
