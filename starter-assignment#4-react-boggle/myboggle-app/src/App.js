import React, { useState, useEffect, useRef } from 'react';
import ToggleGameState from './ToggleGameState';
import Board from './Board';
import GuessInput from './GuessInput';
import SummaryResults from './SummaryResults';
import FoundSolutions from './FoundSolutions';
import './App.css';

// Sample word list for validation
const wordList = ['CAT', 'DOG', 'BAT', 'CUP', 'HAT', 'KEY', 'TOY', 'CARD', 'JUMP', 'YARD'];

function App() {
  const [gameState, setGameState] = useState('stopped');
  const [gridSize, setGridSize] = useState(4);
  const [wordsFound, setWordsFound] = useState([]);
  const [missedWords, setMissedWords] = useState([]);
  const [grid, setGrid] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const timer = useRef(null);

  // Generate a random grid of letters
  const generateGrid = (size) => {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    );
  };

  // Find valid words that match the grid
  const generateSolutions = (grid, wordList) => {
    const gridLetters = grid.flat().join('');
    return wordList.filter((word) =>
      word.split('').every((letter) => gridLetters.includes(letter))
    );
  };

  const startGame = () => {
    const newGrid = generateGrid(gridSize); // Generate a new board
    const solutions = generateSolutions(newGrid, wordList); // Find valid words
    setGrid(newGrid);
    setMissedWords(solutions); // Set the valid words as "missedWords" initially
    setWordsFound([]); // Reset the found words
    setTotalTime(0); // Reset the timer
    setGameState('started'); // Start the game
  };

  const stopGame = () => {
    setGameState('stopped');
    setMissedWords(missedWords.filter((word) => !wordsFound.includes(word))); // Filter missed words
  };

  const handleWordGuessed = (word) => {
    if (!wordsFound.includes(word)) {
      setWordsFound([...wordsFound, word]);
    }
  };

  useEffect(() => {
    if (gameState === 'started') {
      timer.current = setInterval(() => {
        setTotalTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer.current);
    }
    return () => clearInterval(timer.current); // Cleanup on unmount
  }, [gameState]);

  return (
    <div className="App">
      <ToggleGameState
        gameState={gameState}
        startGame={startGame}
        stopGame={stopGame}
        setSize={setGridSize}
      />
      {gameState === 'started' && <Board board={grid} />}
      {gameState === 'started' && (
        <GuessInput
          allSolutions={missedWords}
          foundSolutions={wordsFound}
          correctAnswerCallback={handleWordGuessed}
        />
      )}
      {gameState === 'stopped' && (
        <>
          <SummaryResults words={wordsFound} totalTime={totalTime} />
          <FoundSolutions headerText="Missed Words" words={missedWords} />
        </>
      )}
      {gameState === 'started' && (
        <FoundSolutions headerText="Words Found" words={wordsFound} />
      )}
    </div>
  );
}

export default App;
