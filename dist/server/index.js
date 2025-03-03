"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const game_1 = require("./game");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const PORT = process.env.PORT || 3000;
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../client')));
// Instantiate the game manager
const gameManager = new game_1.GameManager(io);
// Socket.io connection handler
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    gameManager.handleConnection(socket);
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        gameManager.handleDisconnection(socket);
    });
});
// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../client/index.html'));
});
// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map