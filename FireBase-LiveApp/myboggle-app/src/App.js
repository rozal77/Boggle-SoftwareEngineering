import React, { useState, useEffect, useRef } from 'react';
import ToggleGameState from './ToggleGameState';
import Board from './Board';
import GuessInput from './GuessInput';
import SummaryResults from './SummaryResults';
import FoundSolutions from './FoundSolutions';
import Auth from './components/Auth';
import LoadChallenge from './components/LoadChallenge';
import Leaderboard from './components/Leaderboard';
import GlobalLeaderboard from './components/GlobalLeaderboard';
import PopulateChallenges from './components/PopulateChallenges';
import { onAuthChange } from './services/authService';
import { submitScore } from './services/challengeService';
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
  const [user, setUser] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [showLoadChallenge, setShowLoadChallenge] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const timer = useRef(null);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

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
    setCurrentChallenge(null); // Clear challenge when starting new game
    setGameState('started'); // Start the game
  };

  const startChallengeGame = (challenge) => {
    setGrid(challenge.grid);
    setMissedWords(challenge.solutions || []);
    setWordsFound([]);
    setTotalTime(0);
    setCurrentChallenge(challenge);
    setGameState('started');
  };

  const stopGame = async () => {
    setGameState('stopped');
    setMissedWords(missedWords.filter((word) => !wordsFound.includes(word))); // Filter missed words
    
    // Submit score to Firebase if playing a challenge and user is signed in
    if (currentChallenge && user && wordsFound.length > 0) {
      try {
        await submitScore(
          currentChallenge.id,
          user.uid,
          user.displayName || user.email,
          wordsFound.length,
          wordsFound,
          totalTime
        );
        console.log('Score submitted successfully');
      } catch (error) {
        console.error('Error submitting score:', error);
      }
    }
  };

  // Submit score automatically during gameplay (every 5 words found)
  useEffect(() => {
    if (
      currentChallenge &&
      user &&
      gameState === 'started' &&
      wordsFound.length > 0 &&
      wordsFound.length % 5 === 0
    ) {
      const submitScoreAsync = async () => {
        try {
          await submitScore(
            currentChallenge.id,
            user.uid,
            user.displayName || user.email,
            wordsFound.length,
            wordsFound,
            totalTime
          );
          console.log('Score auto-submitted:', wordsFound.length);
        } catch (error) {
          console.error('Error auto-submitting score:', error);
        }
      };
      submitScoreAsync();
    }
  }, [wordsFound.length, currentChallenge, user, gameState, totalTime]);

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
      <header className="App-header">
        <Auth user={user} />
      </header>
      <main className="App-main">
        {user && (
          <div className="App-section">
            <GlobalLeaderboard user={user} />
          </div>
        )}
        <div className="App-section">
          <ToggleGameState
            gameState={gameState}
            startGame={startGame}
            stopGame={stopGame}
            setSize={setGridSize}
            onLoadChallenge={() => setShowLoadChallenge(true)}
            onShowLeaderboard={() => {
              if (currentChallenge) {
                setShowLeaderboard(true);
              }
            }}
            currentChallenge={currentChallenge}
          />
        </div>
        {gameState === 'started' && (
          <div className="App-section">
            <Board board={grid} />
          </div>
        )}
        {gameState === 'started' && (
          <div className="App-section">
            <GuessInput
              allSolutions={missedWords}
              foundSolutions={wordsFound}
              correctAnswerCallback={handleWordGuessed}
            />
          </div>
        )}
        {gameState === 'stopped' && (
          <>
            <div className="App-section">
              <SummaryResults words={wordsFound} totalTime={totalTime} />
            </div>
            <div className="App-section">
              <FoundSolutions headerText="Missed Words" words={missedWords} />
            </div>
            {user && (
              <div className="App-section">
                <PopulateChallenges user={user} />
              </div>
            )}
          </>
        )}
        {gameState === 'started' && (
          <div className="App-section">
            <FoundSolutions headerText="Words Found" words={wordsFound} />
          </div>
        )}
      </main>
      <LoadChallenge
        open={showLoadChallenge}
        onClose={() => setShowLoadChallenge(false)}
        onChallengeSelect={startChallengeGame}
        user={user}
      />
      <Leaderboard
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        challengeId={currentChallenge?.id}
        challengeName={currentChallenge?.name}
      />
    </div>
  );
}

export default App;
