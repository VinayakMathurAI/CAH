"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var path_1 = require("path");
var game_1 = require("./game");
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
var PORT = process.env.PORT || 3000;
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../client')));
// Instantiate the game manager
var gameManager = new game_1.GameManager(io);
// Socket.io connection handler
io.on('connection', function (socket) {
    console.log("New client connected: ".concat(socket.id));
    gameManager.handleConnection(socket);
    socket.on('disconnect', function () {
        console.log("Client disconnected: ".concat(socket.id));
        gameManager.handleDisconnection(socket);
    });
});
// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file
app.get('*', function (req, res) {
    res.sendFile(path_1.default.resolve(__dirname, '../client/index.html'));
});
// Start the server
server.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
