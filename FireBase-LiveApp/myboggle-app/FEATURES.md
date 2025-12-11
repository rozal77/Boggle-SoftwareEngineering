# Boggle App Features

## Implemented Features

### 1. ✅ Google Sign-in Authentication (2 pts)
- Users can sign in with their Google account
- Authentication state is managed throughout the app
- Sign-in button appears when user is not authenticated
- User profile (name and photo) displayed when authenticated

**Location**: `src/components/Auth.js`

### 2. ✅ Manually Populate Firestore with Challenge Grids (2 pts)
- Script available to populate Firestore with sample challenges
- Challenges stored in Firestore `challenges` collection
- Each challenge includes: name, grid (2D array), solutions (array of words)

**Location**: `src/scripts/populateChallenges.js`, `src/components/PopulateChallenges.js`

### 3. ✅ Load Challenge Functionality (10 pts)
- "Load Challenge" button appears when game is stopped
- Clicking button opens a dialog with list of available challenges
- For each challenge, displays:
  - Challenge name
  - Grid size
  - Current high score (if available)
  - Player name who achieved high score
- Selecting a challenge loads that grid and starts the game
- Challenge name is displayed during gameplay

**Location**: `src/components/LoadChallenge.js`

### 4. ✅ Leaderboard Functionality (3 pts)
- "View Leaderboard" button appears when playing a challenge
- Leaderboard shows top 10 scores for the current challenge
- Displays: Rank, Player Name, Score, Date
- Updated in real-time as scores are submitted

**Location**: `src/components/Leaderboard.js`

### 5. ✅ Automatic Score Submission During Gameplay (1 pt)
- Scores are automatically submitted to Firebase:
  - Every 5 words found during gameplay
  - When game is stopped (final score)
- Scores stored in Firestore `scores` collection
- Leaderboard updated automatically
- Only works when user is authenticated and playing a challenge

**Location**: `src/App.js` (useEffect hooks)

### 6. ✅ Firebase Hosting Deployment (5 pts)
- Firebase hosting configuration files created:
  - `firebase.json` - Hosting configuration
  - `.firebaserc` - Project configuration
  - `firestore.rules` - Security rules
  - `firestore.indexes.json` - Index configuration
- Ready for deployment with `firebase deploy`

**Location**: Root directory files

## File Structure

```
myboggle-app/
├── src/
│   ├── components/
│   │   ├── Auth.js                  # Google Sign-in component
│   │   ├── LoadChallenge.js          # Challenge selection dialog
│   │   ├── Leaderboard.js           # Leaderboard display
│   │   └── PopulateChallenges.js    # Admin component to populate challenges
│   ├── services/
│   │   ├── authService.js           # Authentication service
│   │   └── challengeService.js      # Challenge and score management
│   ├── scripts/
│   │   └── populateChallenges.js    # Script to populate sample challenges
│   ├── firebase.js                  # Firebase configuration
│   └── App.js                       # Main app component (updated)
├── firebase.json                     # Firebase hosting config
├── .firebaserc                       # Firebase project config
├── firestore.rules                   # Firestore security rules
├── firestore.indexes.json            # Firestore indexes
└── SETUP.md                          # Setup instructions
```

## Firestore Collections

### `challenges`
Document structure:
```json
{
  "name": "Challenge Name",
  "grid": [["C","A","T"], ...],
  "solutions": ["CAT", "DOG", ...],
  "createdAt": Timestamp
}
```

### `scores`
Document structure:
```json
{
  "challengeId": "challenge-id",
  "userId": "user-id",
  "userName": "User Name",
  "score": 10,
  "wordsFound": ["CAT", "DOG", ...],
  "totalTime": 120,
  "timestamp": Timestamp
}
```

### `leaderboard`
Document structure:
```json
{
  "challengeId": "challenge-id",
  "userId": "user-id",
  "userName": "User Name",
  "score": 10,
  "timestamp": Timestamp
}
```

## Usage Instructions

1. **Setup Firebase** (see SETUP.md)
2. **Populate Challenges**:
   - Option A: Use PopulateChallenges component in App.js
   - Option B: Add challenges manually via Firebase Console
3. **Sign In**: Click "Sign in with Google"
4. **Load Challenge**: Click "Load Challenge" button
5. **Play**: Find words in the challenge grid
6. **View Leaderboard**: Click "View Leaderboard" during gameplay
7. **Scores**: Automatically submitted every 5 words and at game end

## Testing Checklist

- [ ] Google Sign-in works
- [ ] Challenges can be populated (manually or via script)
- [ ] Load Challenge dialog shows available challenges
- [ ] High scores display correctly for each challenge
- [ ] Selecting a challenge loads the grid
- [ ] Scores are automatically submitted during gameplay
- [ ] Leaderboard displays correctly
- [ ] App can be deployed to Firebase Hosting

## Next Steps

1. Configure Firebase project (see SETUP.md)
2. Update `src/firebase.js` with your Firebase config
3. Populate challenges (see SETUP.md)
4. Test all features
5. Deploy to Firebase Hosting

