import React from 'react';
import { Room, Player, GameState } from '../../shared/types';
import '../styles/players-list.css';

interface PlayersListProps {
  room: Room;
  player: Player | null;
}

const PlayersList: React.FC<PlayersListProps> = ({ room, player }) => {
  // Sort players by points (highest first)
  const sortedPlayers = [...room.players].sort((a, b) => b.points - a.points);
  
  return (
    <div className="players-list-container">
      <h3>Players</h3>
      
      <div className="players-header">
        <span className="player-name-header">Name</span>
        <span className="player-score-header">Score</span>
      </div>
      
      <ul className="players">
        {sortedPlayers.map((p) => {
          // Check if player has played this round
          const hasPlayed = room.state === GameState.PLAYING && 
            room.playedCards.some(pc => pc.playerId === p.id);
          
          // Get player status
          let status = '';
          if (p.isCardCzar) {
            status = 'Card Czar';
          } else if (hasPlayed) {
            status = 'Played';
          } else if (room.state === GameState.PLAYING) {
            status = 'Choosing...';
          }
          
          return (
            <li 
              key={p.id} 
              className={`player-item ${p.id === player?.id ? 'current-player' : ''} ${p.isCardCzar ? 'card-czar' : ''}`}
            >
              <div className="player-name">
                <span>{p.name}</span>
                {p.id === player?.id && <span className="you-label">(You)</span>}
              </div>
              <div className="player-score">{p.points}</div>
              {status && <div className="player-status">{status}</div>}
            </li>
          );
        })}
      </ul>
      
      <div className="game-info">
        <div className="info-item">
          <span className="info-label">Points to win:</span>
          <span className="info-value">{room.pointsToWin}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Round:</span>
          <span className="info-value">{room.round}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Room ID:</span>
          <span className="info-value room-id">{room.id}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayersList;