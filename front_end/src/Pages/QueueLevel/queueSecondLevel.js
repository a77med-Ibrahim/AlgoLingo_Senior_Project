import React, { useState, useEffect } from "react";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import LevelsBar from "./Levels Bar/LevelsBar";
import Timer from "../Menu/Timer"; // Import the Timer component
import { useAuth } from "../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../Menu/firebaseConfig";

function QueueSecondLevel() {
    const { currentUser } = useAuth();
    const [operations, setOperations] = useState([]);
    const [queue, setQueue] = useState([]);
    const [userGuess, setUserGuess] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [sum, setSum] = useState(0);
    const [timerActive, setTimerActive] = useState(true); // Timer state
    const [timeTaken, setTimeTaken] = useState(0); // State to track time taken
    const [points, setPoints] = useState(0); // State to hold points for this level

    useEffect(() => {
      generateOperations();
    }, []);

    useEffect(() => {
      if (timerActive) {
        const interval = setInterval(() => {
          setTimeTaken((prevTimeTaken) => prevTimeTaken + 1);
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [timerActive]);

    const TOTAL_TIME = 60; // Total time for this level
    const handleTimeUpdate = (timeLeft) => {
      setTimeTaken(TOTAL_TIME - timeLeft);
    };
  
    const calculatePoints = (timeTaken) => {
      return TOTAL_TIME - timeTaken;
    };

    const handleGuessSubmit = () => {
      if (parseInt(userGuess) === sum) {
        setResultMessage('Correct!');
        setTimerActive(false); // Stop the timer
        const earnedPoints = calculatePoints(timeTaken);
        setPoints(earnedPoints);
        handleLevelCompletion(earnedPoints); // Update Firestore with the earned points
      } else {
        setResultMessage(`Incorrect, try again.`);
      }
    };

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

    const handleLevelCompletion = async (earnedPoints) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
        const updatedCompletedLevels = {
          ...userData.completedLevels,
          QueueSecondLevel: true,
        };
        const updatedPoints = {
          ...userData.Points,
          pointsQueueSecondLevel:earnedPoints,
        }

        await updateDoc(userDocRef, {
          completedLevels: updatedCompletedLevels,
          Points: updatedPoints,
        });
      }
    };

    return (
      <div className="flexing">
        <AlgoLingoBar />
        <div className="width-of-objects">
          <h1 className="title-styling">Queue</h1>
          <h2 className="title-styling">Second Level</h2>
          <div className="navbar-line" />
          <LevelsBar levelUnlocked={true} level2Unlocked={true} />
          <div className="q">
            <p>
              After the following operations, calculate the sum of all the values inside the queue.
            </p>
          </div>
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
          <Timer
            isActive={timerActive}
            onTimeUpdate={handleTimeUpdate}
            totalTime={TOTAL_TIME}
          />
          <div>
            <p>Points: {points}</p>
          </div>
        </div>
      </div>
    );
}

export default QueueSecondLevel;
