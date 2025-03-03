"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState["LOBBY"] = "lobby";
    GameState["PLAYING"] = "playing";
    GameState["JUDGING"] = "judging";
    GameState["ROUND_END"] = "round_end";
    GameState["GAME_OVER"] = "game_over";
})(GameState || (exports.GameState = GameState = {}));
// Message Types
var MessageType;
(function (MessageType) {
    // Room related
    MessageType["CREATE_ROOM"] = "create_room";
    MessageType["JOIN_ROOM"] = "join_room";
    MessageType["LEAVE_ROOM"] = "leave_room";
    MessageType["ROOM_CREATED"] = "room_created";
    MessageType["ROOM_JOINED"] = "room_joined";
    MessageType["ROOM_UPDATED"] = "room_updated";
    MessageType["PLAYER_JOINED"] = "player_joined";
    MessageType["PLAYER_LEFT"] = "player_left";
    // Game related
    MessageType["START_GAME"] = "start_game";
    MessageType["GAME_STARTED"] = "game_started";
    MessageType["PLAY_CARDS"] = "play_cards";
    MessageType["CARDS_PLAYED"] = "cards_played";
    MessageType["SELECT_WINNER"] = "select_winner";
    MessageType["WINNER_SELECTED"] = "winner_selected";
    MessageType["ROUND_ENDED"] = "round_ended";
    MessageType["GAME_ENDED"] = "game_ended";
    // P2P related
    MessageType["P2P_HOST_READY"] = "p2p_host_ready";
    MessageType["P2P_PLAYER_READY"] = "p2p_player_ready";
    MessageType["P2P_SIGNAL"] = "p2p_signal";
    // Errors
    MessageType["ERROR"] = "error";
})(MessageType || (exports.MessageType = MessageType = {}));
//# sourceMappingURL=types.js.map