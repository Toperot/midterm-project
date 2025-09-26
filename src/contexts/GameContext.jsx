import React, { createContext, useContext, useCallback, useMemo } from 'react';
import storyData from '../data/story.json';
import { useLocalStorage } from '../hooks/useLocalStorage';

// --- INITIAL STATE & DEFAULT CONTEXT ---
const STORY_START_ID = 'start';
const GAME_OVER_HP_ID = 'gameOver_hp';
const INITIAL_STATE = {
  playerName: '',
  hp: 100,
  inventory: [],
  currentStoryNodeId: STORY_START_ID,
  isGameOver: false,
  isGameWon: false,
};

const GameContext = createContext();

// --- PROVIDER COMPONENT ---
export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useLocalStorage('aswangHunterState', INITIAL_STATE);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
    }, [setGameState]);

  // --- Core Game Reset Function ---
  const startGame = useCallback((name) => {
    setGameState({
      ...INITIAL_STATE,
      playerName: name,
    });
  }, [setGameState]);

  // --- Core Game Logic Handler ---
  const makeChoice = useCallback((choice) => {
    const currentNode = storyData[gameState.currentStoryNodeId];

    if (!currentNode) {
        console.error("Invalid current story node ID:", gameState.currentStoryNodeId);
        return;
    }

    //Check item requirement
    if (choice.requires && !gameState.inventory.includes(choice.requires)) {
      console.warn("Attempted to make a choice without required item:", choice.requires);
      return;
    }

    setGameState(prev => {
      let newState = { ...prev, currentStoryNodeId: choice.to };
      
      const nextNode = storyData[choice.to];

      //Apply onArrive effects from the NEXT node
      if (nextNode?.onArrive) {
        const { addItem, takeDamage } = nextNode.onArrive;
        
        if (addItem && !newState.inventory.includes(addItem)) {
          newState.inventory = [...newState.inventory, addItem];
        }

        if (takeDamage) {
          newState.hp = Math.max(0, newState.hp - takeDamage);
        }
      }

      //Check for Game Over/Victory based on the next node's properties
      if (nextNode?.isEnding) {
        if (choice.to === 'goodEnding') {
          newState.isGameWon = true;
        } else {
          newState.isGameOver = true;
        }
      }

      //HP Loss Condition Check (Crucial requirement)
      if (newState.hp <= 0 && !newState.isGameOver) {
          newState.isGameOver = true;
          newState.currentStoryNodeId = GAME_OVER_HP_ID;
      }

      return newState;
    });
  }, [gameState.currentStoryNodeId, setGameState]);

  // --- Selectors ---
  const currentStoryNode = useMemo(() => storyData[gameState.currentStoryNodeId], [gameState.currentStoryNodeId]);

  const availableChoices = useMemo(() => {
    if (!currentStoryNode?.choices) return [];

    return currentStoryNode.choices.filter(choice => {
      // Hides choice if a 'requires' item is NOT in the inventory
      if (choice.requires && !gameState.inventory.includes(choice.requires)) {
        return false;
      }
      // Hides choice if a 'hideIf' item IS in the inventory
      if (choice.hideIf && gameState.inventory.includes(choice.hideIf)) {
          return false;
      }
      return true;
    });
  }, [currentStoryNode, gameState.inventory]);
  
  // --- Context Value ---
  const value = useMemo(() => ({
    gameState,
    currentStoryNode,
    availableChoices,
    startGame,
    makeChoice,
    resetGame,
  }), [gameState, currentStoryNode, availableChoices, startGame, makeChoice, resetGame]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// --- Custom Hook to use the Context ---
export const useGame = () => useContext(GameContext);