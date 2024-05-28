import React, { useState, useEffect } from "react";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import LevelsBar from "./Levels Bar/LevelsBar";


function QueueSecondLevel() {
    const [operations, setOperations] = useState([]);
    const [queue, setQueue] = useState([]);
    const [userGuess, setUserGuess] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [sum, setSum] = useState(0);

    useEffect(() => {
      generateOperations();
    }, []);

    const generateOperations = () => {
      let tempQueue = [];
      const newOperations = [];
      const count = Math.floor(Math.random() * 10) + 5; // Generate between 5 and 15 operations
      for (let i = 0; i < count; i++) {
        if (Math.random() > 0.5 || tempQueue.length === 0) {
          const value = Math.floor(Math.random() * 100) + 1;
          newOperations.push(`enqueue(${value})`);
          tempQueue.push(value);
        } else {
          newOperations.push('dequeue()');
          tempQueue.shift();
        }
      }
      setQueue(tempQueue);
      setOperations(newOperations);
      updateSum(tempQueue);
    };

    const updateSum = (queue) => {
      const totalSum = queue.reduce((acc, curr) => acc + curr, 0);
      setSum(totalSum);
    };

    const handleGuessSubmit = () => {
      if (parseInt(userGuess) === sum) {
        setResultMessage('Correct!');
      } else {
        setResultMessage(`Incorrect, try again.`);
      }
    };

    return (
      <div className="flexing">
        <AlgoLingoBar />
        <div className="width-of-objects">
          <h1 className="title-styling">Queue</h1>
          <h2 className="title-styling">Second Level</h2>
          <div className="navbar-line" />
          <LevelsBar 
          levelUnlocked={true}
          level2Unlocked={true}
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
            type="number"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            placeholder="Enter your guess of the sum"
          />
          <button onClick={handleGuessSubmit} className="submit-button">Submit Guess</button>
          {resultMessage && <div className="result-message">{resultMessage}</div>}
        </div>
      </div>
    );
  }

export default QueueSecondLevel;
