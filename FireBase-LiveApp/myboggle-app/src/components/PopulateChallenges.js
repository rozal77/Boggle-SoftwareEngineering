// Component to populate challenges (for admin use)
import React, { useState } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import populateChallenges from '../scripts/populateChallenges';

function PopulateChallenges({ user }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePopulate = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in first' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      console.log('Populating challenges for user:', user.uid);
      const ids = await populateChallenges(user.uid);
      if (ids.length === 0) {
        setMessage({
          type: 'error',
          text: 'No challenges were created. Check the browser console for errors.'
        });
      } else {
        setMessage({
          type: 'success',
          text: `Successfully created ${ids.length} challenges! Refresh the Load Challenge dialog to see them.`
        });
      }
    } catch (error) {
      console.error('Error in handlePopulate:', error);
      setMessage({
        type: 'error',
        text: `Error populating challenges: ${error.message}. Check the browser console for details.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Populate Challenges
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Click the button below to populate Firestore with sample challenge grids.
        This requires authentication.
      </Typography>
      {message && (
        <Alert severity={message.type} sx={{ mt: 2, mb: 2 }}>
          {message.text}
        </Alert>
      )}
      <Button
        variant="contained"
        onClick={handlePopulate}
        disabled={loading || !user}
      >
        {loading ? 'Populating...' : 'Populate Challenges'}
      </Button>
    </Box>
  );
}

export default PopulateChallenges;

