import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { getLeaderboardWithDemo } from '../services/challengeService';
import './Leaderboard.css';

function Leaderboard({ open, onClose, challengeId, challengeName }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasRealScores, setHasRealScores] = useState(false);

  useEffect(() => {
    if (open && challengeId) {
      loadLeaderboard();
    }
  }, [open, challengeId]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const scores = await getLeaderboardWithDemo(challengeId, challengeName, 10);
      setLeaderboard(scores);
      setHasRealScores(scores.length > 0 && !scores[0].isDemo);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      alert('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return date.toLocaleString();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Leaderboard
        {challengeName && (
          <Typography variant="subtitle2" color="text.secondary">
            {challengeName}
          </Typography>
        )}
        {!hasRealScores && leaderboard.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mt: 0.5 }}>
            (Demo scores - be the first to play!)
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : leaderboard.length === 0 ? (
          <Typography>No scores yet. Be the first to play!</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Player</TableCell>
                  <TableCell align="right">Score</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow key={entry.id} sx={{ opacity: entry.isDemo ? 0.7 : 1 }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {entry.userName || 'Anonymous'}
                      {entry.isDemo && (
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1, fontStyle: 'italic' }}>
                          (demo)
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">{entry.score}</TableCell>
                    <TableCell>{formatDate(entry.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Leaderboard;

