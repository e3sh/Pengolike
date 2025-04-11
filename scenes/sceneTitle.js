
class TitleScene extends Phaser.Scene {
  constructor() {
    super({key:"Title", active:true});
  }

  cursors;

  preload() {}

  create() {
    this.add.text(400-100, 200, 'PeDeF', { fontSize: '80px', fill: '#FFF' });
    this.add.text(140, 350, 'push Space to Start', { fontSize: '48px', fill: '#FFF' });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.space.isDown) {
      //this.scene.launch("Debug");
      //this.scene.launch("UI");
      this.scene.start("GameMain");
    }
  }
}