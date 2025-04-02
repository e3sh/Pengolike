class GameScene extends Phaser.Scene {
    constructor() {
      super({key:"GameMain", active:false});
    }

    maze;
    rf;
    ft;

    player;
    blocks;

    glayer;

    cursors;

    seffect;

    gText;
    debugText;

    stage;
    result;

    preload() {
      this.load.image("bgtiles", "asset/Blocks.png");
      this.load.image('ascfont', 'asset/aschr.png');

      this.load.spritesheet('player', 'asset/Pengo.png', { frameWidth: 16, frameHeight: 16 });
      this.load.spritesheet('blocks', 'asset/Blocks.png', { frameWidth: 16, frameHeight: 16 });

      this.load.audio("push", ["asset/push.mp3"]);
      this.load.audio("pop", ["asset/pop.mp3"]);
      this.load.audio("break", ["asset/break.mp3"]);
      this.load.audio("clear", ["asset/clear.mp3"]);

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
      //this.dynamic = this.add.bitmapText(0, 200, 'font', 'PHASER 3');
      //this.dynamic.setScale(1);
    
      const MAP_W = 17;//17
      const MAP_H = 17;

      const BGBLOCK = 0;
      const BGFLOOR = 35; 
      const BGWALL  = 7;

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
      const layer = map.createLayer(0, tiles, 0, 0);

      //flame draw
      /*
      for (let j=0; j<MAP_W; j++){//x
        layer.putTileAt(BGWALL,j, 0);
        layer.putTileAt(BGWALL,j,MAP_H-1);
        layer.putTileAt(BGWALL,0, j);
        layer.putTileAt(BGWALL,MAP_W-1,j);
        for (let i=1; i<MAP_W-1; i++) if (j!=MAP_H-1) layer.putTileAt(BGFLOOR, i, j);
      }
      */

      this.maze = new mazemake(layer, MAP_W, MAP_H);
      this.maze.init();

      this.debugText = this.add.text(0,17*MAP_H-8, "test",  { fontSize: '16px', fill: '#FFF' });
      this.debugText.setScale(0.8);

      this.gText = this.add.bitmapText(0, 16*MAP_H, 'font', 'PHASER 3');
      this.gText.setScale(1);

      //
      this.player = this.physics.add.sprite(MAP_W/2*16+16, MAP_H/2*16+16, 'player');
      this.player.setCollideWorldBounds(true);
      this.player.setScale(1);

      this.anims.create({ key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
        frameRate: 8, repeat: -1
      });
      this.anims.create({ key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 6, end: 7 }),
        frameRate: 8, repeat: -1
      });
      this.anims.create({ key: 'up',
        frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
        frameRate: 8, repeat: -1
      });
      this.anims.create({ key: 'down',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
        frameRate: 8, repeat: -1
      });
      this.anims.create({ key: 'push_left',
        frames: this.anims.generateFrameNumbers('player', { start: 10, end: 11 }),
        frameRate: 8, repeat: -1
      });
      this.anims.create({ key: 'push_right',
        frames: this.anims.generateFrameNumbers('player', { start: 14, end: 15 }),
        frameRate: 8, repeat: -1
      });
      this.anims.create({ key: 'push_up',
        frames: this.anims.generateFrameNumbers('player', { start: 12, end: 13 }),
        frameRate: 8, repeat: -1
      });
      this.anims.create({ key: 'push_down',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
        frameRate: 8, repeat: -1
      });
      this.anims.create({ key: 'popup',
        frames: this.anims.generateFrameNumbers('player', { start: 28, end: 29 }),
        frameRate: 4, repeat: -1
      });

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

      layer.setCollisionBetween(0, 34, true, false, layer); 

      this.physics.add.collider(this.player, layer);
      this.physics.add.collider(this.player, this.blocks);
      this.physics.add.collider(this.blocks, layer, (p, b)=>{
        //console.log(p.boxtype);     
        layer.putTileAtWorldXY(p.boxtype, p.x, p.y);
        //p.setVisible(false);
        //p.setActive(false);
        this.seffect[1].play();
        p.destroy();
      },null,this);

      this.player.anims.play('popup',true);

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

      this.glayer = layer;

      this.cameras.main.zoom = 2.0;
      this.cameras.main.centerOn(132, 150);

      this.stage = 0;
      this.result = "...";
    }
  
    update() {

      this.debugText.setText(//
        "FPS:"+Math.trunc(1000/game.loop.delta) + " "
        //+" FRAME:"+game.getFrame()
        +"DELTA:"+String(game.loop.delta).substring(0,5)+" "
        //+" "+ ((this.maze.ready)?"WAIT":"BUSY") 
        +"FRAME:" + (game.getFrame()-this.ft) + " "
        ////+this.blocks.getLength() + "/" +this.blocks.getTotalUsed()
        //+this.player.anims.key
      );//game.getTime();
      
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

            let t = this.glayer.getTileAt(wx,wy);
            console.log(wx + "," + wy);
            if (t.index==0){
              this.glayer.putTileAt(10,wx,wy);
              c++;

            }else{
              console.log("retry");
            }
          }
        }

        if (false){//(!this.rf){
          this.rf = true;
          this.ft = game.getFrame();
          this.timerOneShot = this.time.delayedCall(3000
          , ()=>{
          this.maze.init();
          this.rf = false;
          this.ft = game.getFrame();
        }, this
          );
        }
      }else{
        //map genarate anim drawing (maze ready == false)
        this.maze.draw(false);
        this.maze.step();this.maze.step();

        this.player.x = this.maze.MW/2*16+16;
        this.player.y = this.maze.MH/2*16+16;
      }

      let mvmode = {type:false, vx:0, vy:0, push:false };

      if (this.cursors.left.isDown){
        mvmode.anim = 'left';
        mvmode.type = true;
        mvmode.vx =-1;
      }
      if (this.cursors.right.isDown){
        mvmode.anim = 'right';
        mvmode.type = true;
        mvmode.vx =1;
      }
      if (this.cursors.up.isDown){
        mvmode.anim = 'up';
        mvmode.type = true;
        mvmode.vy =-1;
      }
      if (this.cursors.down.isDown){
        mvmode.anim = 'down';
        mvmode.type = true;
        mvmode.vy =1;
      }

      if (this.cursors.space.isDown){
        mvmode.push = true;
        if (mvmode.type){
          let gt = this.glayer.getTileAtWorldXY(
          this.player.x + mvmode.vx*10, 
          this.player.y + mvmode.vy*10
        );
        if ((gt.index == 0)||(gt.index == 10)) {//0=BLUEWALL
          let gt2 = this.glayer.getTileAtWorldXY(this.player.x + mvmode.vx*26, this.player.y + mvmode.vy*26);
          if (gt2.index == 35){
            //this.glayer.putTileAtWorldXY(gt.index, this.player.x + mvmode.vx*26, this.player.y + mvmode.vy*26);
            let blocktype = gt.index;//次の行でtileを書き換えるので数値を保管する(Objectなのでgtでも参照される)
            this.glayer.putTileAtWorldXY(35, this.player.x + mvmode.vx*10, this.player.y + mvmode.vy*10);
            let box = this.blocks.get(//create(
            Math.trunc((this.player.x + mvmode.vx*10)/16)*16+8,
            Math.trunc((this.player.y + mvmode.vy*10)/16)*16+8,"blocks");

            box.setCollideWorldBounds(false);
            box.setScale(1);
            box.setPushable(true);
            if (blocktype==0) {box.anims.play("bbox");}else{box.anims.play("hbox");};
            box.setVelocityX(mvmode.vx*200);
            box.setVelocityY(mvmode.vy*200);
            box.boxtype = blocktype;

            this.seffect[0].play();
          }else{

            if (gt.index == 0){

              let box = this.blocks.get(//create(
              Math.trunc((this.player.x + mvmode.vx*10)/16)*16+8,
              Math.trunc((this.player.y + mvmode.vy*10)/16)*16+8,"blocks");
              box.setCollideWorldBounds(false);
              box.setScale(1);
              box.setPushable(false);
              box.anims.play("break");
              box.on(Phaser.Animations.Events.ANIMATION_COMPLETE, ()=>{
                //box.setVisible(false);
                //box.setActive(false);
                box.destroy();
              },this);
              this.seffect[2].play();
              this.glayer.putTileAtWorldXY(35, this.player.x + mvmode.vx*10, this.player.y + mvmode.vy*10);
            }
          }
          //this.glayer.putTileAtWorldXY(35, this.player.x + mvmode.vx*10, this.player.y + mvmode.vy*10);
        }
      }
    }

    if (mvmode.type){
      this.player.setVelocityX(mvmode.vx*60);
      this.player.setVelocityY(mvmode.vy*60);
      if (Boolean(mvmode.anim)){
        this.player.anims.play((mvmode.push?'push_':'')+mvmode.anim, true);}
        
    }else{
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
    }

    if (this.rf){
      const BGBONUS = 10;
      let wx,wy;

      //first Bonus Block Search
      FBBS_LABEL:
      for (let i=0; i<this.maze.MH; i++){
        for (let j=0; j<this.maze.MW; j++){
          let gt = this.glayer.getTileAt( j ,i);
          if (gt.index == BGBONUS){
            wx = j; wy = i;
            break FBBS_LABEL;
          }
        }
      }

      let count_x, count_y, countwork;
      count_x = 0; countwork = 0;
      for(let i=0; i<this.maze.MW; i++){
        let gt = this.glayer.getTileAt( i, wy);
        if (gt.index == BGBONUS){
          countwork++;
          if (count_x < countwork) count_x = countwork;
        } else countwork = 0;
      }

      count_y = 0; countwork = 0;
      for(let i=0; i<this.maze.MH; i++){
        let gt = this.glayer.getTileAt(wx, i);
        if (gt.index == BGBONUS){
          countwork++;
          if (count_y < countwork) count_y = countwork;
        } else countwork = 0;
      }

      this.result = "";//" lx:" + count_x + " ly:" +count_y;
      if ((count_x >=3)||(count_y >=3)){
        this.player.anims.play('popup',true);
        this.seffect[3].play();
        this.result ="CLEAR";
        this.maze.init();
        this.rf = false;
        this.ft = game.getFrame();
      }

    }
  }
}
