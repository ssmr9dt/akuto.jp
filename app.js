const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const express = require("express");

const router = express();
const server = http.createServer(router);
const io = socketio.listen(server);

router.use("/phaser", express.static(path.resolve(__dirname, "node_modules/phaser-ce/build/")));
router.use(express.static(path.resolve(__dirname, "client")));


io.on("connection", function(socket){
    // socket.emit("connection", { id: socket.id });
    
    socket.on("disconnect", function(){
        // sockets.splice(sockets.indexOf(socket),1);
        socket.broadcast.emit("playerdisconnect", {
            id: socket.id
        });
    });

    socket.on("pos", function(e){
        socket.broadcast.emit("pos", {
            id: socket.id,
            x: e.x,
            y: e.y,
        })
    });
});

server.listen(process.env.PORT || 80, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});
