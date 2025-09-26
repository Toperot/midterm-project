import React from 'react';
import { GameProvider } from './contexts/GameContext';
import { GameUI } from './components/GameUI';
import './App.css';

function App() {
  return (
    <GameProvider>
      <GameUI />
    </GameProvider>
  );
}

export default App;