import React, { useState } from 'react';
import '../styles/home.css';

interface HomeProps {
  createRoom: (playerName: string, roomName: string) => void;
  joinRoom: (playerName: string, roomId: string) => void;
}

const Home: React.FC<HomeProps> = ({ createRoom, joinRoom }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName && roomName) {
      createRoom(playerName, roomName);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName && roomId) {
      joinRoom(playerName, roomId);
    }
  };

  return (
    <div className="home-container">
      <div className="logo">
        <h2>Cards Against Humanity</h2>
        <p className="tagline">A party game for horrible people.</p>
      </div>
      
      <div className="card">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Room
          </button>
          <button 
            className={`tab ${activeTab === 'join' ? 'active' : ''}`}
            onClick={() => setActiveTab('join')}
          >
            Join Room
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'create' ? (
            <form onSubmit={handleCreateRoom}>
              <div className="form-group">
                <label htmlFor="playerName">Your Name</label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  maxLength={20}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="roomName">Room Name</label>
                <input
                  type="text"
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  required
                  maxLength={30}
                />
              </div>
              
              <button 
                type="submit" 
                className="primary"
                disabled={!playerName || !roomName}
              >
                Create Room
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinRoom}>
              <div className="form-group">
                <label htmlFor="playerNameJoin">Your Name</label>
                <input
                  type="text"
                  id="playerNameJoin"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  maxLength={20}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="roomId">Room Code</label>
                <input
                  type="text"
                  id="roomId"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room code"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="primary"
                disabled={!playerName || !roomId}
              >
                Join Room
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="instructions">
        <h3>How to Play</h3>
        <p>Cards Against Humanity is a party game where players complete fill-in-the-blank statements using phrases typically deemed as offensive, risqué, or politically incorrect.</p>
        <p>One player is the Card Czar and reads a black card. Everyone else answers with their funniest white card. The Card Czar picks the funniest combo, and that player gets a point.</p>
      </div>
    </div>
  );
};

export default Home;