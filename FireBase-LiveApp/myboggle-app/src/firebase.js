// Firebase configuration
// Replace these values with your Firebase project configuration
// You can find these in your Firebase Console > Project Settings > General > Your apps

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDISWu_KrVgwNHRJlxPhIkfI5_99QE-9-8",
  authDomain: "myboggle-app.firebaseapp.com",
  projectId: "myboggle-app",
  storageBucket: "myboggle-app.firebasestorage.app",
  messagingSenderId: "430711034009",
  appId: "1:430711034009:web:d86447e1125ee7cae92808",
  measurementId: "G-0HK7NSF0Z3" // Optional: for analytics
};

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && 
         firebaseConfig.projectId !== "YOUR_PROJECT_ID";
};

export const isConfigured = isFirebaseConfigured();

// Initialize Firebase only if configured
let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
} else {
  console.warn('Firebase is not configured. Please update src/firebase.js with your Firebase config.');
}

export { auth, db, googleProvider };
export default app;

