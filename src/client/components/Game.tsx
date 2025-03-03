import React, { useState, useEffect } from 'react';
import { Room, Player, GameState, PlayedCards, WhiteCard } from '../../shared/types';
import Card from './Card';
import PlayersList from './PlayersList';
import '../styles/game.css';

interface GameProps {
  room: Room;
  player: Player | null;
  playCards: (cardIds: string[]) => void;
  selectWinner: (playerId: string) => void;
  leaveRoom: () => void;
}

const Game: React.FC<GameProps> = ({ room, player, playCards, selectWinner, leaveRoom }) => {
  const [selectedCards, setSelectedCards] = useState<WhiteCard[]>([]);
  const [cardsRequiredCount, setCardsRequiredCount] = useState<number>(1);
  const [viewingPlayedCards, setViewingPlayedCards] = useState<PlayedCards | null>(null);
  
  // Reset selections when the round changes
  useEffect(() => {
    setSelectedCards([]);
    if (room.currentBlackCard) {
      setCardsRequiredCount(room.currentBlackCard.pick);
    }
  }, [room.round, room.currentBlackCard]);

  // Handle card selection
  const handleCardSelect = (card: WhiteCard) => {
    if (player?.isCardCzar || room.state !== GameState.PLAYING) return;
    
    // Check if player has already played cards this round
    const playerHasPlayed = room.playedCards.some(pc => pc.playerId === player?.id);
    if (playerHasPlayed) return;

    // Toggle card selection
    if (selectedCards.some(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else {
      if (selectedCards.length < cardsRequiredCount) {
        setSelectedCards([...selectedCards, card]);
      }
    }
  };

  // Handle submitting cards
  const handleSubmitCards = () => {
    if (selectedCards.length === cardsRequiredCount) {
      playCards(selectedCards.map(card => card.id));
    }
  };

  // Handle viewing a played card set
  const handleViewPlayedCards = (playedCard: PlayedCards) => {
    setViewingPlayedCards(playedCard);
  };

  // Handle selecting a winner
  const handleSelectWinner = () => {
    if (viewingPlayedCards && player?.isCardCzar && room.state === GameState.JUDGING) {
      selectWinner(viewingPlayedCards.playerId);
    }
  };

  // Close played card view
  const handleClosePlayedCardView = () => {
    setViewingPlayedCards(null);
  };

  // Find if current player has already played
  const hasPlayedCards = player && room.playedCards.some(pc => pc.playerId === player.id);
  
  // Is this player the card czar?
  const isCardCzar = player?.isCardCzar;
  
  // Get current player's played cards
  const myPlayedCards = player && room.playedCards.find(pc => pc.playerId === player.id);

  // Render the black card
  const renderBlackCard = () => {
    if (!room.currentBlackCard) return null;
    
    return (
      <div className="black-card-container">
        <Card 
          card={room.currentBlackCard}
          isBlack={true}
        />
      </div>
    );
  };

  // Render the player's hand
  const renderPlayerHand = () => {
    if (!player || !player.hand || isCardCzar) return null;
    
    return (
      <div className="player-hand">
        <h3>Your Hand</h3>
        <div className="cards-container">
          {player.hand.map((card, index) => (
            <Card 
              key={card.id}
              card={card} 
              isSelected={selectedCards.some(c => c.id === card.id)}
              onClick={() => handleCardSelect(card)}
              index={index}
            />
          ))}
        </div>
        
        {room.state === GameState.PLAYING && !hasPlayedCards && (
          <div className="card-selection-status">
            <span>{selectedCards.length} of {cardsRequiredCount} cards selected</span>
            <button 
              className="submit-cards-btn primary" 
              disabled={selectedCards.length !== cardsRequiredCount}
              onClick={handleSubmitCards}
            >
              Submit Cards
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render played cards for Card Czar
  const renderPlayedCards = () => {
    if (room.state !== GameState.JUDGING) return null;
    
    return (
      <div className="played-cards-container">
        <h3>
          {isCardCzar 
            ? "Choose the winner!" 
            : "Card Czar is choosing the winner..."}
        </h3>
        
        <div className="cards-container">
          {room.playedCards.map((playedCard, index) => (
            <div 
              key={index} 
              className="played-card-set"
              onClick={() => isCardCzar && handleViewPlayedCards(playedCard)}
            >
              <div className="played-card-stack">
                {playedCard.cards.map((card, idx) => (
                  <div 
                    className="stacked-card" 
                    style={{ 
                      transform: `translateY(${idx * -5}px) translateX(${idx * 2}px) rotate(${idx * 2}deg)` 
                    }}
                    key={card.id}
                  >
                    <Card card={card} index={index} />
                  </div>
                ))}
              </div>
              <div className="card-label">Card Set {index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render viewed played cards modal
  const renderViewedPlayedCards = () => {
    if (!viewingPlayedCards) return null;
    
    return (
      <div className="modal-overlay" onClick={handleClosePlayedCardView}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Card Set</h3>
            <button className="close-btn" onClick={handleClosePlayedCardView}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="black-card-preview">
              {room.currentBlackCard && (
                <Card card={room.currentBlackCard} isBlack={true} />
              )}
            </div>
            
            <div className="white-cards-preview">
              {viewingPlayedCards.cards.map((card, index) => (
                <Card key={card.id} card={card} index={index} />
              ))}
            </div>
            
            {isCardCzar && room.state === GameState.JUDGING && (
              <button 
                className="select-winner-btn primary"
                onClick={handleSelectWinner}
              >
                Select as Winner
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render game state message
  const renderGameStateMessage = () => {
    if (room.state === GameState.PLAYING) {
      if (isCardCzar) {
        return <div className="game-message">You are the Card Czar this round! Wait for others to play their cards.</div>;
      } else if (hasPlayedCards) {
        return <div className="game-message">Cards submitted! Waiting for others to play...</div>;
      }
      return <div className="game-message">Select {cardsRequiredCount} card(s) to play!</div>;
    }
    
    if (room.state === GameState.JUDGING) {
      if (isCardCzar) {
        return <div className="game-message">You are the Card Czar! Select your favorite answer.</div>;
      }
      return <div className="game-message">Card Czar is selecting the winner...</div>;
    }
    
    if (room.state === GameState.ROUND_END) {
      const winner = room.players.find(p => 
        room.playedCards.find(pc => pc.playerId === p.id)?.playerId === viewingPlayedCards?.playerId
      );
      
      if (winner) {
        return <div className="game-message winner-message">{winner.name} wins this round!</div>;
      }
      
      return <div className="game-message">Round over! Starting next round soon...</div>;
    }
    
    if (room.state === GameState.GAME_OVER) {
      const winner = room.players.reduce((prev, current) => 
        (prev.points > current.points) ? prev : current
      );
      
      return (
        <div className="game-message winner-message">
          <h2>Game Over!</h2>
          <p>{winner.name} wins with {winner.points} points!</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Round {room.round}</h2>
        {renderGameStateMessage()}
      </div>
      
      <div className="game-content">
        <div className="game-main">
          {renderBlackCard()}
          {renderPlayedCards()}
          {renderPlayerHand()}
        </div>
        
        <div className="game-sidebar">
          <PlayersList room={room} player={player} />
          <button className="leave-game-btn" onClick={leaveRoom}>
            Leave Game
          </button>
        </div>
      </div>
      
      {renderViewedPlayedCards()}
    </div>
  );
};

export default Game;