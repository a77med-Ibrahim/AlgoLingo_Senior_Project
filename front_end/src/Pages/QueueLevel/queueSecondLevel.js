import React, { useState, useEffect } from "react";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import "./queueSecondLevel.css";
import LevelsBar from "./Levels Bar/LevelsBar";
import Timer from "../Menu/Timer";
import { useAuth } from "../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../Menu/firebaseConfig";
import Celebration from "./../Celebration/Celebration";
import TryAgainAnimation from "./../TryAgainAnimation/TryAgain";

function QueueSecondLevel() {
  const { currentUser } = useAuth();
  const [operations, setOperations] = useState([]);
  const [queue, setQueue] = useState([]);
  const [userGuess, setUserGuess] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [sum, setSum] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [timeTaken, setTimeTaken] = useState(0);
  const [points, setPoints] = useState(0);
  const [enqueuedValues, setEnqueuedValues] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [celebrate, setCelebrate] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);

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
    if (parseInt(userGuess) === sum) {
      setResultMessage("Correct!");
      setTimerActive(false);
      const earnedPoints = calculatePoints(timeTaken);
      setPoints(earnedPoints);
      handleLevelCompletion(earnedPoints);
      setCelebrate(true);
    } else {
      setResultMessage("Incorrect, try again.");
      setTryAgain(true);
      setTimeout(() => {
        setTryAgain(false);
      }, 500);
    }
  };

  const generateOperations = () => {
    let tempQueue = [];
    const newOperations = [];
    const newEnqueuedValues = [];
    const count = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < count; i++) {
      if (Math.random() > 0.5 || tempQueue.length === 0) {
        const value = Math.floor(Math.random() * 100) + 1;
        newOperations.push(`enqueue(${value})`);
        tempQueue.push(value);
        newEnqueuedValues.push(value);
      } else {
        newOperations.push("dequeue()");
        tempQueue.shift();
      }
    }
    setQueue(tempQueue);
    setOperations(newOperations);
    setEnqueuedValues(newEnqueuedValues);
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
      const updateCompletedSection = {
        ...userData.Sections,
        Section2: true,
      };
      const updatedCompletedLevels = {
        ...userData.completedLevels,
        QueueSecondLevel: true,
      };
      const updatedPoints = {
        ...userData.Points,
        pointsQueueSecondLevel: earnedPoints,
      };

      await updateDoc(userDocRef, {
        completedLevels: updatedCompletedLevels,
        Points: updatedPoints,
        Sections: updateCompletedSection,
      });
    }
  };

  const handleBlockClick = (value) => {
    setSelectedValues((prevSelectedValues) => {
      if (prevSelectedValues.length < 10) {
        return [...prevSelectedValues, value];
      } else {
        return prevSelectedValues;
      }
    });
  };

  const handleDeQueue = () => {
    setSelectedValues((prevSelectedValues) => prevSelectedValues.slice(1));
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
            After the following operations, calculate the sum of all the values
            inside the queue.
          </p>
        </div>
        <div className="operations-container">
          {operations.map((op, index) => (
            <React.Fragment key={index}>
              <span className="operation-text">{op}</span>
              {index < operations.length - 1 && <span>, </span>}
            </React.Fragment>
          ))}
        </div>
        <input
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          className="queue-first-level-input"
          placeholder="Enter your guess of the sum"
        />
        <button onClick={handleGuessSubmit} className="queue-buttons-styling">
          Submit Guess
        </button>
        {resultMessage && <div className="result-message">{resultMessage}</div>}
        <Timer
          isActive={timerActive}
          onTimeUpdate={handleTimeUpdate}
          totalTime={TOTAL_TIME}
        />
        <div>
          <p>Points: {points}</p>
        </div>
        <div className="enqueued-values-container">
          {enqueuedValues.map((value, index) => (
            <div
              key={index}
              className="enqueued-value-block"
              onClick={() => handleBlockClick(value)}
            >
              {value}
            </div>
          ))}
        </div>
        <div className="sidebar">
          <button onClick={handleDeQueue} className="queue-buttons-styling">
            deQueue
          </button>
          <h2 className="selected-values">Selected Values:</h2>
          <div className="sidebar-items">
            {selectedValues.map((item, index) => (
              <div key={index} className="sidebar-item">
                {item}
              </div>
            ))}
          </div>
        </div>
        <Celebration active={celebrate} />
        <TryAgainAnimation active={tryAgain} />
      </div>
    </div>
  );
}

export default QueueSecondLevel;
