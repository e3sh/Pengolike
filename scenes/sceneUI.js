class uiScene extends Phaser.Scene {
  constructor() {
    super({key:"UI", active: false});
  }
    /*
    goverText;
    retryText;
  
    cursors;
    zkey;
  */
    gText;
    bar;

    gameMain;

  preload() {
  }

  create() {
    /*
    this.goverText = this.add.text(240, 240, 'Game Over', { fontSize: '64px', fill: '#FFF' });
    this.retryText = this.add.text(200, 310, 'Retry Space key', { fontSize: '48px', fill: '#FFF' });

    this.cursors = this.input.keyboard.createCursorKeys();
    const keyobj =  this.input.keyboard.addKey("Z");
    this.zkey = false;
    keyobj.on("down", ()=> {this.zkey = true;}); 
    keyobj.on("up", ()=> {this.zkey = false;});

    this.goverText.setVisible(false);
    this.retryText.setVisible(false);
    */
      //UI

      this.gText = this.add.bitmapText(0, 600-48, 'font', 'PHASER 3');
      this.gText.setScale(2);
      this.bar = this.add.bitmapText(8*16, 600-48, 'pcgfont', 'PHASER 3');
      this.bar.setScale(1);

      this.gameMain = this.scene.get("GameMain");

      this.cameras.zoom = 2.0;
    /*
    // event section.
    const gameMain = this.scene.get("GameMain");
    // addScore
    gameMain.events.on("addScore",()=>{
      this.score += 10;

      if (this.score > this.maxscore) this.maxscore = this.score;
      rewrite_scoreboard(this.score, this.maxscore);
    })
    // decScore
    gameMain.events.on("decScore",()=>{
      this.score -= 100;

      if (this.score < 0) {
        this.score = 0;
        rewrite_scoreboard(this.score, this.maxscore);
      }else{
        rewrite_scoreboard(this.score, this.maxscore);
        return;
      }
        //dead
        this.events.emit("HPzero");
        this.goverText.setVisible(true);
        
        this.timerOneShot = 
          this.time.delayedCall(3000  , ()=>{ this.retryText.setVisible(true); }, this );
      
    })
    //
    gameMain.events.on("UIinit",()=>{

      this.goverText.setVisible(false);
      this.retryText.setVisible(false);
  
      this.stage = 1;

      this.score = 0;
      this.maxscore = 0;
      rewrite_scoreboard(0, 0);
    })
    //
    gameMain.events.on("NextStage",()=>{
      this.stage++;
    });
    */
  
  }

  update() {
    const stage = this.gameMain.stage;
    const result = this.gameMain.result;
    const basehp = this.gameMain.basehp;
    const wave = this.gameMain.wave;
    const mapchange = this.gameMain.mapchange;

    this.gText.setText(
      " " + result + "\n" +
      "BASE HP:\n" + 
      "WAVE:" + wave 
      //+ " STAGE:" + stage 
      //+ " BASEHP:" + basehp 
      //+ " " +result 
      //+ " MAPCHANGE:" + mapchange
    );

    this.bar.setText(
      "" + "&".repeat(basehp/30) + "\n"        
      + "#".repeat(basehp%30) + "\n"
      + "o".repeat((wave*3)-this.gameMain.killcount)
    );
    /*
    this.debugText.setText("STAGE:" + this.stage + " FPS:"+Math.trunc(1000/game.loop.delta)+" FRAME:"+game.getFrame()+" DELTA:"+game.loop.delta
    );//game.getTime();
    this.debugText.setVisible(this.zkey);
    */


  }
}
