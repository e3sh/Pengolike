
class TitleScene extends Phaser.Scene {
  constructor() {
    super({key:"Title", active:false});
  }

  cursors;

  preload() {}

  create() {
    this.add.text(20, 20, '5ch donichi thread 16 2025/4/6-14 theme (defend/guard/protect etc) R2', { fontSize: '12px', fill: '#FFF' });
    this.add.text(400-100, 130, 'PeDeF', { fontSize: '80px', fill: '#FFF' });
    this.add.text(400-120, 200, 'Pengin Defence Flag', { fontSize: '24px', fill: '#FFF' });

    this.add.text(
      440, 288
      , 'player\n\nbase(flag)\n\nenemy\n\nblocks'
      , { fontSize: '16px', fill: '#FFF' }
    );
    this.add.text(400-140, 450, 'push Space to Start', { fontSize: '32px', fill: '#FFF' });

    const spg = this.physics.add.group();
    
    const pl = spg.get(380,288,"player");
    pl.anims.play('down_p',true);
    pl.setScale(2,2);  

    const en = spg.get(380,288+64,"enemy");
    en.anims.play('down_e',true);
    en.setScale(2,2);  

    const b1 = spg.get(380-16,288+96,"blocks");
    b1.anims.play('bbox',true);
    b1.setScale(2,2);  

    const b2 = spg.get(380+16,288+96,"blocks");
    b2.anims.play('hboxt',true);
    b2.setScale(2,2);  

    const fl = spg.get(380,288+32,"blocks");
    fl.anims.play('flag',true);
    fl.setScale(2,2);  

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