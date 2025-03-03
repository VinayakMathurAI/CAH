import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Home from './components/Home';
import Lobby from './components/Lobby';
import Game from './components/Game';
import { Room, Player, MessageType, GameState } from '../shared/types';
import './styles/app.css';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Connect to the socket server
  useEffect(() => {
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
    socketConnection.on(MessageType.ERROR, (data: { message: string }) => {
      setError(data.message);
      setTimeout(() => setError(null), 5000);
    });

    socketConnection.on(MessageType.ROOM_CREATED, (data: { room: Room }) => {
      setRoom(data.room);
      setPlayer(data.room.players.find(p => p.id === socketConnection.id) || null);
    });

    socketConnection.on(MessageType.ROOM_JOINED, (data: { room: Room }) => {
      setRoom(data.room);
      setPlayer(data.room.players.find(p => p.id === socketConnection.id) || null);
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
      setPlayer(data.room.players.find(p => p.id === socketConnection.id) || null);
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

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Handle creating a room
  const createRoom = (playerName: string, roomName: string) => {
    if (socket) {
      socket.emit(MessageType.CREATE_ROOM, { playerName, roomName });
    }
  };

  // Handle joining a room
  const joinRoom = (playerName: string, roomId: string) => {
    if (socket) {
      socket.emit(MessageType.JOIN_ROOM, { playerName, roomId });
    }
  };

  // Handle leaving a room
  const leaveRoom = () => {
    if (socket) {
      socket.emit(MessageType.LEAVE_ROOM);
      setRoom(null);
      setPlayer(null);
    }
  };

  // Handle starting the game
  const startGame = () => {
    if (socket) {
      socket.emit(MessageType.START_GAME);
    }
  };

  // Handle playing cards
  const playCards = (cardIds: string[]) => {
    if (socket) {
      socket.emit(MessageType.PLAY_CARDS, { cardIds });
    }
  };

  // Handle selecting winner
  const selectWinner = (playerId: string) => {
    if (socket) {
      socket.emit(MessageType.SELECT_WINNER, { playerId });
    }
  };

  // Render different components based on game state
  const renderContent = () => {
    if (!connected) {
      return <div className="loading">Connecting to server...</div>;
    }

    if (!room) {
      return <Home createRoom={createRoom} joinRoom={joinRoom} />;
    }

    if (room.state === GameState.LOBBY) {
      return (
        <Lobby 
          room={room} 
          player={player} 
          startGame={startGame}
          leaveRoom={leaveRoom}
        />
      );
    }

    return (
      <Game 
        room={room} 
        player={player} 
        playCards={playCards}
        selectWinner={selectWinner}
        leaveRoom={leaveRoom}
      />
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cards Against Humanity</h1>
      </header>
      
      {error && <div className="error-message">{error}</div>}
      
      <main className="app-content">
        {renderContent()}
      </main>
      
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Cards Against Humanity Online</p>
      </footer>
    </div>
  );
};

export default App;