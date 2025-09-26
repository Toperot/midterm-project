import React from 'react';
import { useGame } from '../contexts/GameContext';
import storyData from '../data/story.json';

export const EndingScreen = () => {
  const { gameState, resetGame } = useGame();
  const { isGameWon, currentStoryNodeId, playerName } = gameState;

  const finalNode = storyData[currentStoryNodeId]; 
  
  const title = isGameWon ? 'VICTORY!' : 'GAME OVER';
  const titleClass = isGameWon ? 'text-success' : 'text-danger';
  const messageClass = isGameWon ? 'alert-success' : 'alert-danger';

  const handlePlayAgain = () => {
    resetGame();
  }

  return (
    <div className={`ending-screen card p-5 text-center ${messageClass}`}>
      {/* Apply the color class to the title */}
      <h1 className={`display-4 ${titleClass} horror-title`}>{title}</h1>
      <hr />
      {finalNode && <p className="lead text-white">{finalNode.text}</p>}
      
      <p className="mt-4 text-white">
        Thank you for playing, {playerName}.
      </p>

      <button className="btn btn-danger btn-lg mt-3" onClick={handlePlayAgain}>
        Play Again
      </button>
    </div>
  );
};