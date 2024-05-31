import React, { useState, useEffect } from "react";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import LevelsBar from "./Levels Bar/LevelsBar";
import "./queuefirstLevel.css";
import Timer from "../Menu/Timer";
import { useAuth } from "../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../Menu/firebaseConfig";
import Celebration from "./../Celebration/Celebration";
import TryAgainAnimation from "./../TryAgainAnimation/TryAgain";

function QueueFirstLevel() {
  const { currentUser } = useAuth();
  const [operations, setOperations] = useState([]);
  const [queue, setQueue] = useState([]);
  const [userGuess, setUserGuess] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [level2Unlocked, setLevel2Unlocked] = useState(false);
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
    if (userGuess === queue.join(",")) {
      setResultMessage("Correct!");
      setLevel2Unlocked(true);
      setTimerActive(false);
      setCelebrate(true);
      const earnedPoints = calculatePoints(timeTaken);
      setPoints(earnedPoints);
      handleLevelCompletion(earnedPoints);
    } else {
      setTryAgain(true);
      setResultMessage("Incorrect, try again");
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
      const updatedPoints = {
        ...userData.Points,
        pointsQueueFirstLevel: earnedPoints,
      };

      await updateDoc(userDocRef, {
        completedLevels: updatedCompletedLevels,
        Points: updatedPoints,
      });
    }
  };

  const handleBlockClick = (value) => {
    setSelectedValues((prevSelectedValues) => {
      if (prevSelectedValues.length < 7) {
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
        <h2 className="title-styling">First Level</h2>
        <div className="navbar-line" />
        <LevelsBar levelUnlocked={true} level2Unlocked={level2Unlocked} />
        <div className="question">
          <p>
            Apply the following changes to a queue, what will the final array
            contain?
          </p>
          <p className="note">
            Note: Don't add spaces between commas and numbers.Ex:10,12,22
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
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Enter your guess of the queue's content"
          className="queue-first-level-input"
        />
        <button onClick={handleGuessSubmit} className="queue-buttons-styling">
          Submit Guess
        </button>
        {resultMessage && <div className="result-message">{resultMessage}</div>}
        {level2Unlocked && (
          <p style={{ color: "black" }}>
            Congratulations! You have unlocked the next level.
          </p>
        )}

        <Timer
          isActive={timerActive}
          onTimeUpdate={handleTimeUpdate}
          totalTime={TOTAL_TIME}
        />
        <div>
          <p>Points: {points}</p>
        </div>
        <h3>
          {" "}
          You can use the following blocks to enQueue and deQueue to visualize
          the process.(This will not affect your answer)
        </h3>
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

export default QueueFirstLevel;
