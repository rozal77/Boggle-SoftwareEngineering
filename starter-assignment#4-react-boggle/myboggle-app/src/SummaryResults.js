import React from 'react';
import './SummaryResults.css';

function SummaryResults({ words, totalTime }) {
  return (
    <div className="Summary-results">
      <h2>Game Summary</h2>
      <ul>
        <li>Total Words Found: {words.length}</li>
        <li>Total Time: {totalTime} seconds</li>
      </ul>
    </div>
  );
}

export default SummaryResults;
