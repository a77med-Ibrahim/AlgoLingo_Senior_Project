import React, { useState, useCallback, useRef, useEffect } from "react";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "../LevelBar";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import "./LinkedListSecondLevel.css";
import Celebration from "../../Celebration/Celebration";
import TryAgainAnimation from "../../TryAgainAnimation/TryAgain";
import Timer from "../../Menu/Timer";
import { useAuth } from "../../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../Menu/firebaseConfig";

const NodeType = "node";

const DraggableNode = ({ id, text, index, moveNode }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: NodeType,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveNode(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: NodeType,
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        padding: "20px",
        margin: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "5px",
        width: "100px",
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20px",
          left: "50%",
          transform: "translateX(-50%)",
          fontWeight: "bold",
        }}
      >
        {index + 1}
      </div>
      {text}
    </div>
  );
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const LinkedListSecondLevel = () => {
  const { currentUser } = useAuth();
  const correctOrder = [
    { id: "x", text: "Reach node 'X'", index: 0 },
    { id: "y", text: "Create node 'Y'", index: 1 },
    { id: "ynext", text: "Point 'Y.next' to 'X.next'", index: 2 },
    { id: "xnext", text: "Point 'X.next' to 'Y'", index: 3 },
  ];

  const [nodes, setNodes] = useState(() => shuffle([...correctOrder]));
  const [message, setMessage] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [timeTaken, setTimeTaken] = useState(0);
  const [points, setPoints] = useState(0);

  const TOTAL_TIME = 100;
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
        Section3: true,
      };

      const updatedCompletedLevels = {
        ...userData.completedLevels,
        LinkedListSecondLevel: true,
      };
      const updatedPoints = {
        ...userData.Points,
        pointsLinkedListSecondLevel: earnedPoints,
      };

      await updateDoc(userDocRef, {
        completedLevels: updatedCompletedLevels,
        Points: updatedPoints,
        Sections: updateCompletedSection,
      });
    }
  };

  const moveNode = useCallback((dragIndex, hoverIndex) => {
    setNodes((prevNodes) =>
      update(prevNodes, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevNodes[dragIndex]],
        ],
      })
    );
  }, []);

  const checkOrder = () => {
    const isCorrect = nodes.every(
      (node, index) => node.id === correctOrder[index].id
    );
    setMessage(isCorrect ? "Correct order!" : "Incorrect order, try again!");
    if (isCorrect) {
      const earnedPoints = calculatePoints(timeTaken);
      setPoints(earnedPoints);
      setCelebrate(true);
      setTryAgain(false);
      setTimerActive(false);
      handleLevelCompletion(earnedPoints);
    } else {
      setCelebrate(false);
      setTryAgain(true);
      setTimeout(() => {
        setTryAgain(false);
      }, 500);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="all-div">
        <AlgoLingoBar />
        <div className="other">
          <h1 className="title-styling">Linked List</h1>
          <h2 className="title-styling">Second Level</h2>
          <div className="navbar-line" />
          <LevelsBar taskCompleted={true} />
          <div className="q">
            <p>
              Arrange the blocks to add a new node 'Y' in the middle of the
              linked list. 'X' is the node after which we want to add 'Y'.
            </p>
            <p className="note">
              Note: The steps should be in the correct order to not lose the
              data stored in the linked list{" "}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "nowrap",
              padding: "20px",
            }}
          >
            {nodes.map((node, index) => (
              <DraggableNode
                key={node.id}
                id={node.id}
                text={node.text}
                index={index}
                moveNode={moveNode}
              />
            ))}
          </div>
          <button onClick={checkOrder} className="push-buttons-styling">
            Check Order
          </button>
          <div className="result-message">{message}</div>
          <Celebration active={celebrate} />
          <TryAgainAnimation active={tryAgain} />
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
    </DndProvider>
  );
};

export default LinkedListSecondLevel;
