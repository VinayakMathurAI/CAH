import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { Room, Player, MessageType, GameMessage, GameState } from '../../shared/types';
import { P2PConnection } from '../utils/p2pConnection';
import { startNewGame, playCards as p2pPlayCards, selectWinner as p2pSelectWinner, startNewRound } from '../utils/p2pGameLogic';
import { v4 as uuidv4 } from 'uuid';

interface GameContextProps {
  connected: boolean;
  room: Room | null;
  player: Player | null;
  error: string | null;
  isP2PMode: boolean;
  isHost: boolean;
  createRoom: (playerName: string, roomName: string, useP2P?: boolean) => void;
  joinRoom: (playerName: string, roomId: string, useP2P?: boolean) => void;
  leaveRoom: () => void;
  startGame: () => void;
  playCards: (cardIds: string[]) => void;
  selectWinner: (playerId: string) => void;
}

const GameContext = createContext<GameContextProps>({} as GameContextProps);

export const useGame = () => useContext(GameContext);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [p2pConnection, setP2PConnection] = useState<P2PConnection | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isP2PMode, setIsP2PMode] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);

  // Connect to the socket server if not in P2P mode
  useEffect(() => {
    if (!isP2PMode && !socket) {
      const socketConnection = io(window.location.origin, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketConnection.on('connect', () => {
        setSocket(socketConnection);
        setConnected(true);
      });

      socketConnection.on('disconnect', () => {
        setConnected(false);
      });

      // Setup message handlers
      setupSocketHandlers(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [isP2PMode]);

  // Setup socket message handlers
  const setupSocketHandlers = (socketConnection: Socket) => {
    socketConnection.on(MessageType.ERROR, (data: { message: string }) => {
      setError(data.message);
      setTimeout(() => setError(null), 5000);
    });

    socketConnection.on(MessageType.ROOM_CREATED, (data: { room: Room }) => {
      setRoom(data.room);
      setPlayer(data.room.players.find((p: Player) => p.id === socketConnection.id) || null);
    });

    socketConnection.on(MessageType.ROOM_JOINED, (data: { room: Room }) => {
      setRoom(data.room);
      setPlayer(data.room.players.find((p: Player) => p.id === socketConnection.id) || null);
    });

    socketConnection.on(MessageType.PLAYER_JOINED, (data: { player: Player }) => {
      setRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          players: [...prev.players, data.player]
        };
      });
    });

    socketConnection.on(MessageType.PLAYER_LEFT, (data: { playerId: string }) => {
      setRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.filter(p => p.id !== data.playerId)
        };
      });
    });

    socketConnection.on(MessageType.ROOM_UPDATED, (data: { room: Room }) => {
      setRoom(data.room);
      setPlayer(data.room.players.find((p: Player) => p.id === socketConnection.id) || null);
    });

    socketConnection.on(MessageType.CARDS_PLAYED, (data: { hand: any }) => {
      setPlayer(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          hand: data.hand
        };
      });
    });
  };

  // Handle P2P message
  const handleP2PMessage = (message: GameMessage) => {
    switch (message.type) {
      case MessageType.ROOM_CREATED:
      case MessageType.ROOM_JOINED:
        setRoom(message.payload.room);
        setPlayer(message.payload.room.players.find((p: Player) => p.id === player?.id) || null);
        break;
        
      case MessageType.PLAYER_JOINED:
        setRoom(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            players: [...prev.players, message.payload.player]
          };
        });
        break;
        
      case MessageType.PLAYER_LEFT:
        setRoom(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            players: prev.players.filter(p => p.id !== message.payload.playerId)
          };
        });
        break;
        
      case MessageType.ROOM_UPDATED:
        setRoom(message.payload.room);
        setPlayer(message.payload.room.players.find((p: Player) => p.id === player?.id) || null);
        break;
        
      case MessageType.CARDS_PLAYED:
        setPlayer(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            hand: message.payload.hand
          };
        });
        break;
        
      case MessageType.ERROR:
        setError(message.payload.message);
        setTimeout(() => setError(null), 5000);
        break;
    }
  };

  // Handle creating a room
  const createRoom = (playerName: string, roomName: string, useP2P: boolean = false) => {
    if (useP2P) {
      // Initialize P2P mode as host
      setIsP2PMode(true);
      setIsHost(true);
      
      const roomId = uuidv4().substring(0, 6); // Shorter room ID for easier sharing
      const playerId = uuidv4();
      
      // Create player
      const newPlayer: Player = {
        id: playerId,
        name: playerName,
        points: 0,
        hand: [],
        isCardCzar: false
      };
      
      // Create room
      const newRoom: Room = {
        id: roomId,
        name: roomName,
        players: [newPlayer],
        currentBlackCard: null,
        round: 0,
        state: GameState.LOBBY,
        playedCards: [],
        maxPlayers: 10,
        pointsToWin: 10
      };
      
      // Set local state
      setPlayer(newPlayer);
      setRoom(newRoom);
      
      // Initialize P2P connection
      const p2p = new P2PConnection({
        isHost: true,
        roomId,
        playerId,
        onMessage: handleP2PMessage,
        onPeerConnect: (peerId) => {
          console.log("Peer connected:", peerId);
        },
        onPeerDisconnect: (peerId) => {
          console.log("Peer disconnected:", peerId);
          // Handle player leaving
          if (room) {
            const updatedPlayers = room.players.filter(p => p.id !== peerId);
            const updatedRoom = { ...room, players: updatedPlayers };
            setRoom(updatedRoom);
            
            // Broadcast player left
            p2p.broadcast({
              type: MessageType.PLAYER_LEFT,
              payload: { playerId: peerId }
            });
          }
        }
      });
      
      setP2PConnection(p2p);
      setConnected(true);
      
    } else if (socket) {
      // Use socket.io mode
      setIsP2PMode(false);
      socket.emit(MessageType.CREATE_ROOM, { playerName, roomName });
    }
  };

  // Handle joining a room
  const joinRoom = (playerName: string, roomId: string, useP2P: boolean = false) => {
    if (useP2P) {
      // Initialize P2P mode as player
      setIsP2PMode(true);
      setIsHost(false);
      
      const playerId = uuidv4();
      
      // Create player
      const newPlayer: Player = {
        id: playerId,
        name: playerName,
        points: 0,
        hand: [],
        isCardCzar: false
      };
      
      // Set local player state
      setPlayer(newPlayer);
      
      // Initialize P2P connection
      const p2p = new P2PConnection({
        isHost: false,
        roomId,
        playerId,
        onMessage: handleP2PMessage,
        onPeerConnect: (peerId) => {
          console.log("Connected to host:", peerId);
          
          // Send join request to host
          p2p.send({
            type: MessageType.JOIN_ROOM,
            payload: { player: newPlayer }
          });
        },
        onPeerDisconnect: (peerId) => {
          console.log("Host disconnected:", peerId);
          // Reset game state if host disconnects
          setError("Host disconnected. Connection lost.");
          leaveRoom();
        }
      });
      
      setP2PConnection(p2p);
      
      // Connect to host
      p2p.connectToHost();
      setConnected(true);
      
    } else if (socket) {
      // Use socket.io mode
      setIsP2PMode(false);
      socket.emit(MessageType.JOIN_ROOM, { playerName, roomId });
    }
  };

  // Handle leaving a room
  const leaveRoom = () => {
    if (isP2PMode && p2pConnection) {
      // P2P mode cleanup
      p2pConnection.disconnect();
      setP2PConnection(null);
    } else if (socket) {
      // Socket mode cleanup
      socket.emit(MessageType.LEAVE_ROOM);
    }
    
    // Reset state
    setRoom(null);
    setPlayer(null);
    setIsP2PMode(false);
    setIsHost(false);
  };

  // Handle starting the game
  const startGame = () => {
    if (isP2PMode && p2pConnection && isHost && room) {
      // In P2P host mode, use our game logic
      const updatedRoom = startNewGame(room);
      setRoom(updatedRoom);
      
      // Update local player state
      const localPlayer = updatedRoom.players.find(p => p.id === player?.id);
      if (localPlayer) {
        setPlayer(localPlayer);
      }
      
      // Broadcast game started
      p2pConnection.broadcast({
        type: MessageType.GAME_STARTED,
        payload: { room: updatedRoom }
      });
      
    } else if (socket) {
      // Socket mode
      socket.emit(MessageType.START_GAME);
    }
  };

  // Handle playing cards
  const playCards = (cardIds: string[]) => {
    if (isP2PMode && p2pConnection && player) {
      // In P2P mode
      if (isHost && room) {
        // If host, process locally and broadcast
        const updatedRoom = p2pPlayCards(room, player.id, cardIds);
        setRoom(updatedRoom);
        
        // Update local player state
        const localPlayer = updatedRoom.players.find(p => p.id === player.id);
        if (localPlayer) {
          setPlayer(localPlayer);
        }
        
        // Broadcast updated room
        p2pConnection.broadcast({
          type: MessageType.ROOM_UPDATED,
          payload: { room: updatedRoom }
        });
      } else {
        // If player, send to host
        p2pConnection.send({
          type: MessageType.PLAY_CARDS,
          payload: { cardIds, playerId: player.id }
        });
      }
      
    } else if (socket) {
      // Socket mode
      socket.emit(MessageType.PLAY_CARDS, { cardIds });
    }
  };

  // Handle selecting a winner
  const selectWinner = (playerId: string) => {
    if (isP2PMode && p2pConnection) {
      if (isHost && room) {
        // If host, process locally and broadcast
        const updatedRoom = p2pSelectWinner(room, playerId);
        setRoom(updatedRoom);
        
        // Broadcast winner selection
        p2pConnection.broadcast({
          type: MessageType.WINNER_SELECTED,
          payload: { playerId, room: updatedRoom }
        });
        
        // Start new round after a delay if not game over
        if (updatedRoom.state === GameState.ROUND_END) {
          setTimeout(() => {
            if (room && room.state === GameState.ROUND_END) {
              const newRoundRoom = startNewRound(room);
              setRoom(newRoundRoom);
              
              // Update local player state
              const localPlayer = newRoundRoom.players.find(p => p.id === player?.id);
              if (localPlayer) {
                setPlayer(localPlayer);
              }
              
              // Broadcast new round
              p2pConnection.broadcast({
                type: MessageType.ROOM_UPDATED,
                payload: { room: newRoundRoom }
              });
            }
          }, 3000); // 3 second delay before new round
        }
      } else {
        // If player, send to host
        p2pConnection.send({
          type: MessageType.SELECT_WINNER,
          payload: { playerId }
        });
      }
      
    } else if (socket) {
      // Socket mode
      socket.emit(MessageType.SELECT_WINNER, { playerId });
    }
  };

  return (
    <GameContext.Provider value={{
      connected,
      room,
      player,
      error,
      isP2PMode,
      isHost,
      createRoom,
      joinRoom,
      leaveRoom,
      startGame,
      playCards,
      selectWinner
    }}>
      {children}
    </GameContext.Provider>
  );
};