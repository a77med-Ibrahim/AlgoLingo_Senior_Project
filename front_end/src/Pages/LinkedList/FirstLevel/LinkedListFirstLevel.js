import React, { useState, useEffect } from "react";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "../LevelBar";
import Xarrow from "react-xarrows";
import "./LinkedListFirstLevel.css";
import TryAgainAnimation from "../../TryAgainAnimation/TryAgain";
import Celebration from "../../Celebration/Celebration";

function LinkedListFirstLevel() {
  const [nodes, setNodes] = useState([]);
  const [deleteStep, setDeleteStep] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);

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

  function handleGuessSubmit() {
    // Exclude the deleted node based on deleteStep
    const remainingNodes = nodes.filter((_, index) => index !== deleteStep);
    const remainingValues = remainingNodes.map((node) => node.value).join(",");
    if (userGuess === remainingValues) {
      setResultMessage("Correct!");
      setTaskCompleted(true);
      setTryAgain(false); // Reset try again animation
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
        </div>
      </div>
    </div>
  );
}

export default LinkedListFirstLevel;
