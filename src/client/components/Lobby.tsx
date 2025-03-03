import React from 'react';
import { Room, Player } from '../../shared/types';
import '../styles/lobby.css';

interface LobbyProps {
  room: Room;
  player: Player | null;
  startGame: () => void;
  leaveRoom: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ room, player, startGame, leaveRoom }) => {
  // Check if current player is host (first player in the room)
  const isHost = player && room.players.length > 0 && player.id === room.players[0].id;

  return (
    <div className="lobby-container">
      <div className="lobby-header">
        <h2>{room.name}</h2>
        <div className="room-code">
          <span>Room Code:</span>
          <code>{room.id}</code>
          <button 
            className="copy-button"
            onClick={() => navigator.clipboard.writeText(room.id)}
          >
            Copy
          </button>
        </div>
      </div>

      <div className="lobby-content">
        <div className="players-list">
          <h3>Players ({room.players.length}/{room.maxPlayers})</h3>
          <ul>
            {room.players.map((p) => (
              <li key={p.id} className={p.id === player?.id ? 'current-player' : ''}>
                {p.name} {p.id === player?.id ? '(You)' : ''}
                {room.players[0].id === p.id ? ' (Host)' : ''}
              </li>
            ))}
          </ul>
          <p className="min-players-note">
            {room.players.length < 3 
              ? `Need at least 3 players to start (${3 - room.players.length} more needed)` 
              : 'Ready to start!'}
          </p>
        </div>

        <div className="lobby-info">
          <div className="game-settings">
            <h3>Game Settings</h3>
            <div className="setting">
              <span>Points to win:</span>
              <span>{room.pointsToWin}</span>
            </div>
          </div>

          <div className="game-instructions">
            <h3>How to Play</h3>
            <ul>
              <li>One player will be randomly selected as the Card Czar each round</li>
              <li>The Card Czar reads the black card</li>
              <li>Other players choose their funniest white card(s) to complete the phrase</li>
              <li>The Card Czar picks their favorite answer</li>
              <li>Whoever played that card gets a point</li>
              <li>First player to {room.pointsToWin} points wins!</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="lobby-footer">
        <button 
          className="leave-button" 
          onClick={leaveRoom}
        >
          Leave Room
        </button>
        
        {isHost && (
          <button 
            className="start-button primary"
            disabled={room.players.length < 3} 
            onClick={startGame}
          >
            Start Game
          </button>
        )}
        
        {!isHost && (
          <div className="waiting-message">
            Waiting for host to start the game...
          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;