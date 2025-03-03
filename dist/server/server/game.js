"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
var uuid_1 = require("uuid");
var types_1 = require("../shared/types");
var cards_1 = require("../shared/cards");
var GameManager = /** @class */ (function () {
    function GameManager(io) {
        this.io = io;
        this.rooms = new Map();
        this.players = new Map();
        this.playerRooms = new Map();
        this.blackCardDeck = new Map();
        this.whiteCardDeck = new Map();
    }
    // Handle new connections
    GameManager.prototype.handleConnection = function (socket) {
        var _this = this;
        // Player connect events
        socket.on(types_1.MessageType.CREATE_ROOM, function (data) {
            return _this.createRoom(socket, data);
        });
        socket.on(types_1.MessageType.JOIN_ROOM, function (data) {
            return _this.joinRoom(socket, data);
        });
        socket.on(types_1.MessageType.LEAVE_ROOM, function () { return _this.leaveRoom(socket); });
        // Game events
        socket.on(types_1.MessageType.START_GAME, function () { return _this.startGame(socket); });
        socket.on(types_1.MessageType.PLAY_CARDS, function (data) { return _this.playCards(socket, data); });
        socket.on(types_1.MessageType.SELECT_WINNER, function (data) { return _this.selectWinner(socket, data); });
    };
    // Handle disconnections
    GameManager.prototype.handleDisconnection = function (socket) {
        this.leaveRoom(socket);
    };
    // Create a new room
    GameManager.prototype.createRoom = function (socket, data) {
        var playerName = data.playerName, roomName = data.roomName;
        // Create player
        var player = {
            id: socket.id,
            name: playerName,
            points: 0,
            hand: [],
            isCardCzar: false
        };
        // Create room
        var roomId = (0, uuid_1.v4)();
        var room = {
            id: roomId,
            name: roomName,
            players: [player],
            currentBlackCard: null,
            round: 0,
            state: types_1.GameState.LOBBY,
            playedCards: [],
            maxPlayers: 10,
            pointsToWin: 10
        };
        // Setup card decks for this room
        this.blackCardDeck.set(roomId, (0, cards_1.shuffleCards)(__spreadArray([], cards_1.blackCards, true)));
        this.whiteCardDeck.set(roomId, (0, cards_1.shuffleCards)(__spreadArray([], cards_1.whiteCards, true)));
        // Store room and player
        this.rooms.set(roomId, room);
        this.players.set(socket.id, player);
        this.playerRooms.set(socket.id, roomId);
        // Join socket to room
        socket.join(roomId);
        // Notify client
        socket.emit(types_1.MessageType.ROOM_CREATED, { room: room });
    };
    // Join an existing room
    GameManager.prototype.joinRoom = function (socket, data) {
        var playerName = data.playerName, roomId = data.roomId;
        // Check if room exists
        var room = this.rooms.get(roomId);
        if (!room) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Room not found' });
            return;
        }
        // Check if room is full
        if (room.players.length >= room.maxPlayers) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Room is full' });
            return;
        }
        // Check if game is already in progress
        if (room.state !== types_1.GameState.LOBBY) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Game already in progress' });
            return;
        }
        // Create player
        var player = {
            id: socket.id,
            name: playerName,
            points: 0,
            hand: [],
            isCardCzar: false
        };
        // Add player to room
        room.players.push(player);
        this.rooms.set(roomId, room);
        this.players.set(socket.id, player);
        this.playerRooms.set(socket.id, roomId);
        // Join socket to room
        socket.join(roomId);
        // Notify everyone in the room
        this.io.to(roomId).emit(types_1.MessageType.PLAYER_JOINED, { player: player });
        // Notify the joining player
        socket.emit(types_1.MessageType.ROOM_JOINED, { room: room });
    };
    // Leave room
    GameManager.prototype.leaveRoom = function (socket) {
        var _a;
        var playerId = socket.id;
        var roomId = this.playerRooms.get(playerId);
        if (!roomId)
            return;
        var room = this.rooms.get(roomId);
        if (!room)
            return;
        // Remove player from room
        room.players = room.players.filter(function (p) { return p.id !== playerId; });
        // If room is empty, delete it
        if (room.players.length === 0) {
            this.rooms.delete(roomId);
            this.blackCardDeck.delete(roomId);
            this.whiteCardDeck.delete(roomId);
        }
        else {
            // If player was card czar, assign a new one
            if (room.state !== types_1.GameState.LOBBY) {
                var wasCardCzar = ((_a = room.players.find(function (p) { return p.id === playerId; })) === null || _a === void 0 ? void 0 : _a.isCardCzar) || false;
                if (wasCardCzar) {
                    // Assign a new card czar
                    var nextCzarIndex_1 = Math.floor(Math.random() * room.players.length);
                    room.players.forEach(function (p, i) {
                        p.isCardCzar = i === nextCzarIndex_1;
                    });
                    // Reset the round if in judging state
                    if (room.state === types_1.GameState.JUDGING) {
                        this.startNewRound(room);
                    }
                }
            }
            // Update room
            this.rooms.set(roomId, room);
        }
        // Clean up player data
        this.players.delete(playerId);
        this.playerRooms.delete(playerId);
        // Leave socket room
        socket.leave(roomId);
        // Notify remaining players
        if (room.players.length > 0) {
            this.io.to(roomId).emit(types_1.MessageType.PLAYER_LEFT, { playerId: playerId });
            this.io.to(roomId).emit(types_1.MessageType.ROOM_UPDATED, { room: room });
        }
        socket.emit(types_1.MessageType.LEAVE_ROOM, { success: true });
    };
    // Start game
    GameManager.prototype.startGame = function (socket) {
        var _this = this;
        var playerId = socket.id;
        var roomId = this.playerRooms.get(playerId);
        if (!roomId) {
            socket.emit(types_1.MessageType.ERROR, { message: 'You are not in a room' });
            return;
        }
        var room = this.rooms.get(roomId);
        if (!room) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Room not found' });
            return;
        }
        // Check if enough players
        if (room.players.length < 3) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Need at least 3 players to start' });
            return;
        }
        // Choose first card czar randomly
        var czarIndex = Math.floor(Math.random() * room.players.length);
        room.players.forEach(function (player, index) {
            player.isCardCzar = index === czarIndex;
            // Deal initial hand of 10 cards
            var whiteDeck = _this.whiteCardDeck.get(roomId);
            player.hand = (0, cards_1.drawCards)(whiteDeck, 10);
        });
        this.whiteCardDeck.set(roomId, this.whiteCardDeck.get(roomId));
        // Start the first round
        this.startNewRound(room);
        // Update room state
        this.rooms.set(roomId, room);
        // Notify players
        this.io.to(roomId).emit(types_1.MessageType.GAME_STARTED, { room: room });
    };
    // Start a new round
    GameManager.prototype.startNewRound = function (room) {
        room.round++;
        room.state = types_1.GameState.PLAYING;
        room.playedCards = [];
        // Draw a new black card
        var blackDeck = this.blackCardDeck.get(room.id);
        if (blackDeck.length === 0) {
            // Reshuffle if deck is empty
            this.blackCardDeck.set(room.id, (0, cards_1.shuffleCards)(__spreadArray([], cards_1.blackCards, true)));
        }
        room.currentBlackCard = (0, cards_1.drawCards)(blackDeck, 1)[0];
        this.blackCardDeck.set(room.id, blackDeck);
        // Notify players
        this.io.to(room.id).emit(types_1.MessageType.ROOM_UPDATED, { room: room });
    };
    // Play cards
    GameManager.prototype.playCards = function (socket, data) {
        var _a;
        var _b;
        var playerId = socket.id;
        var roomId = this.playerRooms.get(playerId);
        if (!roomId) {
            socket.emit(types_1.MessageType.ERROR, { message: 'You are not in a room' });
            return;
        }
        var room = this.rooms.get(roomId);
        if (!room) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Room not found' });
            return;
        }
        // Check game state
        if (room.state !== types_1.GameState.PLAYING) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Cannot play cards now' });
            return;
        }
        // Get player
        var player = this.players.get(playerId);
        if (!player) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Player not found' });
            return;
        }
        // Check if player is card czar
        if (player.isCardCzar) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Card czar cannot play cards' });
            return;
        }
        // Check if player already played
        if (room.playedCards.some(function (pc) { return pc.playerId === playerId; })) {
            socket.emit(types_1.MessageType.ERROR, { message: 'You already played cards this round' });
            return;
        }
        // Check if correct number of cards
        var requiredCards = ((_b = room.currentBlackCard) === null || _b === void 0 ? void 0 : _b.pick) || 1;
        if (data.cardIds.length !== requiredCards) {
            socket.emit(types_1.MessageType.ERROR, {
                message: "You must play exactly ".concat(requiredCards, " card(s)")
            });
            return;
        }
        // Get cards from player's hand
        var playedCards = [];
        var _loop_1 = function (cardId) {
            var cardIndex = player.hand.findIndex(function (c) { return c.id === cardId; });
            if (cardIndex === -1) {
                socket.emit(types_1.MessageType.ERROR, { message: 'Card not in your hand' });
                return { value: void 0 };
            }
            playedCards.push(player.hand[cardIndex]);
            player.hand.splice(cardIndex, 1);
        };
        for (var _i = 0, _c = data.cardIds; _i < _c.length; _i++) {
            var cardId = _c[_i];
            var state_1 = _loop_1(cardId);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        // Add played cards
        room.playedCards.push({
            playerId: playerId,
            cards: playedCards
        });
        // Deal new cards
        var whiteDeck = this.whiteCardDeck.get(roomId);
        if (whiteDeck.length < requiredCards) {
            // Reshuffle if not enough cards
            this.whiteCardDeck.set(roomId, (0, cards_1.shuffleCards)(__spreadArray([], cards_1.whiteCards, true)));
        }
        var newCards = (0, cards_1.drawCards)(this.whiteCardDeck.get(roomId), requiredCards);
        (_a = player.hand).push.apply(_a, newCards);
        this.players.set(playerId, player);
        this.whiteCardDeck.set(roomId, this.whiteCardDeck.get(roomId));
        // Notify the player of their new hand
        socket.emit(types_1.MessageType.CARDS_PLAYED, {
            success: true,
            hand: player.hand
        });
        // Check if all players have played
        var playersWhoShouldPlay = room.players.filter(function (p) { return !p.isCardCzar; }).length;
        if (room.playedCards.length >= playersWhoShouldPlay) {
            // Move to judging phase
            room.state = types_1.GameState.JUDGING;
            // Shuffle played cards to prevent bias
            room.playedCards = (0, cards_1.shuffleCards)(room.playedCards);
            this.rooms.set(roomId, room);
            // Notify all players to move to judging phase
            this.io.to(roomId).emit(types_1.MessageType.ROOM_UPDATED, { room: room });
        }
        else {
            this.rooms.set(roomId, room);
        }
    };
    // Select winner
    GameManager.prototype.selectWinner = function (socket, data) {
        var _this = this;
        var czarId = socket.id;
        var roomId = this.playerRooms.get(czarId);
        if (!roomId) {
            socket.emit(types_1.MessageType.ERROR, { message: 'You are not in a room' });
            return;
        }
        var room = this.rooms.get(roomId);
        if (!room) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Room not found' });
            return;
        }
        // Check game state
        if (room.state !== types_1.GameState.JUDGING) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Cannot select winner now' });
            return;
        }
        // Check if user is card czar
        var czar = room.players.find(function (p) { return p.id === czarId; });
        if (!czar || !czar.isCardCzar) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Only the card czar can select a winner' });
            return;
        }
        var playerId = data.playerId;
        // Check if played cards exist
        var playedCardEntry = room.playedCards.find(function (pc) { return pc.playerId === playerId; });
        if (!playedCardEntry) {
            socket.emit(types_1.MessageType.ERROR, { message: 'Invalid selection' });
            return;
        }
        // Award a point to the winner
        var winnerIndex = room.players.findIndex(function (p) { return p.id === playerId; });
        if (winnerIndex !== -1) {
            room.players[winnerIndex].points += 1;
            // Check if player has won the game
            if (room.players[winnerIndex].points >= room.pointsToWin) {
                room.state = types_1.GameState.GAME_OVER;
                this.rooms.set(roomId, room);
                // Notify players
                this.io.to(roomId).emit(types_1.MessageType.GAME_ENDED, {
                    winner: room.players[winnerIndex],
                    room: room
                });
                return;
            }
        }
        // End round
        room.state = types_1.GameState.ROUND_END;
        this.rooms.set(roomId, room);
        // Notify players
        this.io.to(roomId).emit(types_1.MessageType.WINNER_SELECTED, {
            playerId: playerId,
            cards: playedCardEntry.cards,
            blackCard: room.currentBlackCard,
            room: room
        });
        // Start new round after a delay
        setTimeout(function () {
            var currentRoom = _this.rooms.get(roomId);
            if (currentRoom && currentRoom.state === types_1.GameState.ROUND_END) {
                // Rotate card czar
                var czarIndex_1 = currentRoom.players.findIndex(function (p) { return p.isCardCzar; });
                czarIndex_1 = (czarIndex_1 + 1) % currentRoom.players.length;
                currentRoom.players.forEach(function (p, i) {
                    p.isCardCzar = i === czarIndex_1;
                });
                // Start new round
                _this.startNewRound(currentRoom);
                _this.rooms.set(roomId, currentRoom);
            }
        }, 5000); // 5 second delay before new round
    };
    return GameManager;
}());
exports.GameManager = GameManager;
