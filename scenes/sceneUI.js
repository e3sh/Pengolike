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
    
    this.goverText = this.add.text(240, 240, 'Game Over', { fontSize: '64px', fill: '#FFF' });
    this.retryText = this.add.text(200, 310, 'Push Space key', { fontSize: '48px', fill: '#FFF' });

    this.goverText.setVisible(false);
    this.retryText.setVisible(false);
    
    //UI

    this.gText = this.add.bitmapText(112+0, 600-48, 'font', 'UI_text');
    this.gText.setScale(2);
    this.bar = this.add.bitmapText(112+8*16, 600-48, 'pcgfont', 'hp_bar');
    this.bar.setScale(1);

    this.gameMain = this.scene.get("GameMain");

    //this.cameras.zoom = 2.0;
    //this.cameras.main.centerOn(288, 300);
    
    // event section. 
    const gameMain = this.scene.get("GameMain");

    gameMain.events.on("wavec",()=>{

      this.goverText.setText("NEXT WAVE");
      this.goverText.x = -240;
      this.goverText.setVisible(true);

      let tween = this.tweens.add({
        targets: this.goverText,
        x: 800,
        ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 1500,
        repeat: 0,            // -1: infinity
        yoyo: false
      });
      tween.play();

      //this.retryText.setVisible(true);
      this.timerOneShot = this.time.delayedCall(2000, ()=>{
        this.goverText.setVisible(false);

      }, this
      );

    })
    //
    gameMain.events.on("gameover",()=>{
      this.goverText.x = 240;
      this.goverText.setText("Game Over");

      this.goverText.setVisible(true);
      //this.retryText.setVisible(true);
    });

    gameMain.events.on("retTitle",()=>{
      this.retryText.setVisible(true);
      //this.retryText.setVisible(true);
    });


    const spg = this.physics.add.group();

    const sp = spg.get(140,558,"player");
    sp.anims.play('popup_p',true);  
    sp.setVisible(false);

    gameMain.events.on("popupPG",()=>{ sp.setVisible(true); });
    gameMain.events.on("eracePG",()=>{ sp.setVisible(false); });

    this.events.on("shutdown", ()=>{
      gameMain.events.removeListener("wavec");
      gameMain.events.removeListener("gameover");
      gameMain.events.removeListener("retTitle");
      gameMain.events.removeListener("popupPG");
      gameMain.events.removeListener("eracePG");
    });
  }

  update() {
    const stage = this.gameMain.stage;
    const result = this.gameMain.result;
    const basehp = this.gameMain.basehp;
    const wave = this.gameMain.wave;
    const mapchange = this.gameMain.mapchange;

    this.gText.setText(
      "\n" + //result + "\n" +
      "BASE HP[" + " ".repeat(29) + "]\n" + 
      "WAVE:" + wave 
      //+ " STAGE:" + stage 
      //+ " BASEHP:" + basehp 
      //+ " " +result 
      //+ " MAPCHANGE:" + mapchange
    );

    this.bar.setText(
      "" + "&".repeat(basehp/30) + "\n"        
      + "#".repeat(basehp%30) + "\n"
      + "o".repeat((wave*3)-this.gameMain.killcount) + ".".repeat(this.gameMain.killcount)
    );
    /*
    this.debugText.setText("STAGE:" + this.stage + " FPS:"+Math.trunc(1000/game.loop.delta)+" FRAME:"+game.getFrame()+" DELTA:"+game.loop.delta
    );//game.getTime();
    this.debugText.setVisible(this.zkey);
    */


  }
}
