import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { getAllChallenges, getChallengeHighScore } from '../services/challengeService';
import populateChallenges from '../scripts/populateChallenges';
import './LoadChallenge.css';

function LoadChallenge({ open, onClose, onChallengeSelect, user }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highScores, setHighScores] = useState({});
  const [error, setError] = useState(null);
  const [populating, setPopulating] = useState(false);

  useEffect(() => {
    if (open) {
      loadChallenges();
    } else {
      // Reset state when dialog closes
      setChallenges([]);
      setHighScores({});
      setError(null);
    }
  }, [open]);

  const loadChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading challenges from Firestore...', user ? `for user: ${user.uid}` : 'for all users');
      // Pass userId to filter challenges for the current user
      const allChallenges = await getAllChallenges(user?.uid || null);
      console.log('Challenges loaded:', allChallenges);
      setChallenges(allChallenges);
      
      // Load high scores for each challenge (only if there are challenges)
      if (allChallenges.length > 0) {
        const scores = {};
        for (const challenge of allChallenges) {
          try {
            const highScore = await getChallengeHighScore(challenge.id);
            scores[challenge.id] = highScore;
          } catch (scoreError) {
            console.warn('Error loading high score for challenge:', challenge.id, scoreError);
            scores[challenge.id] = null;
          }
        }
        setHighScores(scores);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
      const errorMessage = error.message || 'Failed to load challenges. Please try again.';
      setError(errorMessage);
      
      // Show detailed error message
      if (errorMessage.includes('not configured')) {
        alert('Firebase is not configured. Please update src/firebase.js with your Firebase configuration. See SETUP.md for instructions.');
      } else if (errorMessage.includes('permission-denied') || errorMessage.includes('Missing or insufficient permissions')) {
        alert('Permission denied. Please check:\n1. You are signed in\n2. Firestore rules are deployed\n3. Your Firestore rules allow read access for authenticated users');
      } else {
        alert(`Error loading challenges: ${errorMessage}\n\nCheck the browser console for more details.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeSelect = (challenge) => {
    onChallengeSelect(challenge);
    onClose();
  };

  const handlePopulateChallenges = async () => {
    if (!user) {
      alert('Please sign in first to populate challenges.');
      return;
    }

    setPopulating(true);
    try {
      console.log('Populating challenges for user:', user.uid);
      const ids = await populateChallenges(user.uid);
      if (ids.length === 0) {
        alert('No challenges were created. Check the browser console for errors.');
      } else {
        alert(`Successfully created ${ids.length} challenges! Now reloading...`);
        // Reload challenges after populating
        await loadChallenges();
      }
    } catch (error) {
      console.error('Error populating challenges:', error);
      alert(`Error populating challenges: ${error.message}. Check the browser console for details.`);
    } finally {
      setPopulating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Load Challenge</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" p={3} gap={2}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading challenges...
            </Typography>
          </Box>
        ) : error ? (
          <Box p={2}>
            <Typography color="error" gutterBottom>
              Error: {error}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Make sure you are signed in and Firestore rules are deployed.
            </Typography>
          </Box>
        ) : challenges.length === 0 ? (
          <Box p={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography gutterBottom variant="h6">
              No challenges available.
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {user ? (
                <>
                  No challenges found in Firestore collection "challenges".<br/>
                  Check the browser console (F12) for debugging information.
                </>
              ) : (
                'Please sign in first.'
              )}
            </Typography>
            {user && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <strong>Troubleshooting:</strong><br/>
                  1. Check collection name is exactly "challenges"<br/>
                  2. Verify data structure matches (see FIRESTORE_DATA_STRUCTURE.md)<br/>
                  3. Ensure Firestore rules are deployed<br/>
                  4. Check browser console for detailed logs
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePopulateChallenges}
                  disabled={populating}
                  sx={{ mt: 1 }}
                >
                  {populating ? 'Populating...' : 'Populate Sample Challenges'}
                </Button>
              </>
            )}
            <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
              Or add challenges manually via Firebase Console
            </Typography>
          </Box>
        ) : (
          <List>
            {challenges.map((challenge) => {
              const highScore = highScores[challenge.id];
              return (
                <ListItem
                  key={challenge.id}
                  button
                  onClick={() => handleChallengeSelect(challenge)}
                  className="challenge-item"
                >
                  <ListItemText
                    primary={challenge.name || `Challenge ${challenge.id}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Grid Size: {challenge.grid?.length || 'N/A'}x{challenge.grid?.[0]?.length || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          High Score: {highScore ? highScore.score : 'No scores yet'}
                          {highScore && highScore.userName && ` by ${highScore.userName}`}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoadChallenge;

