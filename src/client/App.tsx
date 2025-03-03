import React from 'react';
import Home from './components/Home';
import Lobby from './components/Lobby';
import Game from './components/Game';
import { GameState } from '../shared/types';
import { GameProvider, useGame } from './contexts/GameContext';
import './styles/app.css';

const GameContent: React.FC = () => {
  const { connected, room, player, error, createRoom, joinRoom, leaveRoom, startGame, playCards, selectWinner, isP2PMode } = useGame();

  // Render different components based on game state
  const renderContent = () => {
    if (!connected) {
      return <div className="loading">Connecting to server...</div>;
    }

    if (!room) {
      return <Home createRoom={(playerName, roomName) => createRoom(playerName, roomName, isP2PMode)} joinRoom={(playerName, roomId) => joinRoom(playerName, roomId, isP2PMode)} />;
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
        <h1>Cards Against Humanity {isP2PMode ? "(P2P Mode)" : ""}</h1>
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

const App: React.FC = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default App;