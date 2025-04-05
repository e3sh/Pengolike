//============================================
//include
//============================================

const w = [
    //Phaser3 File
    "https://cdn.jsdelivr.net/npm/phaser@3.88.2/dist/phaser.min.js",

    //Scene
    "sceneGame.js",
    "sceneDebug.js",

    "setupAnims.js",
    //function subroutine
    "objPlayer.js",
    "objEnemy.js",
    "mazemake.js",

    //main
    "main.js"
];

for (let i in w) {
    document.write('<script src="' + w[i] + '"></script>');
};
