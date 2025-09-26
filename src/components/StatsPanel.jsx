import React from 'react';
import { useGame } from '../contexts/GameContext';

export const StatsPanel = () => {
  const { gameState } = useGame();
  const { playerName, hp, inventory } = gameState;
  
  const hpVariant = hp > 50 ? 'success' : hp > 20 ? 'warning' : 'danger';

  return (
    <div className="card text-white mb-4 stats-overlay"> 
      {/* This inner div provides a slight dark overlay for readability */}
      <div className="p-3" style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '0.5rem' }}>
        <div className="card-header bg-danger text-white p-2 mb-2" style={{ borderBottom: 'none', borderRadius: '0.3rem' }}>
          <h5 className="mb-0 fs-5">Hunter: {playerName}</h5>
        </div>
        
        {/* HP Bar Implementation */}
        <div className="mb-3">
            <strong>HEALTH</strong>
            <div className="progress" style={{ height: '25px', backgroundColor: '#444' }}>
                <div 
                    className={`progress-bar bg-${hpVariant}`} 
                    role="progressbar" 
                    style={{ width: `${hp}%` }} 
                    aria-valuenow={hp} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                >
                    {hp}%
                </div>
            </div>
        </div>

        <h6>Inventory:</h6>
        <ul className="list-unstyled d-flex flex-wrap">
          {inventory.length > 0 ? (
            inventory.map(item => (
              <li key={item} className="badge bg-secondary me-2 mb-1">{item}</li>
            ))
          ) : (
            <li className="text-white">Empty</li>
          )}
        </ul>
      </div>
    </div>
  );
};
