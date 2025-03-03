import React from 'react';
import { BlackCard, WhiteCard as WhiteCardType } from '../../shared/types';
import '../styles/card.css';

interface CardProps {
  card: BlackCard | WhiteCardType;
  isBlack?: boolean;
  isSelected?: boolean;
  isPlayed?: boolean;
  isWinner?: boolean;
  onClick?: () => void;
  index?: number;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  isBlack = false,
  isSelected = false,
  isPlayed = false,
  isWinner = false,
  onClick,
  index = 0
}) => {
  const cardClass = `card ${isBlack ? 'black-card' : 'white-card'} ${isSelected ? 'selected' : ''} ${isWinner ? 'winner' : ''} ${isPlayed ? 'played' : ''}`;
  
  const getDelayStyle = () => {
    // Add a staggered animation delay for cards being dealt
    return { 
      animationDelay: `${index * 100}ms`,
      transitionDelay: `${index * 50}ms`
    };
  };

  return (
    <div 
      className={cardClass} 
      onClick={onClick} 
      style={getDelayStyle()}
    >
      <div className="card-inner">
        <div className="card-content">
          <p>{card.text}</p>
          
          {isBlack && 'pick' in card && (
            <div className="card-pick">
              Pick: {card.pick}
            </div>
          )}

          <div className="card-logo">
            <span>Cards Against Humanity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;