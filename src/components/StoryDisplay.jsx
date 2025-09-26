import React from 'react';
import { useGame } from '../contexts/GameContext';
import { ChoiceButton } from './ChoiceButton';

export const StoryDisplay = () => {
  const { currentStoryNode, availableChoices } = useGame();

  if (!currentStoryNode) {
    return <div className="alert alert-danger">Error: Story node not found.</div>;
  }

  return (
    <div className="story-display card p-4">
      <p className="lead story-text">{currentStoryNode.text}</p>
      
      <div className="d-grid gap-2 mt-4">
        {availableChoices.map((choice, index) => (
          <ChoiceButton key={index} choice={choice} />
        ))}
      </div>
    </div>
  );
};