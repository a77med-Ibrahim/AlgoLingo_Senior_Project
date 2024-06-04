import React, { useEffect, useRef, useState } from "react";
import LevelsBar from "./LevelBar";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import { useDrag, useDrop } from "react-dnd";
import Xarrow from "react-xarrows";
import Celebration from "../Celebration/Celebration";
import "./BSLevel2.css";
import TryAgainAnimation from "../TryAgainAnimation/TryAgain";
import Timer from "../Menu/Timer"; 
import { useAuth } from "../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore"; 
import { db } from "../Menu/firebaseConfig";
import axios from "axios";

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

  const [, drop] = useDrop({
    accept: "node",
    drop: (item) => onMoveNode(item.id, id),
  });

  const ref = useRef(null);
  drag(drop(ref));

  return (
    <div
      ref={ref}
      id={`node-${id}`}
      style={{ ...style, opacity: isDragging ? 0.5 : 1 }}
    >
      {number}
    </div>
  );
}

const nodePositions = [
  { x: 55, y: 43 }, // Root node centered at the top
  { x: 35, y: 58 }, // Level 2
  { x: 75, y: 58 },
  { x: 25, y: 73 }, // Level 3
  { x: 45, y: 73 },
  { x: 65, y: 73 },
  { x: 85, y: 73 },
  { x: 20, y: 83 }, // Level 4
  { x: 30, y: 83 },
  { x: 40, y: 83 },
  { x: 50, y: 83 },
  { x: 60, y: 83 },
  { x: 70, y: 83 },
  { x: 80, y: 83 },
  { x: 90, y: 83 },
];

function BSLevel2() {
  const { currentUser } = useAuth();
  const [heap, setHeap] = useState([]);
  const [isMaxHeap, setIsMaxHeap] = useState(true);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [message, setMessage] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);
  const [timerActive, setTimerActive] = useState(true); 
  const [timeTaken, setTimeTaken] = useState(0); 
  const [points, setPoints] = useState(0); 

  const TOTAL_TIME = 300; 
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
      const updateCompletedSection = {
        ...userData.Sections,
        Section4: true,
      }
      const updatedCompletedLevels = {
        ...userData.completedLevels,
        BSLevel2: true,
      };
      const updatedPoints = {
        ...userData.Points,
        pointsBSLevel2:earnedPoints,
      }

      await updateDoc(userDocRef, {
        completedLevels: updatedCompletedLevels,
        Points: updatedPoints,
        Sections:updateCompletedSection,
      });
    }
  };

  useEffect(() => {
    initializeHeap();
  }, []);

  useEffect(() => {
    if (taskCompleted) {
      setCelebrate(true);
      const earnedPoints = calculatePoints(timeTaken);
      setPoints(earnedPoints);
      handleLevelCompletion(earnedPoints); 
      setTimerActive(false);
    }
  }, [taskCompleted]);

  const initializeHeap = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/generate_heap2");
      const newNodes = response.data.nodes;

      const initialHeap = newNodes.map((node, index) => ({
        ...node,
        position: nodePositions[index],
      }));

      setHeap(initialHeap);
    } catch (error) {
      console.error("Error initializing heap:", error);
    }
  };

  const checkHeap = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/check_heap2", {
        heap,
        is_max_heap: isMaxHeap,
      });

      const { result, is_correct } = response.data;

      setMessage(result);
      if (is_correct) {
        if (isMaxHeap) {
          setIsMaxHeap(false);
          setTaskCompleted(false);
        } else {
          setTaskCompleted(true);
        }
        setTryAgain(false);
      } else {
        setTryAgain(true);
        setTimeout(() => {
          setTryAgain(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error checking heap:", error);
    }
  };

  const moveNode = (fromId, toId) => {
    const newHeap = [...heap];
    const fromIndex = newHeap.findIndex((node) => node.id === fromId);
    const toIndex = newHeap.findIndex((node) => node.id === toId);

    if (fromIndex < 0 || toIndex < 0) {
      console.error("Invalid indices", { fromIndex, toIndex });
      return;
    }

    [newHeap[fromIndex].number, newHeap[toIndex].number] = [
      newHeap[toIndex].number,
      newHeap[fromIndex].number,
    ];
    setHeap(newHeap);
  };

  return (
    <div className="flexing">
      <AlgoLingoBar />
      <div className="width-of-objects">
        <h1 className="title-styling">Heap Sort</h1>
        <h2 className="title-styling">Level 2</h2>
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
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            />
          ))}
          {heap.map((node, idx) => {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            return (
              <React.Fragment key={idx}>
                {leftChildIdx < heap.length && (
                  <Xarrow
                    start={`node-${node.id}`}
                    end={`node-${leftChildIdx}`}
                    curveness={0}
                    color="black"
                    headSize={0}
                  />
                )}
                {rightChildIdx < heap.length && (
                  <Xarrow
                    start={`node-${node.id}`}
                    end={`node-${rightChildIdx}`}
                    curveness={0}
                    color="black"
                    headSize={0}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <button onClick={checkHeap} className="second-heap-level-buttons">
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

export default BSLevel2;
