import { BlackCard, WhiteCard } from './types';
import { v4 as uuidv4 } from 'uuid';
import { blackCards, whiteCards } from './cardData';

// Export the cards for use in the game
export { blackCards, whiteCards };

// Get a shuffled copy of cards
export function shuffleCards<T>(cards: T[]): T[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Draw a specified number of cards from a deck
export function drawCards<T>(cards: T[], count: number): T[] {
  if (count > cards.length) {
    throw new Error("Not enough cards in the deck");
  }
  return cards.splice(0, count);
}