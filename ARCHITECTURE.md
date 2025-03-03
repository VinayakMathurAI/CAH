# Cards Against Humanity Online - Architecture Documentation

This document provides a detailed overview of the application architecture for the Cards Against Humanity Online game.

## System Architecture

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

## Detailed Component Architecture 

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT ARCHITECTURE                                   │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                         ┌──────────────▼────────────────┐
                         │         App Component         │
                         └──────────────┬────────────────┘
                                        │
                         ┌──────────────▼────────────────┐
                         │        Game Provider          │
                         │     (React Context API)       │
                         └─────┬─────────────────┬───────┘
                               │                 │
               ┌───────────────▼────┐    ┌───────▼────────────┐
               │   Socket.IO Mode   │    │     P2P Mode       │
               └───────────┬────────┘    └────────┬───────────┘
                           │                      │
       ┌───────────────────┴──────┐      ┌────────┴───────────────┐
       │                          │      │                        │
┌──────▼──────┐    ┌─────────────▼┐    ┌▼────────────┐    ┌──────▼──────┐
│    Home     │    │    Lobby     │    │    Game     │    │  Game Over  │
└─────────────┘    └─────────────┬┘    └┬────────────┘    └─────────────┘
                                 │      │
                        ┌────────▼──────▼───────┐
                        │                       │
              ┌─────────▼────────┐     ┌────────▼─────────┐
              │   Player Hand    │     │   Game Board     │
              └──────────────────┘     └──────────────────┘
                        │                       │
              ┌─────────▼────────┐     ┌────────▼─────────┐
              │      Card        │     │  Players List    │
              └──────────────────┘     └──────────────────┘
```

## Communication Flow

### Server Mode
```
┌───────────┐     HTTP/WebSocket     ┌────────────┐
│  Browser  │ ──────────────────────►│   Server   │
└─────┬─────┘                        └──────┬─────┘
      │                                     │
      │        Socket.IO Events             │
      │◄────────────────────────────────────┘
      │                                     
┌─────▼─────┐                               
│   React   │                               
│   App     │                               
└───────────┘                               
```

### P2P Mode
```
┌───────────┐     WebRTC Signaling      ┌────────────┐
│  Browser  │◄────────────────────────► │  Browser   │
│  (Host)   │                           │ (Player)   │
└─────┬─────┘                           └──────┬─────┘
      │                                        │
      │          P2P Data Channel              │
      │◄────────────────────────────────────────┘
      │                                     
┌─────▼─────┐                           ┌────▼─────┐
│   React   │                           │  React   │
│   App     │                           │  App     │
└───────────┘                           └──────────┘
```

## State Management

### Game Context API

The Game Context manages both Socket.IO and P2P connections and provides a unified interface to the components:

```
┌──────────────────────────────────────┐
│            GameContext               │
├──────────────────────────────────────┤
│ - connected: boolean                 │
│ - room: Room | null                  │
│ - player: Player | null              │
│ - error: string | null               │
│ - isP2PMode: boolean                 │
│ - isHost: boolean                    │
├──────────────────────────────────────┤
│ + createRoom()                       │
│ + joinRoom()                         │
│ + leaveRoom()                        │
│ + startGame()                        │
│ + playCards()                        │
│ + selectWinner()                     │
└──────────────────────────────────────┘
```

### Game State Types

```
┌───────────────┐     ┌─────────────────┐
│ GameState     │     │ Player          │
├───────────────┤     ├─────────────────┤
│ LOBBY         │     │ id: string      │
│ PLAYING       │     │ name: string    │
│ JUDGING       │     │ points: number  │
│ ROUND_END     │     │ hand: WhiteCard[]│
│ GAME_OVER     │     │ isCardCzar: bool│
└───────────────┘     └─────────────────┘

┌───────────────┐     ┌─────────────────┐
│ Room          │     │ WhiteCard       │
├───────────────┤     ├─────────────────┤
│ id: string    │     │ id: string      │
│ name: string  │     │ text: string    │
│ players: Player[]   └─────────────────┘
│ currentBlackCard    ┌─────────────────┐
│ round: number │     │ BlackCard       │
│ state: GameState    ├─────────────────┤
│ playedCards: []│    │ id: string      │
│ maxPlayers    │     │ text: string    │
│ pointsToWin   │     │ pick: number    │
└───────────────┘     └─────────────────┘
```

## P2P Implementation 

The P2P implementation uses a host-client model:

1. **Host Mode**:
   - Creates the game room
   - Manages the game state
   - Processes game logic
   - Broadcasts state changes to all connected peers

2. **Client Mode**:
   - Connects to the host
   - Sends actions (play card, select winner) to the host
   - Receives state updates from the host

The WebRTC connection setup follows this flow:

```
┌────────┐                       ┌────────┐
│ Host   │                       │ Player │
├────────┤                       ├────────┤
│        │                       │        │
│        │   1. Create Room      │        │
│        │◄──────────────────────│        │
│        │                       │        │
│        │   2. Join Request     │        │
│        │◄──────────────────────│        │
│        │                       │        │
│        │   3. Connection Setup │        │
│        │────────────────────► │        │
│        │                       │        │
│        │   4. Game State       │        │
│        │────────────────────► │        │
│        │                       │        │
│        │   5. Player Actions   │        │
│        │◄──────────────────────│        │
└────────┘                       └────────┘
```

## Design Decisions

1. **Dual Connection Modes**: The application supports both traditional client-server architecture using Socket.IO and a P2P mode using WebRTC, giving users flexibility in how they connect.

2. **Component Architecture**: Using React with TypeScript for type safety and a component-based architecture for better code organization and reusability.

3. **Context API for State Management**: Using React's Context API provides a clean way to manage global state without introducing additional dependencies.

4. **Game Logic Separation**: The game logic is separated from the UI components, allowing for easier testing and maintenance.

5. **Responsive Design**: The UI is designed to work well on various screen sizes, from desktop to mobile.

6. **Animation Feedback**: Visual feedback through animations helps users understand the game state and improves the user experience.

7. **Error Handling**: Comprehensive error handling for network issues and invalid game states.

## Future Enhancements

1. **Full WebRTC Implementation**: Complete the WebRTC implementation for true peer-to-peer gameplay.

2. **Custom Card Decks**: Allow users to create and share custom card decks.

3. **User Authentication**: Add user accounts for saving preferences and statistics.

4. **Spectator Mode**: Allow users to watch games without participating.

5. **Advanced Game Settings**: More customization options for game rules and scoring.

6. **Real-time Chat**: In-game chat functionality for players.

7. **End-to-end Encryption**: For secure P2P communication.