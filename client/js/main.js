/* global Phaser */
/* global Akutonet */
(function(){

    const $stage = document.getElementById("stage");
    const w = 960;
    const h = 540;
    const game = new Phaser.Game(w, h, Phaser.AUTO, $stage);

    game.state.add("Game", Akutonet.Game);
    
    game.state.start("Game");
    
    Akutonet.game = game;

})();