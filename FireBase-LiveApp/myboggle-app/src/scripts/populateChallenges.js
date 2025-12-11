// Script to populate Firestore with challenge grids
// Run this script in the browser console after signing in, or integrate it into your app
// You can also use Firebase Console directly to add challenges

import { createChallenge } from '../services/challengeService';

// Sample challenge grids (2-3 simple to hard challenges)
const sampleChallenges = [
  {
    name: 'Easy Challenge',
    grid: [
      ['C', 'A', 'T', 'S'],
      ['D', 'O', 'G', 'S'],
      ['B', 'A', 'T', 'S'],
      ['C', 'U', 'P', 'S']
    ],
    solutions: ['CAT', 'DOG', 'BAT', 'CUP', 'CATS', 'DOGS', 'BATS', 'CUPS']
  },
  {
    name: 'Medium Challenge',
    grid: [
      ['H', 'E', 'L', 'L', 'O'],
      ['W', 'O', 'R', 'L', 'D'],
      ['H', 'E', 'A', 'R', 'T'],
      ['B', 'O', 'A', 'R', 'D'],
      ['W', 'O', 'R', 'D', 'S']
    ],
    solutions: ['HELLO', 'WORLD', 'HEART', 'BOARD', 'WORDS', 'HEAR', 'BOAR', 'WORD']
  },
  {
    name: 'Hard Challenge',
    grid: [
      ['P', 'R', 'O', 'G', 'R', 'A', 'M'],
      ['C', 'H', 'A', 'L', 'L', 'E', 'N'],
      ['G', 'E', 'B', 'O', 'G', 'G', 'L'],
      ['E', 'W', 'I', 'T', 'H', 'F', 'I'],
      ['R', 'E', 'A', 'C', 'T', 'J', 'S'],
      ['A', 'P', 'P', 'L', 'I', 'C', 'A'],
      ['T', 'I', 'O', 'N', 'S', 'T', 'S']
    ],
    solutions: ['PROGRAM', 'CHALLENGE', 'BOGGLE', 'REACT', 'APPLICATION']
  }
];

// Function to populate challenges for a specific user
export const populateChallenges = async (userId = null) => {
  if (!userId) {
    throw new Error('User ID is required to create challenges');
  }
  
  try {
    console.log('Starting to populate challenges for user:', userId);
    const challengeIds = [];
    
    for (const challenge of sampleChallenges) {
      try {
        console.log(`Creating challenge: ${challenge.name}`);
        const id = await createChallenge(challenge.name, challenge.grid, challenge.solutions, userId);
        challengeIds.push(id);
        console.log(`✓ Created challenge: ${challenge.name} with ID: ${id}`);
      } catch (error) {
        console.error(`✗ Error creating challenge ${challenge.name}:`, error);
        console.error('Error details:', error.message);
      }
    }
    
    console.log(`Successfully created ${challengeIds.length} challenges`);
    return challengeIds;
  } catch (error) {
    console.error('Error populating challenges:', error);
    throw error;
  }
};

// Export for use in components or browser console
export default populateChallenges;

