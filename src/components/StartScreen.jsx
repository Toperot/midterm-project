import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';

export const StartScreen = () => {
  const { startGame } = useGame();
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      startGame(name.trim());
    }
  };

  return (
    <div className="splash-screen">
        <div className="start-screen">
            <h1 className="horror-title">Aswang Hunter</h1>
            <p className='text-white mb-5'>A Choose Your Own Adventure RPG</p>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="playerName" className="form-label text-white">Enter your Hunter Name:</label>
                    <input
                        type="text"
                        className="form-control form-control-lg bg-dark text-white border-danger input-center" // 2. Updated input styles for horror theme
                        id="playerName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Kulas"
                        required
                        aria-label="Hunter Name Input"
                    />
                </div>
                <button type="submit" className="btn btn-danger btn-lg mt-3" disabled={!name.trim()}>
                    Start Hunt
                </button>
            </form>
        </div>
    </div>
  );
};
