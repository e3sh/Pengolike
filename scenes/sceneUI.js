class uiScene extends Phaser.Scene {
  constructor() {
    super({key:"UI", active: false});
  }
    score;
    maxscore;
    stage;

    scoreText;
    goverText;
    retryText;
    debugText;

    cursors;
    zkey;

  preload() {
  }

  create() {
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });
    this.goverText = this.add.text(240, 240, 'Game Over', { fontSize: '64px', fill: '#FFF' });
    this.retryText = this.add.text(200, 310, 'Retry Space key', { fontSize: '48px', fill: '#FFF' });
    this.debugText = this.add.text(0,0, "test",  { fontSize: '16px', fill: '#FFF' });

    this.cursors = this.input.keyboard.createCursorKeys();
    const keyobj =  this.input.keyboard.addKey("Z");
    this.zkey = false;
    keyobj.on("down", ()=> {this.zkey = true;}); 
    keyobj.on("up", ()=> {this.zkey = false;});

    this.goverText.setVisible(false);
    this.retryText.setVisible(false);

    this.score = 0;
    this.maxscore = 0;

    this.stage = 1;

    const rewrite_scoreboard = (score, maxscore)=>{
      if (score != maxscore)
        this.scoreText.setText('Score: ' + score + "/" + maxscore)
      else 
        this.scoreText.setText('Score: ' + score); 
    }

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
    })
  }

  update() {
    this.debugText.setText("STAGE:" + this.stage + " FPS:"+Math.trunc(1000/game.loop.delta)+" FRAME:"+game.getFrame()+" DELTA:"+game.loop.delta
    );//game.getTime();
    this.debugText.setVisible(this.zkey);
  }
}
