import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import Home from './pages/Home';
import CharacterSelect from './pages/CharacterSelect';
import Game from './pages/Game';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Router basename="/auto-chess-battle-v2">
        <div className="App">
          <header className="App-header">
            <h1>自走棋對戰 <span className="version">v2.0</span></h1>
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/select" element={<CharacterSelect />} />
            <Route path="/game" element={<Game />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;