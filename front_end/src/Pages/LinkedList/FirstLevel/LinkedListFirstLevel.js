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
import axios from "axios";

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
  const [remainingValues, setRemainingValues] = useState([]); 

  useEffect(() => {
    initializeLinkedList();
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

  const initializeLinkedList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/generate_linked_list_operations1");
      const { nodes: newNodes, delete_step: newDeleteStep, remaining_values: newRemainingValues } = response.data;

      setNodes(newNodes);
      setDeleteStep(newDeleteStep);
      setRemainingValues(newRemainingValues);
    } catch (error) {
      console.error("Error initializing linked list:", error);
    }
  };

  const handleLevelCompletion = async (earnedPoints) => {
    if (currentUser) {
      try {
        const response = await axios.post("http://localhost:5000/update_user_level", { 
          userId: currentUser.uid,
          section:"LinkedList",
          level: "LinkedFirstLevel",       
          status: true, 
          score: earnedPoints, 
          
        });
  
        console.log(response.data.message); 
      } catch (error) {
        console.error("Error updating user level:", error);
      }
    }
  };

  const handleGuessSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/check_linked_list_answer1", {
        user_guess: userGuess,
        correct_values: remainingValues,
      });

      const { result, is_correct } = response.data;

      setResultMessage(result);
      if (is_correct) {
        const earnedPoints = calculatePoints(timeTaken);
        setPoints(earnedPoints);
        setTaskCompleted(true);
        setTryAgain(false); 
        setTimerActive(false);
        handleLevelCompletion(earnedPoints); 
      } else {
        setTaskCompleted(false);
        setCelebrate(false);
        setTryAgain(true); 
  
        setTimeout(() => {
          setTryAgain(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

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
