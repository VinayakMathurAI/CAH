import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import {
  Player,
  Room,
  GameState,
  MessageType,
  WhiteCard,
  BlackCard,
  PlayedCards
} from '../shared/types';
import { blackCards, whiteCards, shuffleCards, drawCards } from '../shared/cards';

export class GameManager {
  private io: Server;
  private rooms: Map<string, Room>;
  private players: Map<string, Player>;
  private playerRooms: Map<string, string>;
  private blackCardDeck: Map<string, BlackCard[]>;
  private whiteCardDeck: Map<string, WhiteCard[]>;

  constructor(io: Server) {
    this.io = io;
    this.rooms = new Map();
    this.players = new Map();
    this.playerRooms = new Map();
    this.blackCardDeck = new Map();
    this.whiteCardDeck = new Map();
  }

  // Handle new connections
  public handleConnection(socket: Socket): void {
    // Player connect events
    socket.on(MessageType.CREATE_ROOM, (data: { playerName: string, roomName: string }) => 
      this.createRoom(socket, data));
    
    socket.on(MessageType.JOIN_ROOM, (data: { playerName: string, roomId: string }) => 
      this.joinRoom(socket, data));
    
    socket.on(MessageType.LEAVE_ROOM, () => this.leaveRoom(socket));
    
    // Game events
    socket.on(MessageType.START_GAME, () => this.startGame(socket));
    socket.on(MessageType.PLAY_CARDS, (data: { cardIds: string[] }) => this.playCards(socket, data));
    socket.on(MessageType.SELECT_WINNER, (data: { playerId: string }) => this.selectWinner(socket, data));
  }

  // Handle disconnections
  public handleDisconnection(socket: Socket): void {
    this.leaveRoom(socket);
  }

  // Create a new room
  private createRoom(socket: Socket, data: { playerName: string, roomName: string }): void {
    const { playerName, roomName } = data;
    
    // Create player
    const player: Player = {
      id: socket.id,
      name: playerName,
      points: 0,
      hand: [],
      isCardCzar: false
    };
    
    // Create room
    const roomId = uuidv4();
    const room: Room = {
      id: roomId,
      name: roomName,
      players: [player],
      currentBlackCard: null,
      round: 0,
      state: GameState.LOBBY,
      playedCards: [],
      maxPlayers: 10,
      pointsToWin: 10
    };
    
    // Setup card decks for this room
    this.blackCardDeck.set(roomId, shuffleCards([...blackCards]));
    this.whiteCardDeck.set(roomId, shuffleCards([...whiteCards]));
    
    // Store room and player
    this.rooms.set(roomId, room);
    this.players.set(socket.id, player);
    this.playerRooms.set(socket.id, roomId);
    
    // Join socket to room
    socket.join(roomId);
    
    // Notify client
    socket.emit(MessageType.ROOM_CREATED, { room });
  }

