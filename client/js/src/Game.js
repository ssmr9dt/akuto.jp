/* global Akutonet */
/* global io */
/* global Phaser */

// Referer: https://gamemechanicexplorer.com/#lighting-3
// ADD OGP

Akutonet = {};

Akutonet.Game = function() {};

Akutonet.Game.prototype = {
  init: function() {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      
      // if (!!!this.game.device.desktop) {
      //   this.scale.forceOrientation(true, false);
      //   this.scale.enterIncorrectOrientation
      //     .add(this.enterIncorrectOrientation, this);
      //   this.scale.leaveIncorrectOrientation
      //     .add(this.leaveIncorrectOrientation, this);
      // }
  
      this.scale.refresh();
    },

  preload: function(){
    this.game.load.image("image", "assets/background.jpg");
  },

  create: function() {
    
    var socket = io.connect();
    this.socket = socket;
    
    this.game.stage.disableVisibilityChange = true;
    
    var r = 20;
    
    Akutonet.sockets = {};
    
    var sprite = this.game.add.sprite(0, 0, "image");
    sprite.scale.setTo(0.5,0.5);
    var mask = this.game.add.graphics(0, 0);
    mask.beginFill(0xffffff);
    mask.drawCircle(0, 0, 1);
    sprite.mask = mask;
    this.game.input.addMoveCallback(function(pointer, x, y) {
      if (!!!socket.id) { return; }
      if (!!!Akutonet.sockets[socket.id]) {
        Akutonet.sockets[socket.id] = {x:0, y:0, r:r};
      }
      Akutonet.sockets[socket.id].x = x;
      Akutonet.sockets[socket.id].y = y;
      socket.emit("pos", { x: x, y: y });
    }, this);
    this.sprite = sprite;
    
    this.socket.on("pos", function(e){
      if (!!!e.id) { return; }
      if (!!!Akutonet.sockets[e.id]) {
        Akutonet.sockets[e.id] = {x:0, y:0, r:r};
      }
      Akutonet.sockets[e.id].x = e.x;
      Akutonet.sockets[e.id].y = e.y;
    });
    
    this.socket.on("playerdisconnect", function(e){
      if (!!!e.id) { return; }
      delete Akutonet.sockets[e.id];
    });
  },

  update: function() {
    var jj = this;
    var count = 0;
    Object.keys(Akutonet.sockets).forEach(function(key){
      if (count === 0) {
        jj.sprite.mask.clear();
        jj.sprite.mask.beginFill(0xFFFFFF);
      }
      count++;
      var obj = Akutonet.sockets[key];
      
      // var gradient =
      //       jj.shadowTexture.context.createRadialGradient(
      //           obj.x, obj.y, obj.r * 0.75,
      //           obj.x, obj.y, obj.r);
      // gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      // gradient.addColorStop(1, "rgba(255, 255, 255, 0.0)");

      // jj.shadowTexture.context.beginPath();
      // jj.shadowTexture.context.fillStyle = gradient;
      // jj.shadowTexture.context.arc(obj.x, obj.y, obj.r, 0, Math.PI*2);
      // jj.shadowTexture.context.fill();
      
      jj.sprite.mask.drawCircle(obj.x-obj.r/2, obj.y-obj.r/2, obj.r);
    });
  },
  
  render: function(){},
  
  quitGame: function(){
    Akutonet.Game.socket.disconnect();
  }
};

