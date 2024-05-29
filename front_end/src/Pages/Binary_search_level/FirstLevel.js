import React, { useState, useRef, useEffect } from "react";
import LevelsBar from "./LevelBar";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import { useDrag, useDrop } from "react-dnd";
import Xarrow from "react-xarrows";
import Celebration from "../Celebration/Celebration";
import "./FirstLevel.css";
import TryAgainAnimation from "../TryAgainAnimation/TryAgain";
import Timer from "../Menu/Timer"; // Import the Timer component
import { useAuth } from "../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../Menu/firebaseConfig";

function DraggableNode({ id, number, onMoveNode, style }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "node",
      item: { id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "node",
      drop: (item) => {
        if (item.id !== id) {
          onMoveNode(item.id, id);
        }
      },
    }),
    [id]
  );
  const ref = useRef(null);
  drag(drop(ref));

  // Adjust style inside the component to consider isDragging
  const nodeStyle = {
    ...style,
    opacity: isDragging ? 0.5 : 1,
    fontWeight: "bold",
    cursor: "move",
    width: "5vw", // using viewport width for responsive size
    height: "5vw", // same as width to maintain aspect ratio
    borderRadius: "50%",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "1vw",
  };

  return (
    <div ref={ref} style={style} id={`node-${id}`}>
      {number}
    </div>
  );
}

const nodePositions = [
  { x: 53, y: 40 }, // Example positions in percentages
  { x: 40.75, y: 60.33 },
  { x: 65.25, y: 60.33 },
  { x: 34.75, y: 73.67 },
  { x: 46, y: 73.67 },
  { x: 59.5, y: 73.67 },
  { x: 70.5, y: 73.67 },
];

function generateRandomNumber() {
  return Math.floor(Math.random() * 100) + 1; // Generates a random number between 1 and 100
}

const initialHeap = Array.from({ length: 7 }, (_, index) => ({
  id: index,
  number: generateRandomNumber(),
  position: nodePositions[index],
}));

function isMaxHeapFunction(heap) {
  for (let i = 0; i < heap.length; i++) {
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    if (
      (left < heap.length && heap[i].number < heap[left].number) ||
      (right < heap.length && heap[i].number < heap[right].number)
    ) {
      return false;
    }
  }
  return true;
}

function isMinHeap(heap) {
  for (let i = 0; i < heap.length; i++) {
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    if (
      (left < heap.length && heap[i].number > heap[left].number) ||
      (right < heap.length && heap[i].number > heap[right].number)
    ) {
      return false;
    }
  }
  return true;
}

function FirstLevel() {
  const { currentUser } = useAuth();
  const [heap, setHeap] = useState(initialHeap);
  const [isMaxHeap, setIsMaxHeap] = useState(true);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [message, setMessage] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);
  const [timerActive, setTimerActive] = useState(true); 
  const [timeTaken, setTimeTaken] = useState(0); 
  const [points, setPoints] = useState(0); 

  const TOTAL_TIME = 120; 
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
        BSLevel1: true,
      };
      const updatedPoints = {
        ...userData.Points,
        pointsBSLevel1:earnedPoints,
      }

      await updateDoc(userDocRef, {
        completedLevels: updatedCompletedLevels,
        Points: updatedPoints,
      });
    }
  };

  useEffect(() => {
    if (taskCompleted) {
      setCelebrate(true);
      const earnedPoints = calculatePoints(timeTaken);
      setPoints(earnedPoints);
      handleLevelCompletion(earnedPoints); 
      setTimerActive(false);
      setPoints(earnedPoints);
    }
  }, [taskCompleted]);

  function checkHeap() {
    const isValidHeap = isMaxHeap ? isMaxHeapFunction(heap) : isMinHeap(heap);
    if (isValidHeap) {
      setMessage(`Correct! This is a ${isMaxHeap ? "max" : "min"} heap.`);
      if (isMaxHeap) {
        setIsMaxHeap(false);
        setTaskCompleted(false);
      } else {
        setTaskCompleted(true);
        
        
      }
      setTryAgain(false); 
    } else {
      setMessage(
        `Incorrect, this is not a ${isMaxHeap ? "max" : "min"} heap. Try again.`
      );
      setTryAgain(true);
      setTimeout(() => {
        setTryAgain(false);
      }, 500);
    }
  }

  const moveNode = (fromId, toId) => {
    const newHeap = [...heap];
    const fromIndex = newHeap.findIndex((node) => node.id === fromId);
    const toIndex = newHeap.findIndex((node) => node.id === toId);

    if (fromIndex < 0 || toIndex < 0) {
      console.error("Invalid indices", { fromIndex, toIndex });
      return;
    }

    const temp = newHeap[fromIndex].number;
    newHeap[fromIndex].number = newHeap[toIndex].number;
    newHeap[toIndex].number = temp;

    setHeap(newHeap);
  };

  return (
    <div className="flexing">
    <AlgoLingoBar />
    <div className="width-of-objects">
      <h1 className="title-styling">Binary Search</h1>
      <h2 className="title-styling">Level 1</h2>
      <div className="navbar-line" />
      <LevelsBar
        maxHeapClicked={true}
        minHeapClicked={true}
        taskCompleted={taskCompleted}
      />
      <div className="heap-container">
        {heap.map((node, index) => (
          <DraggableNode
            key={node.id}
            id={node.id}
            number={node.number}
            onMoveNode={moveNode}
            style={{
              position: "absolute",
              left: `${node.position.x}%`,
              top: `${node.position.y}%`,
              width: "5vw",
              height: "5vw",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "1vw",
              zIndex: 1,
            }}
          />
        ))}
        {heap.map((node, idx) => {
          let leftChildIdx = 2 * idx + 1;
          let rightChildIdx = 2 * idx + 2;
          return (
            <>
              {leftChildIdx < heap.length && (
                <Xarrow
                  start={`node-${node.id}`}
                  end={`node-${leftChildIdx}`}
                  color="black"
                  curveness={0}
                  headSize={0}
                />
              )}
              {rightChildIdx < heap.length && (
                <Xarrow
                  start={`node-${node.id}`}
                  end={`node-${rightChildIdx}`}
                  color="black"
                  curveness={0}
                  headSize={0}
                />
              )}
            </>
          );
        })}
      </div>
      <button onClick={checkHeap} className="first-heap-level-buttons">
        Check Heap
      </button>
      <p>
        Current task: {isMaxHeap ? "Create a Max Heap" : "Create a Min Heap"}
      </p>
      {message && <p>{message}</p>}
      {taskCompleted && !isMaxHeap && (
        <p>Well done! You've completed both tasks!</p>
      )}
      <Celebration active={celebrate} />
      <TryAgainAnimation active={tryAgain} />
      <div>
      <Timer
            isActive={timerActive}
            onTimeUpdate={handleTimeUpdate}
            totalTime={TOTAL_TIME}
          />
      </div>
      <div>
            <p>Points: {points}</p>
          </div>
    </div>
  </div>
);
}

export default FirstLevel;

