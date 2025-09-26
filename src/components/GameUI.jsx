import React, { useEffect, useMemo, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { StoryDisplay } from './StoryDisplay';
import { StatsPanel } from './StatsPanel';
import { EndingScreen } from './EndingScreen';
import { StartScreen } from './StartScreen';

import rainLoopSound from '../assets/Sounds/rain.mp3';
import victorySound from '../assets/Sounds/victory.mp3';
import defeatSound from '../assets/Sounds/defeat.mp3';
import startScreenMusic from '../assets/Sounds/bgmusic.mp3';
import monsterScreamSound from '../assets/Sounds/scream.mp3';
import playerDamageSound from '../assets/Sounds/damage.mp3';
import itemCollectSound from '../assets/Sounds/obtain.mp3';

export const GameUI = () => {
  const { gameState, currentStoryNode } = useGame();
  const { playerName, isGameOver, isGameWon } = gameState;

  const audioRef = useRef(null); 
  const victoryAudioRef = useRef(null); 
  const defeatAudioRef = useRef(null);
  const startMusicRef = useRef(null);
  const screamAudioRef = useRef(null);
  const damageAudioRef = useRef(null); 
  const collectAudioRef = useRef(null);

  const ScreenComponent = useMemo(() => {
    if (!playerName) {
      return StartScreen;
    }
    if (isGameOver || isGameWon) {
      return EndingScreen;
    }
    return StoryDisplay;
  }, [playerName, isGameOver, isGameWon]);


  const showStats = playerName && !isGameOver && !isGameWon;
  
  const isGameActive = !!playerName;
  
  const backgroundClass = isGameActive && currentStoryNode?.background 
                          ? `bg-${currentStoryNode.background}` 
                          : isGameOver ? 'bg-gameover' 
                          : isGameWon ? 'bg-victory' 
                          : currentStoryNode?.background 
                          ? `bg-${currentStoryNode.background}`
                          : '';


  const gameActiveWrapperClass = (isGameActive || isGameOver || isGameWon)
    ? `game-active-wrapper ${backgroundClass}` 
    : '';
    
  // -------------------------------------------------------------------------
  // AUDIO CONTROL LOGIC
  // -------------------------------------------------------------------------

  useEffect(() => {
    const rainAudio = audioRef.current;
    const victoryAudio = victoryAudioRef.current;
    const defeatAudio = defeatAudioRef.current;
    const startMusic = startMusicRef.current; 
    const screamAudio = screamAudioRef.current;
    const damageAudio = damageAudioRef.current; 
    const collectAudio = collectAudioRef.current;

    const pauseEndingSounds = () => {
      victoryAudio?.pause();
      victoryAudio.currentTime = 0;
      defeatAudio?.pause();
      defeatAudio.currentTime = 0;
    };
    
    const pauseBGLoops = () => {
        rainAudio?.pause();
        startMusic?.pause();
    }

    //HANDLE GAME ENDING (Victory/Defeat)
    if (isGameWon || isGameOver) {
      pauseBGLoops();
      pauseEndingSounds();
      
      const endingAudio = isGameWon ? victoryAudio : defeatAudio;
      endingAudio.volume = 0.8;
      endingAudio.play().catch(console.error);
      return;
    }
    
    //HANDLE START SCREEN
    if (!playerName) {
        pauseBGLoops();
        pauseEndingSounds();
        
        startMusic.volume = 0.6;
        startMusic.play().catch(error => {
            console.log("Start Music audio waiting for user interaction.");
        });
        return;
    }
    
    //HANDLE ACTIVE GAME (Rain Loop & Sound Effects)
    if (isGameActive) {
      startMusic?.pause();
      pauseEndingSounds();
      
      const takeDamageAmount = currentStoryNode?.onArrive?.takeDamage || 0;
      const isDamageEvent = takeDamageAmount > 0;
      
      const isCollectEvent = !!currentStoryNode?.onArrive?.addItem; // Check if addItem property exists

      const isMonsterEncounter = currentStoryNode?.onArrive?.encounterMonster > 0; 
      
      // Play Monster Scream (if encountered)
      if (isMonsterEncounter && screamAudio) {
          screamAudio.volume = 1.0;
          screamAudio.currentTime = 0; 
          screamAudio.play().catch(console.error);
      }
      
      // Play Damage Sound (if damage is taken)
      if (isDamageEvent && damageAudio) {
          damageAudio.volume = 1.0;
          damageAudio.currentTime = 0; 
          damageAudio.play().catch(console.error);
      }
      
      // Play Collect Sound (if item is gained)
      if (isCollectEvent && collectAudio) {
          collectAudio.volume = 1.0;
          collectAudio.currentTime = 0; 
          collectAudio.play().catch(console.error);
      }
      
      // Start the rain loop
      rainAudio.volume = 0.5;
      rainAudio.play().catch(error => {
            console.log("Rain audio waiting for user interaction to play.");
      });
    }

    //HANDLE PAUSE/CLEANUP
    if (!isGameActive && !isGameOver && !isGameWon) {
      pauseBGLoops();
      pauseEndingSounds();
    }

  }, [playerName, isGameOver, isGameWon, currentStoryNode]);

  return (
    <div className={gameActiveWrapperClass}> 
        {/* Audio Elements */}
        <audio ref={startMusicRef} src={startScreenMusic} loop preload="auto" /> 
        <audio ref={audioRef} src={rainLoopSound} loop preload="auto" />
        <audio ref={victoryAudioRef} src={victorySound} preload="auto" /> 
        <audio ref={defeatAudioRef} src={defeatSound} preload="auto" />   
        <audio ref={screamAudioRef} src={monsterScreamSound} preload="auto" />
        <audio ref={damageAudioRef} src={playerDamageSound} preload="auto" /> 
        <audio ref={collectAudioRef} src={itemCollectSound} preload="auto" /> {/* ITEM COLLECT AUDIO ELEMENT */}


        {/* StatsPanel only shows when showStats is TRUE (i.e., game is ongoing) */}
        {showStats && <StatsPanel />}

        {/* Render StartScreen if not started, or main content inside a container */}
        {playerName ? (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        {/* Story/Ending Display is centered here */}
                        <ScreenComponent /> 
                    </div>
                </div>
            </div>
        ) : (
            <StartScreen />
        )}
    </div>
  );
};
