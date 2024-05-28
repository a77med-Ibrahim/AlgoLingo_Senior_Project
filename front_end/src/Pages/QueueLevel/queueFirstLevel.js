import React, { useState, useEffect } from "react";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import LevelsBar from "./Levels Bar/LevelsBar";
import "./queuefirstLevel.css";

function QueueFirstLevel() {
    const [operations, setOperations] = useState([]);
    const [queue, setQueue] = useState([]);
    const [userGuess, setUserGuess] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [level2Unlocked, setLevel2Unlocked] = useState(false);  // State to track if the next level is unlocked

    useEffect(() => {
      generateOperations();
    }, []);

    const generateOperations = () => {
      let tempQueue = [];  // Temporary queue to accumulate changes
      const newOperations = [];
      const count = Math.floor(Math.random() * 10) + 5;  // Generate between 5 and 15 operations
      for (let i = 0; i < count; i++) {
        if (Math.random() > 0.5 || tempQueue.length === 0) {
          const value = Math.floor(Math.random() * 100) + 1;
          newOperations.push(`enqueue(${value})`);
          tempQueue.push(value);  // Push to the end of the queue
        } else {
          newOperations.push('dequeue()');
          tempQueue.shift();  // Remove from the front of the queue
        }
      }
      setQueue(tempQueue);  // Update the state with the modified queue
      setOperations(newOperations);
    };

    const handleGuessSubmit = () => {
      if (userGuess === queue.join(',')) {
        setResultMessage('Correct!');
        setLevel2Unlocked(true);  // Unlock next level
      } else {
        setResultMessage(`Incorrect, try again`);
      }
    };

    return (
      <div className="flexing">
        <AlgoLingoBar />
        <div className="width-of-objects">
          <h1 className="title-styling">Queue</h1>
          <h2 className="title-styling">First Level</h2>
          <div className="navbar-line" />
          <LevelsBar 
          levelUnlocked={true}
          level2Unlocked= {level2Unlocked}
          />
          <div className="operations-container">
            {operations.map((op, index) => (
              <React.Fragment key={index}>
                <span className="operation-item">{op}</span>
                {index < operations.length - 1 && <span>, </span>}
              </React.Fragment>
            ))}
          </div>
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            placeholder="Enter your guess of the queue's content"
          />
          <button onClick={handleGuessSubmit} className="submit-button">Submit Guess</button>
          {resultMessage && <div className="result-message">{resultMessage}</div>}
          {level2Unlocked && (
            <p style={{ color: "black" }}>Congratulations! You have unlocked the next level.</p>
          )}
        </div>
      </div>
    );
  }

export default QueueFirstLevel;
