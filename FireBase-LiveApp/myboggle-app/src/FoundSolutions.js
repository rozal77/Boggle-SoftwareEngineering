import React from 'react';
import './FoundSolutions.css';

function FoundSolutions({ words, headerText }) {
  return (
    <div className="Found-solutions">
      <h3>{headerText}</h3>
      {words.length === 0 ? (
        <div className="Found-solutions-empty">No words yet</div>
      ) : (
        <div className="Found-solutions-words">
          {words.map((word, index) => (
            <span key={index} className="Found-solutions-word">
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default FoundSolutions;
