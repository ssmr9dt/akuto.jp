// deploy command: gcloud app deploy
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const express = require("express");

const router = express();
const server = http.createServer(router);
const io = socketio.listen(server);


router.use(express.static(path.resolve(__dirname, "client")));
var sockets = [];

io.on("connection", function(socket){
    sockets.push(socket);
    
    socket.on("disconnect", function(){
        sockets.splice(sockets.indexOf(socket),1);
    });
    
    socket.on("pos", function(e){
        socket.broadcast.emit("pos", {
            x: e.x,
            y: e.y,
            color: e.color,
            type: e.type
        })
    });
});

server.listen(process.env.PORT || 80, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});
