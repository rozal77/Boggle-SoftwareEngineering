import React from 'react';
import { Button, FormControl, Select, MenuItem } from '@mui/material';
import './ToggleGameState.css';

function ToggleGameState({ gameState, startGame, stopGame, setSize }) {
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleGameToggle}
        className="Game-button"
      >
        {gameState === 'stopped' ? 'Start Game' : 'Stop Game'}
      </Button>
      {gameState === 'stopped' && (
        <FormControl className="Size-selector">
          <Select onChange={handleSizeChange} defaultValue={4}>
            {[4, 5, 6, 7].map((size) => (
              <MenuItem key={size} value={size}>
                {size} x {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
}

export default ToggleGameState;
