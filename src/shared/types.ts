export interface Player {
  id: string;
  name: string;
  points: number;
  hand: WhiteCard[];
  isCardCzar: boolean;
}

export interface WhiteCard {
  id: string;
  text: string;
}

export interface BlackCard {
  id: string;
  text: string;
  pick: number; // Number of cards to pick
}

export interface Room {
  id: string;
  name: string;
  players: Player[];
  currentBlackCard: BlackCard | null;
  round: number;
  state: GameState;
  playedCards: PlayedCards[];
  maxPlayers: number;
  pointsToWin: number;
}

export interface PlayedCards {
  playerId: string;
  cards: WhiteCard[];
}

export enum GameState {
  LOBBY = 'lobby',
  PLAYING = 'playing',
  JUDGING = 'judging',
  ROUND_END = 'round_end',
  GAME_OVER = 'game_over'
}

export interface GameMessage {
  type: string;
  payload: any;
}

// Message Types
export enum MessageType {
  // Room related
  CREATE_ROOM = 'create_room',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  ROOM_CREATED = 'room_created',
  ROOM_JOINED = 'room_joined',
  ROOM_UPDATED = 'room_updated',
  PLAYER_JOINED = 'player_joined',
  PLAYER_LEFT = 'player_left',
  
  // Game related
  START_GAME = 'start_game',
  GAME_STARTED = 'game_started',
  PLAY_CARDS = 'play_cards',
  CARDS_PLAYED = 'cards_played',
  SELECT_WINNER = 'select_winner',
  WINNER_SELECTED = 'winner_selected',
  ROUND_ENDED = 'round_ended',
  GAME_ENDED = 'game_ended',
  
  // Errors
  ERROR = 'error'
}