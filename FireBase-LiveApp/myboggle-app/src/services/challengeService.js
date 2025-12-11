import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, isConfigured } from '../firebase';

const CHALLENGES_COLLECTION = 'challenges';
const SCORES_COLLECTION = 'scores';
const LEADERBOARD_COLLECTION = 'leaderboard';

// Get all challenges (optionally filter by userId)
export const getAllChallenges = async (userId = null) => {
  if (!isConfigured || !db) {
    throw new Error('Firebase is not configured. Please update src/firebase.js with your Firebase configuration.');
  }
  try {
    console.log('Fetching challenges from collection:', CHALLENGES_COLLECTION, userId ? `for user: ${userId}` : 'for all users');
    const challengesRef = collection(db, CHALLENGES_COLLECTION);
    const querySnapshot = await getDocs(challengesRef);
    
    console.log('Query snapshot size:', querySnapshot.size);
    console.log('Query snapshot empty:', querySnapshot.empty);
    
    const challenges = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Challenge document:', doc.id, data);
      
      // Filter by userId if provided
      if (userId && data.userId !== userId) {
        return; // Skip challenges not belonging to this user
      }
      
      // Convert Firestore grid format back to 2D array
      const challengeData = {
        id: doc.id,
        ...data,
        grid: deserializeGrid(data.grid)
      };
      
      challenges.push(challengeData);
    });
    
    console.log('Total challenges found:', challenges.length);
    return challenges;
  } catch (error) {
    console.error('Error getting challenges:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Get a specific challenge by ID
export const getChallenge = async (challengeId) => {
  if (!isConfigured || !db) {
    throw new Error('Firebase is not configured. Please update src/firebase.js with your Firebase configuration.');
  }
  try {
    const challengeRef = doc(db, CHALLENGES_COLLECTION, challengeId);
    const challengeSnap = await getDoc(challengeRef);
    
    if (challengeSnap.exists()) {
      const data = challengeSnap.data();
      return {
        id: challengeSnap.id,
        ...data,
        grid: deserializeGrid(data.grid) // Convert back to 2D array
      };
    } else {
      throw new Error('Challenge not found');
    }
  } catch (error) {
    console.error('Error getting challenge:', error);
    throw error;
  }
};

// Get high score for a challenge
export const getChallengeHighScore = async (challengeId) => {
  if (!isConfigured || !db) {
    return null;
  }
  try {
    const scoresRef = collection(db, SCORES_COLLECTION);
    const querySnapshot = await getDocs(scoresRef);
    let highScore = null;
    
    querySnapshot.forEach((doc) => {
      const scoreData = doc.data();
      if (scoreData.challengeId === challengeId) {
        if (!highScore || scoreData.score > highScore.score) {
          highScore = {
            id: doc.id,
            ...scoreData
          };
        }
      }
    });
    
    return highScore;
  } catch (error) {
    console.error('Error getting high score:', error);
    return null;
  }
};

// Submit a score for a challenge
export const submitScore = async (challengeId, userId, userName, score, wordsFound, totalTime) => {
  if (!isConfigured || !db) {
    console.warn('Firebase is not configured. Score not submitted.');
    return;
  }
  try {
    const scoreData = {
      challengeId,
      userId,
      userName,
      score,
      wordsFound,
      totalTime,
      timestamp: new Date()
    };
    
    await addDoc(collection(db, SCORES_COLLECTION), scoreData);
    
    // Update leaderboard
    await updateLeaderboard(challengeId, userId, userName, score);
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
};

// Update leaderboard
const updateLeaderboard = async (challengeId, userId, userName, score) => {
  if (!isConfigured || !db) {
    return; // Silently fail if Firebase is not configured
  }
  try {
    const leaderboardRef = collection(db, LEADERBOARD_COLLECTION);
    const leaderboardQuery = query(
      leaderboardRef,
      orderBy('score', 'desc')
    );
    
    // Check if user already has an entry for this challenge
    const querySnapshot = await getDocs(leaderboardRef);
    let existingEntry = null;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.challengeId === challengeId && data.userId === userId) {
        existingEntry = { id: doc.id, ...data };
      }
    });
    
    if (existingEntry) {
      // Update if new score is higher
      if (score > existingEntry.score) {
        const entryRef = doc(db, LEADERBOARD_COLLECTION, existingEntry.id);
        await updateDoc(entryRef, {
          score,
          timestamp: new Date()
        });
      }
    } else {
      // Create new entry
      await addDoc(leaderboardRef, {
        challengeId,
        userId,
        userName,
        score,
        timestamp: new Date()
      });
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    throw error;
  }
};

// Get leaderboard for a challenge
export const getLeaderboard = async (challengeId, limitCount = 10) => {
  if (!isConfigured || !db) {
    throw new Error('Firebase is not configured. Please update src/firebase.js with your Firebase configuration.');
  }
  try {
    const leaderboardRef = collection(db, LEADERBOARD_COLLECTION);
    const querySnapshot = await getDocs(leaderboardRef);
    const leaderboard = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.challengeId === challengeId) {
        leaderboard.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() || data.timestamp
        });
      }
    });
    
    // Sort by score descending and limit
    leaderboard.sort((a, b) => b.score - a.score);
    return leaderboard.slice(0, limitCount);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

