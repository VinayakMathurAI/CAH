import { Room, Player, GameState, BlackCard, WhiteCard, PlayedCards } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';

// Get initial black and white cards
const getInitialCards = () => {
  // Sample black cards
  const blackCards: BlackCard[] = [
    { id: uuidv4(), text: "Why can't I sleep at night?", pick: 1 },
    { id: uuidv4(), text: "I got 99 problems but ____ ain't one.", pick: 1 },
    { id: uuidv4(), text: "What's a girl's best friend?", pick: 1 },
    { id: uuidv4(), text: "What's that smell?", pick: 1 },
    { id: uuidv4(), text: "This is the way the world ends. Not with a bang but with ____.", pick: 1 },
    { id: uuidv4(), text: "What will I bring back in time to convince people that I am a powerful wizard?", pick: 1 },
    { id: uuidv4(), text: "____ + ____ = ____", pick: 3 },
    { id: uuidv4(), text: "Make a haiku.", pick: 3 }
  ];
  
  // Sample white cards
  const whiteCards: WhiteCard[] = [
    { id: uuidv4(), text: "Flying sex snakes." },
    { id: uuidv4(), text: "Michelle Obama's arms." },
    { id: uuidv4(), text: "German dungeon porn." },
    { id: uuidv4(), text: "White privilege." },
    { id: uuidv4(), text: "Getting so angry that you pop a boner." },
    { id: uuidv4(), text: "Tasteful sideboob." },
    { id: uuidv4(), text: "Praying the gay away." },
    { id: uuidv4(), text: "Two midgets shitting into a bucket." },
    { id: uuidv4(), text: "MechaHitler." },
    { id: uuidv4(), text: "Being a motherfucking sorcerer." },
    { id: uuidv4(), text: "A disappointing birthday party." },
    { id: uuidv4(), text: "Puppies!" },
    { id: uuidv4(), text: "A windmill full of corpses." },
    { id: uuidv4(), text: "Guys who don't call." },
    { id: uuidv4(), text: "Racially-biased SAT questions." },
    { id: uuidv4(), text: "Dying." },
    { id: uuidv4(), text: "Steven Hawking talking dirty." },
    { id: uuidv4(), text: "Being on fire." },
    { id: uuidv4(), text: "A lifetime of sadness." },
    { id: uuidv4(), text: "An erection that lasts longer than four hours." },
    { id: uuidv4(), text: "AIDS." },
    { id: uuidv4(), text: "Same-sex ice dancing." },
    { id: uuidv4(), text: "Glenn Beck catching his scrotum on a curtain hook." },
    { id: uuidv4(), text: "The Rapture." }
  ];
  
  return { blackCards, whiteCards };
};

// Shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Deal cards to players
export const dealCards = (room: Room, count: number = 10): Room => {
  const { whiteCards } = getInitialCards();
  const shuffledCards = shuffleArray(whiteCards);
  
  let cardIndex = 0;
  const updatedPlayers = room.players.map(player => {
    // Only deal cards to players who need them
    if (player.hand.length < count) {
      const cardsNeeded = count - player.hand.length;
      const newCards = shuffledCards.slice(cardIndex, cardIndex + cardsNeeded);
      cardIndex += cardsNeeded;
      
      return {
        ...player,
        hand: [...player.hand, ...newCards]
      };
    }
    return player;
  });
  
  return {
    ...room,
    players: updatedPlayers
  };
};

// Get a new black card
export const getNewBlackCard = (room: Room): Room => {
  const { blackCards } = getInitialCards();
  const shuffledCards = shuffleArray(blackCards);
  
  return {
    ...room,
    currentBlackCard: shuffledCards[0]
  };
};

// Start a new game
export const startNewGame = (room: Room): Room => {
  // Select first card czar randomly
  const czarIndex = Math.floor(Math.random() * room.players.length);
  
  // Update all players
  const updatedPlayers = room.players.map((player, index) => ({
    ...player,
    isCardCzar: index === czarIndex,
    points: 0,
    hand: []
  }));
  
  // Create updated room
  let updatedRoom: Room = {
    ...room,
    players: updatedPlayers,
    round: 1,
    state: GameState.PLAYING,
    playedCards: [],
    currentBlackCard: null
  };
  
  // Deal cards and get black card
  updatedRoom = dealCards(updatedRoom);
  updatedRoom = getNewBlackCard(updatedRoom);
  
  return updatedRoom;
};

// Play cards
export const playCards = (room: Room, playerId: string, cardIds: string[]): Room => {
  // Find player
  const playerIndex = room.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return room;
  
  const player = room.players[playerIndex];
  
  // Check if player is card czar or already played
  if (player.isCardCzar || room.playedCards.some(pc => pc.playerId === playerId)) {
    return room;
  }
  
  // Get cards from player's hand
  const playedCards: WhiteCard[] = [];
  const newHand: WhiteCard[] = [...player.hand];
  
  for (const cardId of cardIds) {
    const cardIndex = newHand.findIndex(c => c.id === cardId);
    if (cardIndex !== -1) {
      playedCards.push(newHand[cardIndex]);
      newHand.splice(cardIndex, 1);
    }
  }
  
  // Update player's hand
  const updatedPlayers = [...room.players];
  updatedPlayers[playerIndex] = {
    ...player,
    hand: newHand
  };
  
  // Add played cards
  const updatedPlayedCards = [
    ...room.playedCards,
    {
      playerId,
      cards: playedCards
    }
  ];
  
  // Check if all non-czar players have played
  const nonCzarCount = room.players.filter(p => !p.isCardCzar).length;
  const newState = updatedPlayedCards.length >= nonCzarCount ? GameState.JUDGING : room.state;
  
  // Deal new cards if needed
  const updatedRoom: Room = {
    ...room,
    players: updatedPlayers,
    playedCards: updatedPlayedCards,
    state: newState
  };
  
  // Deal new cards to replace the ones played
  return dealCards(updatedRoom);
};

// Select a winner
export const selectWinner = (room: Room, playerId: string): Room => {
  // Check if valid state
  if (room.state !== GameState.JUDGING) return room;
  
  // Find winner's played cards
  const winningEntry = room.playedCards.find(pc => pc.playerId === playerId);
  if (!winningEntry) return room;
  
  // Update player's points
  const updatedPlayers = room.players.map(player => {
    if (player.id === playerId) {
      return {
        ...player,
        points: player.points + 1
      };
    }
    return player;
  });
  
  // Check for game over
  const winner = updatedPlayers.find(p => p.points >= room.pointsToWin);
  const newState = winner ? GameState.GAME_OVER : GameState.ROUND_END;
  
  return {
    ...room,
    players: updatedPlayers,
    state: newState
  };
};

// Start a new round
export const startNewRound = (room: Room): Room => {
  // Find current card czar
  const currentCzarIndex = room.players.findIndex(p => p.isCardCzar);
  const nextCzarIndex = (currentCzarIndex + 1) % room.players.length;
  
  // Update all players
  const updatedPlayers = room.players.map((player, index) => ({
    ...player,
    isCardCzar: index === nextCzarIndex
  }));
  
  // Create updated room
  let updatedRoom: Room = {
    ...room,
    players: updatedPlayers,
    round: room.round + 1,
    state: GameState.PLAYING,
    playedCards: []
  };
  
  // Get a new black card
  updatedRoom = getNewBlackCard(updatedRoom);
  
  return updatedRoom;
};