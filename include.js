//============================================
//include
//============================================

const w = [
    //Phaser3 File
    //"https://cdn.jsdelivr.net/npm/phaser@3.88.2/dist/phaser.min.js",
    "phaser/phaser.min.js",

    //Scene
    "scenes/sceneLoad.js",
    "scenes/sceneTitle.js",
    "scenes/sceneGame.js",
    "scenes/sceneUI.js",
    "scenes/sceneDebug.js",

    "setupAnims.js",
    //function subroutine
    "objPlayer.js",
    "objEnemy.js",
    "objEnemyTr.js",
     "mazemake.js",
    "routecheck.js",
    //main
    "main.js"
];

for (let i in w) {
    document.write('<script src="' + w[i] + '"></script>');
};
