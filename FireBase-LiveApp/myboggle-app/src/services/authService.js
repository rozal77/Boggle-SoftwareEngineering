import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, isConfigured } from '../firebase';

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured. Please update src/firebase.js with your Firebase configuration.');
  }
  if (!auth || !googleProvider) {
    throw new Error('Firebase authentication is not initialized. Please check your Firebase configuration.');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  if (!isConfigured || !auth) {
    throw new Error('Firebase is not configured.');
  }
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  if (!auth) return null;
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  if (!isConfigured || !auth) {
    // Return a mock unsubscribe function if Firebase is not configured
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

