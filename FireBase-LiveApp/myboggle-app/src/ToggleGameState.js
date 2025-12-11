import React from 'react';
import { Button, FormControl, Select, MenuItem } from '@mui/material';
import './ToggleGameState.css';

function ToggleGameState({ gameState, startGame, stopGame, setSize, onLoadChallenge, onShowLeaderboard, currentChallenge }) {
  const handleGameToggle = () => {
    if (gameState === 'stopped') {
      startGame();
    } else {
      stopGame();
    }
  };

  const handleSizeChange = (event) => {
    setSize(Number(event.target.value));
  };

  return (
    <div className="Toggle-game-state">
      <div className="Toggle-game-state-controls">
        <Button
          variant="contained"
          color="primary"
          onClick={handleGameToggle}
          className="Game-button"
          size="large"
        >
          {gameState === 'stopped' ? 'Start Game' : 'Stop Game'}
        </Button>
        {gameState === 'stopped' && (
          <>
            <FormControl className="Size-selector">
              <Select onChange={handleSizeChange} defaultValue={4}>
                {[4, 5, 6, 7].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size} x {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onLoadChallenge}
              size="large"
            >
              Load Challenge
            </Button>
          </>
        )}
        {gameState === 'started' && currentChallenge && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onShowLeaderboard}
            size="large"
          >
            View Leaderboard
          </Button>
        )}
      </div>
      {currentChallenge && (
        <div className="Challenge-info">
          <strong>Challenge: {currentChallenge.name || 'Challenge'}</strong>
        </div>
      )}
    </div>
  );
}

export default ToggleGameState;
