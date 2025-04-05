class GameScene extends Phaser.Scene {
    constructor() {
      super({key:"GameMain", active:false});
    }

    maze;
    rf;

    player;
    blocks;
    mobs;

    layer;

    cursors;

    seffect;

    gText;

    stage;
    result;

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

      this.gText = this.add.bitmapText(0, 16*MAP_H, 'font', 'PHASER 3');
      this.gText.setScale(1);

      //
      this.mobs = this.physics.add.group();

      this.anims.create({ key: 'bbox',
        frames: this.anims.generateFrameNumbers('blocks', { start: 0, end: 0 }),
        frameRate: 1, repeat: -1
      });
      this.anims.create({ key: 'break',
        frames: this.anims.generateFrameNumbers('blocks', { start: 27, end: 35 }),
        frameRate: 8, repeat: 0
      });
      this.anims.create({ key: 'hbox',
        frames: this.anims.generateFrameNumbers('blocks', { start: 10, end: 19 }),
        frameRate: 8, repeat: -1
      });
      

      this.blocks = this.physics.add.group();
      //this.blocks.create(100,100,"blocks");
      
      this.blocks.children.iterate(function(child){
        child.setScale(1);
        child.anims.play("break");
      });

      this.layer.setCollisionBetween(0, 34, true, false, this.layer); 
      
      const blockstop = (p, b)=>{
        this.layer.putTileAtWorldXY(p.boxtype, p.x, p.y);
        this.seffect[1].play();
        p.destroy();
      }
      
      this.physics.add.collider(this.blocks, this.layer, blockstop, null, this);

     //  Input Events
     this.cursors = this.input.keyboard.createCursorKeys();

     // audio events
     this.seffect = [];

     this.seffect[0] = this.sound.add("push");
     this.seffect[1] = this.sound.add("pop");
     this.seffect[2] = this.sound.add("break");
     this.seffect[3] = this.sound.add("clear");

      this.rf = false;
      this.ft = 0;
     
      this.cameras.main.zoom = 2.0;
      this.cameras.main.centerOn(132, 150);

      this.stage = 0;
      this.result = "...";

      this.wp = [];
      for (let i=0; i<1; i++){
        const w = new gObjectPlayer(this, 
          Phaser.Math.Between(1, this.maze.MW-2)*16+8, 
          Phaser.Math.Between(1, this.maze.MH-2)*16+8
        );
        w.create();
        this.wp.push(w);
      }
      this.player = this.wp[0].gameobject;

      for (let i=0; i<10; i++){
        const w = new gObjectEnemy(this, 
          Phaser.Math.Between(1, this.maze.MW-2)*16+8, 
          Phaser.Math.Between(1, this.maze.MH-2)*16+8
        );
        w.create();
        this.wp.push(w);
      }

      this.scene.launch("Debug");
    }
  
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

          this.maze.draw(true);
          this.rf = true;
        
          let c=0;
          while (c<3){
            let wx = Phaser.Math.Between(1,(this.maze.MW-3)/2)*2;
            let wy = Phaser.Math.Between(1,(this.maze.MH-3)/2)*2;

            let t = this.layer.getTileAt(wx,wy);
            console.log(wx + "," + wy);
            if (t.index==0){
              this.layer.putTileAt(this.maze.BG.BONUS,wx,wy);
              c++;

            }else{
              console.log("retry");
            }
          }
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
        this.result = "";//" lx:" + count_x + " ly:" +count_y;
        if ((count_x >=3)||(count_y >=3)){
          this.player.anims.play('popup_p',true);
          this.seffect[3].play();
          this.result ="CLEAR";
          this.maze.init();
          this.rf = false;
          this.events.emit("clear");
        }

      }
    }
}
