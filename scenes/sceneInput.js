
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
  xkey;

  duration;
  
  preload() {}

  create() {

    this.#keyObj = this.input.keyboard.addKeys({
      up: "W",
      down: "S",
      left: "A",
      right: "D",
      zkey: "Z",
      xkey: "X"
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
    this.xkey = this.#keyObj.xkey.isDown;

    this.duration = {
      up: Math.trunc(this.#cKeys.up.getDuration())
      + Math.trunc(this.#keyObj.up.getDuration()),

      down: Math.trunc(this.#cKeys.down.getDuration())
      + Math.trunc(this.#keyObj.down.getDuration()),

      left: Math.trunc(this.#cKeys.left.getDuration())
      + Math.trunc(this.#keyObj.left.getDuration()),

      right: Math.trunc(this.#cKeys.right.getDuration())
      + Math.trunc(this.#keyObj.right.getDuration()),

      space: Math.trunc(this.#cKeys.space.getDuration()), //ms
      z:  Math.trunc(this.#keyObj.zkey.getDuration()), //ms
      x:  Math.trunc(this.#keyObj.xkey.getDuration()) //ms
    }
    //var isShiftDown = cursorKeys.shift.isDown;
  }

  info(){
    let st = "-- input Information --\n"
    +"up   :" + this.up + "/" + this.duration.up + "ms\n"
    +"down :" + this.down  + "/" + this.duration.down + "ms\n"
    +"left :" + this.left + "/" + this.duration.left + "ms\n"
    +"right:" + this.right + "/" + this.duration.right + "ms\n"
    +"space:" + this.space + "/" + this.duration.space + "ms\n"
    +"zkey :"+ this.zkey + "/" + this.duration.z + "ms\n"
    +"xkey :"+ this.xkey + "/" + this.duration.x + "ms\n"
    //+"duration(ms):"+ this.duration + "\n"

    return st;
  }


}