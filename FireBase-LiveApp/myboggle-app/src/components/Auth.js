import React from 'react';
import { Button, Box, Typography, Avatar } from '@mui/material';
import { signInWithGoogle, signOut } from '../services/authService';
import './Auth.css';

function Auth({ user }) {
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
      const errorMessage = error.message || 'Failed to sign in. Please try again.';
      if (errorMessage.includes('not configured')) {
        alert('Firebase is not configured. Please update src/firebase.js with your Firebase configuration. See SETUP.md for instructions.');
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  if (user) {
    return (
      <Box className="Auth-container">
        <Typography variant="h5" className="Auth-title">
          Boggle Game
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          {user.photoURL && (
            <Avatar src={user.photoURL} alt={user.displayName} />
          )}
          <Typography variant="body1" sx={{ color: 'white' }}>
            {user.displayName || user.email}
          </Typography>
          <Button variant="outlined" onClick={handleSignOut} sx={{ color: 'white', borderColor: 'white' }}>
            Sign Out
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="Auth-container">
      <Typography variant="h5" className="Auth-title">
        Boggle Game
      </Typography>
      <Button variant="contained" onClick={handleSignIn} sx={{ backgroundColor: 'white', color: '#8b1538', '&:hover': { backgroundColor: '#f0f0f0' } }}>
        Sign in with Google
      </Button>
    </Box>
  );
}

export default Auth;

