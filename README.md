# Cards Against Humanity Online

A multiplayer online version of the popular party game Cards Against Humanity. This web application allows players to create or join game rooms and play with friends remotely.

## Features

- Room-based multiplayer system
- Smooth card animations
- Real-time game updates with Socket.IO
- Mobile-friendly responsive design
- Faithful recreation of the original gameplay

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Build the client and server
   ```
   npm run build
   ```

4. Start the server
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Development

To run the application in development mode with hot reloading:

```
npm run dev
```

## How to Play

1. **Create a Room**
   - Enter your name and create a new game room
   - Share the room code with friends

2. **Join a Room**
   - Enter your name and the room code to join
   - Wait for the host to start the game

3. **Game Rules**
   - One player is randomly chosen as the Card Czar each round
   - The Card Czar reveals a black card with a question or fill-in-the-blank statement
   - Other players select white card(s) from their hand to answer
   - The Card Czar reviews all answers and picks their favorite
   - The player who submitted the chosen card gets a point
   - First player to reach the point goal wins!

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO
- **Build Tools**: Webpack, Babel

## Customization

You can customize various game settings:
- Points required to win
- Maximum players per room
- Adding your own card content

See `src/shared/cards.ts` to modify the card decks.

## License

This project is for educational purposes only. Cards Against Humanity is owned by Cards Against Humanity LLC.

## Acknowledgments

- Inspired by the original Cards Against Humanity card game
- This implementation is not affiliated with or endorsed by Cards Against Humanity LLC