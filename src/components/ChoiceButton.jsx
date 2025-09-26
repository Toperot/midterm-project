import React from 'react';
import { useGame } from '../contexts/GameContext';

export const ChoiceButton = ({ choice }) => {
  const { makeChoice, gameState } = useGame();
  
  const getButtonClass = () => {
    if (choice.to === 'goodEnding') return 'btn-success';
    if (choice.to.includes('Damage') || choice.to.includes('fight')) return 'btn-danger';
    return 'btn-info';
  };

  return (
    <button
      className={`btn ${getButtonClass()} w-100 mb-2`}
      onClick={() => makeChoice(choice)}
    >
      {choice.text}
      {choice.requires && !gameState.inventory.includes(choice.requires) && (
        <span className="ms-2 badge bg-dark">Requires: {choice.requires}</span>
      )}
    </button>
  );
};