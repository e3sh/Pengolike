
class inputScene extends Phaser.Scene {
  constructor() {
    super({key:"Input", active:true});
  }

  #keyObj;
  #cKeys;

  up;
  down;
  left;
  right;

  space;
  zkey;

  duration;
  
  preload() {}

  create() {

    this.#keyObj = this.input.keyboard.addKeys({
      up: "W",
      down: "S",
      left: "A",
      right: "D",
      zkey: "Z"
    }); // keyObjects.up, keyObjects.down, keyObjects.left, keyObjects.right

    this.#cKeys = this.input.keyboard.createCursorKeys();
  }

  update() {

    this.up   = this.#cKeys.up.isDown   || this.#keyObj.up.isDown;
    this.down = this.#cKeys.down.isDown || this.#keyObj.down.isDown;
    this.left = this.#cKeys.left.isDown || this.#keyObj.left.isDown;
    this.right= this.#cKeys.right.isDown || this.#keyObj.right.isDown;
    this.space = this.#cKeys.space.isDown;
    this.zkey = this.#keyObj.zkey.isDown;

    this.duration = this.#keyObj.zkey.getDuration(); //ms

    //var isShiftDown = cursorKeys.shift.isDown;
  }

  info(){
    let st = "-- input Information --\n"
    +"up   :" + this.up + "\n"
    +"down :" + this.down  + "\n"
    +"left :" + this.left + "\n"
    +"right:" + this.right + "\n"
    +"space:" + this.space + "\n"
    +"zkey :"+ this.zkey + "\n"
    +"duration(ms):"+ this.duration + "\n"

    return st;
  }


}