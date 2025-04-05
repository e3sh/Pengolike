class UIDebugScene extends Phaser.Scene {
    constructor() {
      super({key:"Debug", active:false});
    }

    debugText;

    mobs;
    blocks;
    effcts;

    ft;

    preload() {

    }
  
    create() {
      this.debugText = this.add.text(0, 0, "test",  { fontSize: '10px', fill: '#FFF' });

      const gamemain = this.scene.get("GameMain");
      this.mobs = gamemain.mobs;
      this.blocks = gamemain.blocks;
      this.effcts = gamemain.effcts;

      gamemain.events.on("clear",()=>{this.ft = game.getFrame();});

      this.ft = 0;
    }
  
    update() {

      const poslist = (group)=>{
        let st = "";
        group.children.iterate(function (child) {
          let f = Boolean(child.deadstate)?"*":" ";
          st = st + f + Math.trunc(child.x) + "," + Math.trunc(child.y) + " " + Object.entries(child.body.velocity) + "\n";
        });
        return st;
      };
      
      this.debugText.setText(//
        "FPS:"+Math.trunc(1000/game.loop.delta) + "\n"
        +"TIME:"+game.getTime()+"\n"
        +"DELTA:"+String(game.loop.delta).substring(0,5)+"\n"
        //+" "+ ((this.maze.ready)?"WAIT":"BUSY") 
        +"FRAME:" + (game.getFrame()-this.ft) + "\n"
        +"Mob  :" + this.mobs.getLength() + "/" +this.mobs.getTotalUsed() + "\n" + poslist(this.mobs)
        +"Block:" + this.blocks.getLength() + "/" +this.blocks.getTotalUsed() + "\n" + poslist(this.blocks)
        +"Effct:" + this.effcts.getLength() + "/" +this.effcts.getTotalUsed() + "\n" + poslist(this.effcts)
      );
    }
}

