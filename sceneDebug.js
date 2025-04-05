class UIDebugScene extends Phaser.Scene {
    constructor() {
      super({key:"Debug", active:false});
    }

    debugText;

    mobs;
    blocks;

    ft;

    preload() {

    }
  
    create() {
      this.debugText = this.add.text(0, 0, "test",  { fontSize: '16px', fill: '#FFF' });

      const gamemain = this.scene.get("GameMain");
      this.mobs = gamemain.mobs;
      this.blocks = gamemain.blocks;

      gamemain.events.on("clear",()=>{this.ft = game.getFrame();});

      this.ft = 0;
    }
  
    update() {

      this.debugText.setText(//
        "FPS:"+Math.trunc(1000/game.loop.delta) + "\n"
        +"TIME:"+game.getTime()+"\n"
        +"DELTA:"+String(game.loop.delta).substring(0,5)+"\n"
        //+" "+ ((this.maze.ready)?"WAIT":"BUSY") 
        +"FRAME:" + (game.getFrame()-this.ft) + "\n"
        +"Mob  :" + this.mobs.getLength() + "/" +this.mobs.getTotalUsed() + "\n"
        +"Block:" + this.blocks.getLength() + "/" +this.blocks.getTotalUsed()
      );
    }
}

