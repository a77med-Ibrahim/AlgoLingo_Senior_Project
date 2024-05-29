import React, { useState, useEffect } from "react";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "../LevelBar";
import Xarrow from "react-xarrows";
import "./LinkedListFirstLevel.css";
import TryAgainAnimation from "../../TryAgainAnimation/TryAgain";
import Celebration from "../../Celebration/Celebration";
import Timer from "../../Menu/Timer"; // Import the Timer component
import { useAuth } from "../../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../Menu/firebaseConfig";

function LinkedListFirstLevel() {
  const { currentUser } = useAuth();
  const [nodes, setNodes] = useState([]);
  const [deleteStep, setDeleteStep] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);
  const [timerActive, setTimerActive] = useState(true); 
  const [timeTaken, setTimeTaken] = useState(0); 
  const [points, setPoints] = useState(0); 

  useEffect(() => {
    const nodeCount = Math.floor(Math.random() * 3) + 3; // 3-5 nodes
    const newNodes = Array.from({ length: nodeCount }, (_, index) => ({
      id: `node-${index}`,
      value: Math.floor(Math.random() * 100),
    }));
    setNodes(newNodes);
    // Select a random node to be deleted, not the head
    setDeleteStep(Math.floor(Math.random() * (nodeCount - 1)) + 1);
  }, []);

  useEffect(() => {
    if (taskCompleted) {
      setCelebrate(true);
    }
  }, [taskCompleted]);

  const TOTAL_TIME = 60;
  const handleTimeUpdate = (timeLeft) => {
    setTimeTaken(TOTAL_TIME - timeLeft);
  };

  const calculatePoints = (timeTaken) => {
    return TOTAL_TIME - timeTaken;
  };

  const handleLevelCompletion = async (earnedPoints) => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      const updatedCompletedLevels = {
        ...userData.completedLevels,
        LinkedListFirstLevel: true,
      };
      const updatedPoints = earnedPoints;

      await updateDoc(userDocRef, {
        completedLevels: updatedCompletedLevels,
        pointsLinkedListFirstLevel: updatedPoints,
      });
    }
  };

  function handleGuessSubmit() {
    const remainingNodes = nodes.filter((_, index) => index !== deleteStep);
    const remainingValues = remainingNodes.map((node) => node.value).join(",");
    if (userGuess === remainingValues) {
      const earnedPoints = calculatePoints(timeTaken);
      setPoints(earnedPoints);
      setResultMessage("Correct!");
      setTaskCompleted(true);
      setTryAgain(false); 
      setTimerActive(false);
      handleLevelCompletion(earnedPoints); 
    } else {
      setResultMessage("Incorrect, try again.");
      setTaskCompleted(false);
      setCelebrate(false);
      setTryAgain(true); 
      // Cooldown to allow re-triggering the animation
      setTimeout(() => {
        setTryAgain(false);
      }, 500);
    }
  }

  return (
    <div>
      <div className="all-div">
        <AlgoLingoBar />
        <div className="other">
          <h1 className="title-styling">Linked List</h1>
          <h2 className="title-styling">First Level</h2>
          <div className="navbar-line" />
          <LevelsBar taskCompleted={taskCompleted} />
          <p>
            Enter the list values after deleting the node at 'head
            {new Array(deleteStep).fill(".next").join("")}'.
          </p>
          <div className="game-container">
            {nodes.map((node, index) => (
              <div
                key={node.id}
                id={node.id}
                className={`box-style ${
                  index === deleteStep ? "deleted-node" : ""
                }`}
              >
                <p
                  className={`${index === 0 ? "head-text single-head" : ""}`}
                ></p>
                <p>{node.value}</p>
                {index < nodes.length - 1 && (
                  <Xarrow
                    start={node.id}
                    end={nodes[index + 1].id}
                    color="blue"
                    startAnchor="right"
                    endAnchor="left"
                  />
                )}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            placeholder="Enter remaining values (e.g., 10,20,30)"
            className="input-field"
          />
          <button onClick={handleGuessSubmit} className="push-buttons-styling">
            Submit Guess
          </button>
          {resultMessage && (
            <div className="result-message">
              {resultMessage}
              {taskCompleted ? (
                <Celebration active={celebrate} />
              ) : (
                <TryAgainAnimation active={tryAgain} />
              )}
            </div>
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
    </div>
  );
}

export default LinkedListFirstLevel;
