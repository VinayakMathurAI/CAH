# Cards Against Humanity Online

A multiplayer online version of the popular party game Cards Against Humanity. This web application allows players to create or join game rooms and play with friends remotely, with support for both server-based and peer-to-peer gameplay.

## Features

- Room-based multiplayer system
- Smooth card animations with visual feedback
- Real-time game updates via Socket.IO (server mode) or WebRTC (P2P mode)
- Peer-to-peer connectivity option for direct play without a central server
- Clear player status indicators
- Mobile-friendly responsive design
- Faithful recreation of the original gameplay

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cards Against Humanity Online                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
           ┌───────────────────┐│┌────────────────────┐
           │                   ││                     │
┌──────────▼───────────┐  ┌────▼▼───────────────┐  ┌──▼─────────────────────┐
│   Client Frontend    │  │  Server Backend     │  │  P2P Connection Layer   │
│                      │  │                     │  │                         │
│ ┌──────────────────┐ │  │ ┌─────────────────┐ │  │ ┌─────────────────────┐ │
│ │ React Components │ │  │ │ Express Server  │ │  │ │ WebRTC Signaling    │ │
│ └────────┬─────────┘ │  │ └────────┬────────┘ │  │ └────────┬────────────┘ │
│          │           │  │          │          │  │          │              │
│ ┌────────▼─────────┐ │  │ ┌────────▼────────┐ │  │ ┌────────▼────────────┐ │
│ │ Game Context API │◄├──┼─►   Socket.IO    │◄├──┼─►  Peer Connections    │ │
│ └────────┬─────────┘ │  │ └────────┬────────┘ │  │ └────────┬────────────┘ │
│          │           │  │          │          │  │          │              │
│ ┌────────▼─────────┐ │  │ ┌────────▼────────┐ │  │ ┌────────▼────────────┐ │
│ │   Game State     │◄├──┼─► Game Controller │◄├──┼─►  P2P Game Logic     │ │
│ └──────────────────┘ │  │ └─────────────────┘ │  │ └─────────────────────┘ │
│                      │  │                     │  │                         │
└──────────────────────┘  └─────────────────────┘  └─────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/VinayakMathurAI/CAH.git
   cd CAH
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

### P2P Mode Setup

The P2P mode allows players to connect directly to each other without a central server:

1. The host creates a room in P2P mode
2. The host shares the room code with other players
3. Other players join using the room code (make sure to select P2P mode)
4. All communication happens directly between players' browsers using WebRTC

Note: For full P2P functionality in a production environment, you might need to:
- Set up a TURN server for situations where direct peer connections cannot be established
- Implement additional security measures for room access

## How to Play

1. **Create a Room**
   - Enter your name and create a new game room
   - Choose between server or P2P mode
   - Share the room code with friends

2. **Join a Room**
   - Enter your name and the room code to join
   - Select the same connection mode (server or P2P) that the host used
   - Wait for the host to start the game

3. **Game Rules**
   - One player is randomly chosen as the Card Czar each round
   - The Card Czar reveals a black card with a question or fill-in-the-blank statement
   - Other players select white card(s) from their hand to answer
   - Selected cards are highlighted with a pulsing border
   - Player submission status is clearly indicated
   - The Card Czar reviews all answers and picks their favorite
   - The player who submitted the chosen card gets a point
   - First player to reach the point goal wins!

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO (server mode), WebRTC (P2P mode)
- **State Management**: React Context API
- **Build Tools**: Webpack, TypeScript

## Customization

You can customize various game settings:
- Points required to win
- Maximum players per room
- Adding your own card content

See `src/shared/cards.ts` to modify the card decks.

## Project Structure

```
├── src/
│   ├── client/             # Frontend code
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts for state
│   │   ├── styles/         # CSS styles
│   │   ├── utils/          # Utility functions
│   │   └── index.tsx       # Client entry point
│   ├── server/             # Backend code
│   │   ├── game.ts         # Game logic
│   │   └── index.ts        # Server entry point
│   └── shared/             # Shared code
│       ├── cards.ts        # Card definitions
│       └── types.ts        # TypeScript type definitions
├── public/                 # Static assets
├── dist/                   # Build output
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

## License

This project is for educational purposes only. Cards Against Humanity is owned by Cards Against Humanity LLC.

## Acknowledgments

- Inspired by the original Cards Against Humanity card game
- This implementation is not affiliated with or endorsed by Cards Against Humanity LLC