import React, { useState, useEffect } from "react";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import LevelsBar from "./Levels Bar/LevelsBar";
import "./queuefirstLevel.css";
import Timer from "../Menu/Timer"; // Import the Timer component
import { useAuth } from "../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../Menu/firebaseConfig";

function QueueFirstLevel() {
  const { currentUser } = useAuth();
  const [operations, setOperations] = useState([]);
  const [queue, setQueue] = useState([]);
  const [userGuess, setUserGuess] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [level2Unlocked, setLevel2Unlocked] = useState(false); 
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

  const TOTAL_TIME = 60; 
  const handleTimeUpdate = (timeLeft) => {
    setTimeTaken(TOTAL_TIME - timeLeft);
  };
  const calculatePoints = (timeTaken) => {
    return TOTAL_TIME - timeTaken;
  };


  const handleGuessSubmit = () => {
    if (userGuess === queue.join(",")) {
      setResultMessage("Correct!");
      setLevel2Unlocked(true); 
      setTimerActive(false); 
      const earnedPoints = calculatePoints(timeTaken);
      setPoints(earnedPoints);
      handleLevelCompletion(earnedPoints); 
    } else {
      setResultMessage("Incorrect, try again");
    }
  };

  const generateOperations = () => {
    let tempQueue = [];
    const newOperations = [];
    const count = Math.floor(Math.random() * 10) + 5; 
    for (let i = 0; i < count; i++) {
      if (Math.random() > 0.5 || tempQueue.length === 0) {
        const value = Math.floor(Math.random() * 100) + 1;
        newOperations.push(`enqueue(${value})`);
        tempQueue.push(value);
      } else {
        newOperations.push("dequeue()");
        tempQueue.shift();
      }
    }
    setQueue(tempQueue); 
    setOperations(newOperations);
  };

  
  const handleLevelCompletion = async (earnedPoints) => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      const updatedCompletedLevels = {
        ...userData.completedLevels,
        QueueFirstLevel: true,
      };
      const updatedPoints = earnedPoints;

      await updateDoc(userDocRef, {
        completedLevels: updatedCompletedLevels,
        pointsQueueFirstLevel: updatedPoints,
      });
    }
  };

  return (
    <div className="flexing">
      <AlgoLingoBar />
      <div className="width-of-objects">
        <h1 className="title-styling">Queue</h1>
        <h2 className="title-styling">First Level</h2>
        <div className="navbar-line" />
        <LevelsBar levelUnlocked={true} level2Unlocked={level2Unlocked} />
        <div>
          <p>Apply the following changes to a queue, what will the final array contain?</p>
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
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Enter your guess of the queue's content"
        />
        <button onClick={handleGuessSubmit} className="submit-button">
          Submit Guess
        </button>
        {resultMessage && <div className="result-message">{resultMessage}</div>}
        {level2Unlocked && (
          <p style={{ color: "black" }}>Congratulations! You have unlocked the next level.</p>
        )}
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

export default QueueFirstLevel;
