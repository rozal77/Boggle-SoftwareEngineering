import React, { useState } from 'react';
import { TextField } from '@mui/material';
import './GuessInput.css';

function GuessInput({ allSolutions, foundSolutions, correctAnswerCallback }) {
  const [labelText, setLabelText] = useState('Make your first guess!');
  const [input, setInput] = useState('');

  const evaluateInput = () => {
    const normalizedInput = input.toUpperCase();

    if (foundSolutions.includes(normalizedInput)) {
      setLabelText(`${input} has already been found!`);
    } else if (allSolutions.includes(normalizedInput)) {
      correctAnswerCallback(normalizedInput);
      setLabelText(`${input} is correct!`);
    } else {
      setLabelText(`${input} is incorrect!`);
    }
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      evaluateInput();
    }
  };

  return (
    <div className="Guess-input">
      <div className="Guess-label">{labelText}</div>
      <TextField
        value={input}
        onKeyPress={handleKeyPress}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        placeholder="Enter a word"
        fullWidth
      />
    </div>
  );
}

export default GuessInput;
