import { BlackCard, WhiteCard } from './types';
import { v4 as uuidv4 } from 'uuid';

// Sample set of black cards
export const blackCards: BlackCard[] = [
  {
    id: uuidv4(),
    text: "Why can't I sleep at night?",
    pick: 1
  },
  {
    id: uuidv4(),
    text: "I got 99 problems but ____ ain't one.",
    pick: 1
  },
  {
    id: uuidv4(),
    text: "What's a girl's best friend?",
    pick: 1
  },
  {
    id: uuidv4(),
    text: "What's that smell?",
    pick: 1
  },
  {
    id: uuidv4(),
    text: "This is the way the world ends. Not with a bang but with ____.",
    pick: 1
  },
  {
    id: uuidv4(),
    text: "What will I bring back in time to convince people that I am a powerful wizard?",
    pick: 1
  },
  {
    id: uuidv4(),
    text: "____ + ____ = ____",
    pick: 3
  },
  {
    id: uuidv4(),
    text: "Make a haiku.",
    pick: 3
  },
  {
    id: uuidv4(),
    text: "In M. Night Shyamalan's new movie, Bruce Willis discovers that ____ had really been ____ all along.",
    pick: 2
  },
  {
    id: uuidv4(),
    text: "Life for American Indians was forever changed when the White Man introduced them to ____.",
    pick: 1
  }
];

// Sample set of white cards
export const whiteCards: WhiteCard[] = [
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
  { id: uuidv4(), text: "The Rapture." },
  { id: uuidv4(), text: "Pterodactyl eggs." },
  { id: uuidv4(), text: "Crippling debt." },
  { id: uuidv4(), text: "Eugenics." },
  { id: uuidv4(), text: "Exchanging pleasantries." },
  { id: uuidv4(), text: "My relationship status." },
  { id: uuidv4(), text: "Auschwitz." }
];

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