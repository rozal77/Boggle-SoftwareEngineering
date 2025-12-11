import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getAllChallengesWithLeaderboards } from '../services/challengeService';
import './GlobalLeaderboard.css';

function GlobalLeaderboard({ user }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadLeaderboards();
    }
  }, [user]);

  const loadLeaderboards = async () => {
    setLoading(true);
    setError(null);
    try {
      const challengesWithLeaderboards = await getAllChallengesWithLeaderboards(user?.uid || null, 5);
      setChallenges(challengesWithLeaderboards);
    } catch (error) {
      console.error('Error loading global leaderboard:', error);
      setError(error.message || 'Failed to load leaderboards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp instanceof Date ? timestamp : timestamp.toDate?.() || new Date(timestamp);
      return date.toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="GlobalLeaderboard" sx={{ mt: 2, mb: 2 }}>
      <CardHeader
        title="Global Leaderboards"
        subheader="View top scores for all challenges"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${challenges.length} Challenge${challenges.length !== 1 ? 's' : ''}`}
              color="primary"
              size="small"
            />
            <IconButton
              onClick={loadLeaderboards}
              disabled={loading}
              size="small"
              title="Refresh leaderboards"
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : challenges.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={3}>
            No challenges available. Load a challenge to see leaderboards!
          </Typography>
        ) : (
          <Box>
            {challenges.map((challenge) => (
              <Accordion key={challenge.id} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      {challenge.name || `Challenge ${challenge.id}`}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={`${challenge.grid?.length || 0}x${challenge.grid?.[0]?.length || 0}`}
                        size="small"
                        variant="outlined"
                      />
                      {challenge.hasRealScores ? (
                        <Chip
                          label="Real Scores"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="Demo Scores"
                          color="default"
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {challenge.leaderboard.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Top: {challenge.leaderboard[0].score}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {challenge.leaderboard.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={2}>
                      No scores yet. Be the first to play!
                    </Typography>
                  ) : (
                    <>
                      {!challenge.hasRealScores && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          These are demo scores. Be the first to play this challenge and set a real high score!
                        </Alert>
                      )}
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Rank</TableCell>
                              <TableCell>Player</TableCell>
                              <TableCell align="right">Score</TableCell>
                              <TableCell>Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {challenge.leaderboard.map((entry, index) => (
                              <TableRow
                                key={entry.id}
                                sx={{
                                  opacity: entry.isDemo ? 0.75 : 1,
                                  backgroundColor: entry.isDemo ? 'action.hover' : 'transparent'
                                }}
                              >
                                <TableCell>
                                  <Typography variant="body2" fontWeight={index === 0 ? 'bold' : 'normal'}>
                                    {index + 1}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2">
                                      {entry.userName || 'Anonymous'}
                                    </Typography>
                                    {entry.isDemo && (
                                      <Chip
                                        label="demo"
                                        size="small"
                                        sx={{ ml: 1, height: 18, fontSize: '0.65rem' }}
                                        variant="outlined"
                                      />
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2" fontWeight={index === 0 ? 'bold' : 'normal'}>
                                    {entry.score}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatDate(entry.timestamp)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default GlobalLeaderboard;