  // Join an existing room
  private joinRoom(socket: Socket, data: { playerName: string, roomId: string }): void {
    const { playerName, roomId } = data;
    
    // Check if room exists
    const room = this.rooms.get(roomId);
    if (!room) {
      socket.emit(MessageType.ERROR, { message: 'Room not found' });
      return;
    }
    
    // Check if room is full
    if (room.players.length >= room.maxPlayers) {
      socket.emit(MessageType.ERROR, { message: 'Room is full' });
      return;
    }
    
    // Check if game is already in progress
    if (room.state !== GameState.LOBBY) {
      socket.emit(MessageType.ERROR, { message: 'Game already in progress' });
      return;
    }
    
    // Create player
    const player: Player = {
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
    this.io.to(roomId).emit(MessageType.PLAYER_JOINED, { player });
    
    // Notify the joining player
    socket.emit(MessageType.ROOM_JOINED, { room });
  }

  // Leave room
  private leaveRoom(socket: Socket): void {
    const playerId = socket.id;
    const roomId = this.playerRooms.get(playerId);
    
    if (!roomId) return;
    
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    // Remove player from room
    room.players = room.players.filter(p => p.id !== playerId);
    
    // If room is empty, delete it
    if (room.players.length === 0) {
      this.rooms.delete(roomId);
      this.blackCardDeck.delete(roomId);
      this.whiteCardDeck.delete(roomId);
    } else {
      // If player was card czar, assign a new one
      if (room.state !== GameState.LOBBY) {
        const wasCardCzar = room.players.find(p => p.id === playerId)?.isCardCzar || false;
        
        if (wasCardCzar) {
          // Assign a new card czar
          const nextCzarIndex = Math.floor(Math.random() * room.players.length);
          room.players.forEach((p, i) => {
            p.isCardCzar = i === nextCzarIndex;
          });
          
          // Reset the round if in judging state
          if (room.state === GameState.JUDGING) {
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
      this.io.to(roomId).emit(MessageType.PLAYER_LEFT, { playerId });
      this.io.to(roomId).emit(MessageType.ROOM_UPDATED, { room });
    }
    
    socket.emit(MessageType.LEAVE_ROOM, { success: true });
  }

  // Start game
  private startGame(socket: Socket): void {
    const playerId = socket.id;
    const roomId = this.playerRooms.get(playerId);
    
    if (!roomId) {
      socket.emit(MessageType.ERROR, { message: 'You are not in a room' });
      return;
    }
    
    const room = this.rooms.get(roomId);
    if (!room) {
      socket.emit(MessageType.ERROR, { message: 'Room not found' });
      return;
    }
    
    // Check if enough players
    if (room.players.length < 3) {
      socket.emit(MessageType.ERROR, { message: 'Need at least 3 players to start' });
      return;
    }
    
    // Choose first card czar randomly
    const czarIndex = Math.floor(Math.random() * room.players.length);
    room.players.forEach((player, index) => {
      player.isCardCzar = index === czarIndex;
      
      // Deal initial hand of 10 cards
      const whiteDeck = this.whiteCardDeck.get(roomId)!;
      player.hand = drawCards(whiteDeck, 10);
    });
    
    this.whiteCardDeck.set(roomId, this.whiteCardDeck.get(roomId)!);
    
    // Start the first round
    this.startNewRound(room);
    
    // Update room state
    this.rooms.set(roomId, room);
    
    // Notify players
    this.io.to(roomId).emit(MessageType.GAME_STARTED, { room });
  }

  // Start a new round
  private startNewRound(room: Room): void {
    room.round++;
    room.state = GameState.PLAYING;
    room.playedCards = [];
    
    // Draw a new black card
    const blackDeck = this.blackCardDeck.get(room.id)!;
    if (blackDeck.length === 0) {
      // Reshuffle if deck is empty
      this.blackCardDeck.set(room.id, shuffleCards([...blackCards]));
    }
    
    room.currentBlackCard = drawCards(blackDeck, 1)[0];
    this.blackCardDeck.set(room.id, blackDeck);
    
    // Notify players
    this.io.to(room.id).emit(MessageType.ROOM_UPDATED, { room });
  }

  // Play cards
  private playCards(socket: Socket, data: { cardIds: string[] }): void {
    const playerId = socket.id;
    const roomId = this.playerRooms.get(playerId);
    
    if (!roomId) {
      socket.emit(MessageType.ERROR, { message: 'You are not in a room' });
      return;
    }
    
    const room = this.rooms.get(roomId);
    if (!room) {
      socket.emit(MessageType.ERROR, { message: 'Room not found' });
      return;
    }
    
    // Check game state
    if (room.state !== GameState.PLAYING) {
      socket.emit(MessageType.ERROR, { message: 'Cannot play cards now' });
      return;
    }
    
    // Get player
    const player = this.players.get(playerId);
    if (!player) {
      socket.emit(MessageType.ERROR, { message: 'Player not found' });
      return;
    }
    
    // Check if player is card czar
    if (player.isCardCzar) {
      socket.emit(MessageType.ERROR, { message: 'Card czar cannot play cards' });
      return;
    }
    
    // Check if player already played
    if (room.playedCards.some(pc => pc.playerId === playerId)) {
      socket.emit(MessageType.ERROR, { message: 'You already played cards this round' });
      return;
    }
    
    // Check if correct number of cards
    const requiredCards = room.currentBlackCard?.pick || 1;
    if (data.cardIds.length !== requiredCards) {
      socket.emit(MessageType.ERROR, { 
        message: `You must play exactly ${requiredCards} card(s)` 
      });
      return;
    }
    
    // Get cards from player's hand
    const playedCards: WhiteCard[] = [];
    for (const cardId of data.cardIds) {
      const cardIndex = player.hand.findIndex(c => c.id === cardId);
      if (cardIndex === -1) {
        socket.emit(MessageType.ERROR, { message: 'Card not in your hand' });
        return;
      }
      playedCards.push(player.hand[cardIndex]);
      player.hand.splice(cardIndex, 1);
    }
    
    // Add played cards
    room.playedCards.push({
      playerId,
      cards: playedCards
    });
    
    // Deal new cards
    const whiteDeck = this.whiteCardDeck.get(roomId)!;
    if (whiteDeck.length < requiredCards) {
      // Reshuffle if not enough cards
      this.whiteCardDeck.set(roomId, shuffleCards([...whiteCards]));
    }
    
    const newCards = drawCards(this.whiteCardDeck.get(roomId)!, requiredCards);
    player.hand.push(...newCards);
    
    this.players.set(playerId, player);
    this.whiteCardDeck.set(roomId, this.whiteCardDeck.get(roomId)!);
    
    // Notify the player of their new hand
    socket.emit(MessageType.CARDS_PLAYED, { 
      success: true,
      hand: player.hand
    });
    
    // Check if all players have played
    const playersWhoShouldPlay = room.players.filter(p => !p.isCardCzar).length;
    if (room.playedCards.length >= playersWhoShouldPlay) {
      // Move to judging phase
      room.state = GameState.JUDGING;
      
      // Shuffle played cards to prevent bias
      room.playedCards = shuffleCards(room.playedCards);
      
      this.rooms.set(roomId, room);
      
      // Notify all players to move to judging phase
      this.io.to(roomId).emit(MessageType.ROOM_UPDATED, { room });
    } else {
      this.rooms.set(roomId, room);
    }
  }

  // Select winner
  private selectWinner(socket: Socket, data: { playerId: string }): void {
    const czarId = socket.id;
    const roomId = this.playerRooms.get(czarId);
    
    if (!roomId) {
      socket.emit(MessageType.ERROR, { message: 'You are not in a room' });
      return;
    }
    
    const room = this.rooms.get(roomId);
    if (!room) {
      socket.emit(MessageType.ERROR, { message: 'Room not found' });
      return;
    }
    
    // Check game state
    if (room.state !== GameState.JUDGING) {
      socket.emit(MessageType.ERROR, { message: 'Cannot select winner now' });
      return;
    }
    
    // Check if user is card czar
    const czar = room.players.find(p => p.id === czarId);
    if (!czar || !czar.isCardCzar) {
      socket.emit(MessageType.ERROR, { message: 'Only the card czar can select a winner' });
      return;
    }
    
    const { playerId } = data;
    
    // Check if played cards exist
    const playedCardEntry = room.playedCards.find(pc => pc.playerId === playerId);
    if (!playedCardEntry) {
      socket.emit(MessageType.ERROR, { message: 'Invalid selection' });
      return;
    }
    
    // Award a point to the winner
    const winnerIndex = room.players.findIndex(p => p.id === playerId);
    if (winnerIndex !== -1) {
      room.players[winnerIndex].points += 1;
      
      // Check if player has won the game
      if (room.players[winnerIndex].points >= room.pointsToWin) {
        room.state = GameState.GAME_OVER;
        this.rooms.set(roomId, room);
        
        // Notify players
        this.io.to(roomId).emit(MessageType.GAME_ENDED, { 
          winner: room.players[winnerIndex],
          room 
        });
        return;
      }
    }
    
    // End round
    room.state = GameState.ROUND_END;
    this.rooms.set(roomId, room);
    
    // Notify players
    this.io.to(roomId).emit(MessageType.WINNER_SELECTED, {
      playerId,
      cards: playedCardEntry.cards,
      blackCard: room.currentBlackCard,
      room
    });
    
    // Start new round after a delay
    setTimeout(() => {
      const currentRoom = this.rooms.get(roomId);
      if (currentRoom && currentRoom.state === GameState.ROUND_END) {
        // Rotate card czar
        let czarIndex = currentRoom.players.findIndex(p => p.isCardCzar);
        czarIndex = (czarIndex + 1) % currentRoom.players.length;
        
        currentRoom.players.forEach((p, i) => {
          p.isCardCzar = i === czarIndex;
        });
        
        // Start new round
        this.startNewRound(currentRoom);
        this.rooms.set(roomId, currentRoom);
      }
    }, 5000); // 5 second delay before new round
  }
}