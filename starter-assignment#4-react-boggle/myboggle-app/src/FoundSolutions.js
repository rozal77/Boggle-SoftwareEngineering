import React from 'react';
import './FoundSolutions.css';

function FoundSolutions({ words, headerText }) {
  return (
    <div className="Found-solutions">
      <h3>{headerText}</h3>
      <ul>
        {words.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
    </div>
  );
}

export default FoundSolutions;
