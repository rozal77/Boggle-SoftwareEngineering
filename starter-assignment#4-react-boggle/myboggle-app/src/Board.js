import React from 'react';
import { Grid, Paper } from '@mui/material';
import './Board.css';

function Board({ board }) {
  return (
    <div className="Board-div">
      <Grid container justifyContent="center" spacing={1}>
        {board.map((row, rowIndex) => (
          <Grid container item key={rowIndex} justifyContent="center" spacing={1}>
            {row.map((tile, colIndex) => (
              <Grid item key={colIndex} xs={1} className="Tile">
                <Paper elevation={3} className="Tile-paper">
                  {tile}
                </Paper>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Board;
