class UIDebugScene extends Phaser.Scene {
    constructor() {
      super({key:"Debug", active:false});
    }

    debugText;

    gm;

    friends;
    mobs;
    blocks;
    effcts;

    ft;

    homekey;

    preload() {}
  
    create() {
        this.homekey = false;
      this.input.keyboard.on("keydown-HOME", ()=> {this.homekey = true; }); 
      this.input.keyboard.on("keyup-HOME", ()=> { this.homekey = false;});

      this.debugText = this.add.text(0, 0, "test",  { fontSize: '12 px', fill: '#FFF' });

      const gamemain = this.scene.get("GameMain");
      this.gm = gamemain;

      this.friends = gamemain.friends;
      this.mobs = gamemain.mobs;
      this.blocks = gamemain.blocks;
      this.effcts = gamemain.effcts;

      //gamemain.events.on("clear",()=>{this.ft = game.getFrame();});

      this.ft = 0;
    }
  
    update() {

      this.debugText.setVisible(this.homekey);

      const poslist = (group)=>{
        let st = "";
        group.children.iterate(function (child) {
          let fd = ("deadstate" in child)?"*":" ";
          let fg = ("BONUSreceived" in child)?"$":" ";
          let fi = ("invincible" in child)?"i":" ";
          let fp = ("pausestate" in child)?"p":" ";

          st = st 

          + fd + fg + fi + fp
          + Math.trunc(child.x) 
          + "," + Math.trunc(child.y) 
          + " vx:" + Math.sign(child.body.velocity.x) 
          + " vy:" + Math.sign(child.body.velocity.y) + "\n";
        });
        return st;

      };
      
      const gamemain = this.gm;

      let enames = "";
      for (let s of gamemain.events.eventNames()){
        enames += s + ":" +gamemain.events.listenerCount(s) + "\n";
      }

      this.debugText.setText(//
        "-- SystemStatus --\n"
        +"FPS:"+Math.trunc(1000/game.loop.delta) + "\n"
        +"TIME:"+game.getTime()+"\n"
        +"DELTA:"+String(game.loop.delta).substring(0,5)+"\n"
        //+" "+ ((this.maze.ready)?"WAIT":"BUSY") 
        +"FRAME:" + (game.getFrame()-this.ft) + "\n"
        +"-- GameStatus --\n"
        +"Wave:" + gamemain.wave + "\n"
        +"MapChange:" + gamemain.mapchange + "\n"
        +"KillCount " + gamemain.killcount + "\n"
        +"BaseHP:" + gamemain.basehp + "\n"
        +"GameOverFlag:" + gamemain.goverf + "\n"
        +"-- SpriteStatus --\n"
        +"Pengo:" + this.friends.getLength() + "/" +this.friends.getTotalUsed() + "\n" + poslist(this.friends)
        +"Mob  :" + this.mobs.getLength() + "/" +this.mobs.getTotalUsed() + "\n" + poslist(this.mobs)
        +"Block:" + this.blocks.getLength() + "/" +this.blocks.getTotalUsed() + "\n" + poslist(this.blocks)
        +"Effct:" + this.effcts.getLength() + "/" +this.effcts.getTotalUsed() + "\n" + poslist(this.effcts)
        +"-- eventsStatus --\n"
        //+"wp:" + (("wp" in gamemain)?gamemain.wp.length:"none")
        +enames
      );
    }
}