// Generate demo scores for challenges without real scores
const generateDemoScores = (challengeId, challengeName, limitCount = 5) => {
  const demoNames = [
    'Alex', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Quinn',
    'Avery', 'Dakota', 'Cameron', 'Parker', 'Sage', 'River', 'Phoenix'
  ];
  
  // Generate random scores based on challenge difficulty (estimated from grid size)
  // For demo purposes, scores range from reasonable to impressive
  const baseScore = 10;
  const maxScore = 50;
  
  const demoLeaderboard = [];
  const usedNames = new Set();
  
  for (let i = 0; i < limitCount; i++) {
    // Pick a random name that hasn't been used
    let name;
    do {
      name = demoNames[Math.floor(Math.random() * demoNames.length)];
    } while (usedNames.has(name) && usedNames.size < demoNames.length);
    usedNames.add(name);
    
    // Generate decreasing scores (higher scores first)
    const scoreRange = maxScore - baseScore;
    const score = Math.floor(maxScore - (scoreRange * i / limitCount) + Math.random() * 5);
    
    // Generate a random timestamp within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(Math.floor(Math.random() * 24));
    timestamp.setMinutes(Math.floor(Math.random() * 60));
    
    demoLeaderboard.push({
      id: `demo-${challengeId}-${i}`,
      challengeId,
      userId: `demo-user-${i}`,
      userName: name,
      score: Math.max(baseScore, score),
      timestamp: timestamp,
      isDemo: true // Flag to indicate this is a demo score
    });
  }
  
  return demoLeaderboard.sort((a, b) => b.score - a.score);
};

// Get leaderboard for a challenge with demo scores if no real scores exist
export const getLeaderboardWithDemo = async (challengeId, challengeName, limitCount = 10) => {
  if (!isConfigured || !db) {
    throw new Error('Firebase is not configured. Please update src/firebase.js with your Firebase configuration.');
  }
  
  try {
    const realLeaderboard = await getLeaderboard(challengeId, limitCount);
    
    // If there are real scores, return them
    if (realLeaderboard.length > 0) {
      return realLeaderboard;
    }
    
    // Otherwise, generate and return demo scores
    return generateDemoScores(challengeId, challengeName, limitCount);
  } catch (error) {
    console.error('Error getting leaderboard with demo:', error);
    // If error, still return demo scores
    return generateDemoScores(challengeId, challengeName, limitCount);
  }
};

// Get all challenges with their leaderboards (for global leaderboard view)
export const getAllChallengesWithLeaderboards = async (userId = null, limitPerChallenge = 5) => {
  if (!isConfigured || !db) {
    throw new Error('Firebase is not configured. Please update src/firebase.js with your Firebase configuration.');
  }
  
  try {
    const challenges = await getAllChallenges(userId);
    const challengesWithLeaderboards = [];
    
    for (const challenge of challenges) {
      const leaderboard = await getLeaderboardWithDemo(
        challenge.id,
        challenge.name,
        limitPerChallenge
      );
      
      challengesWithLeaderboards.push({
        ...challenge,
        leaderboard,
        hasRealScores: leaderboard.length > 0 && !leaderboard[0].isDemo
      });
    }
    
    return challengesWithLeaderboards;
  } catch (error) {
    console.error('Error getting challenges with leaderboards:', error);
    throw error;
  }
};

// Helper function to convert 2D array to Firestore-compatible format
// Firestore doesn't support nested arrays, so we store as array of strings (each row is a string)
const serializeGrid = (grid) => {
  if (!grid || !Array.isArray(grid)) return [];
  return grid.map(row => Array.isArray(row) ? row.join('') : row);
};

// Helper function to convert Firestore format back to 2D array
const deserializeGrid = (gridData) => {
  if (!gridData || !Array.isArray(gridData)) return [];
  // If already a 2D array (for backwards compatibility), return as is
  if (gridData.length > 0 && Array.isArray(gridData[0])) {
    return gridData;
  }
  // Convert array of strings back to 2D array
  return gridData.map(row => typeof row === 'string' ? row.split('') : row);
};

// Create a challenge (for populating challenges)
export const createChallenge = async (name, grid, solutions, userId = null) => {
  if (!isConfigured || !db) {
    throw new Error('Firebase is not configured. Please update src/firebase.js with your Firebase configuration.');
  }
  try {
    // Convert 2D grid array to Firestore-compatible format (array of strings)
    const serializedGrid = serializeGrid(grid);
    
    const challengeData = {
      name,
      grid: serializedGrid, // Store as array of strings instead of 2D array
      solutions,
      createdAt: new Date()
    };
    
    // Add userId if provided (for user-specific challenges)
    if (userId) {
      challengeData.userId = userId;
    }
    
    console.log('Creating challenge:', challengeData);
    const docRef = await addDoc(collection(db, CHALLENGES_COLLECTION), challengeData);
    console.log('Challenge created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating challenge:', error);
    console.error('Error details:', error.code, error.message);
    throw error;
  }
};

