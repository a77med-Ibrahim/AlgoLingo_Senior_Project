import React, { useState, useEffect } from "react";
import "./ThirdLevel.css";
import StackImplementation from "./StackImplementation";
import LevelsBar from "./LevelBar";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import Celebration from "../Celebration/Celebration";
import TryAgainAnimation from "../TryAgainAnimation/TryAgain";
import Timer from "../Menu/Timer";
import { useAuth } from "../Menu/AuthContext";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Menu/firebaseConfig";
import axios from "axios";
function ThirdLevel() {
  const { currentUser } = useAuth();
  const [stack, setStack] = useState(new StackImplementation());
  const [poppedShapes, setPoppedShapes] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [operations, setOperations] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [checkResult3, setCheckResult3] = useState("");
  const [thirdLevelCompleted, setThirdLevelCompleted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [timeTaken, setTimeTaken] = useState(0);
  const [points3, setPoints3] = useState(0);

  const generateRandomShapes = () => {
    const newStack = new StackImplementation();

    const shapes = ["triangle", "square", "rectangle", "octagon"];

    const newStackShapes = [];
    const selectedShapes = new Set();

    while (selectedShapes.size < shapes.length) {
      const randomIndex = Math.floor(Math.random() * shapes.length);
      selectedShapes.add(shapes[randomIndex]);
    }

    selectedShapes.forEach((shape) => newStackShapes.push(shape));

    for (let i = newStackShapes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newStackShapes[i], newStackShapes[j]] = [
        newStackShapes[j],
        newStackShapes[i],
      ];
    }

    const newOperations = newStackShapes.map((shape) => ({
      type: "push",
      shape,
    }));

    const numberOfShapesToPop = Math.floor(Math.random() * 3) + 1;
    newOperations.push({ type: "pop", count: numberOfShapesToPop });

    setOperations(newOperations);
    setStack(newStack);
    setQuestionText(generateQuestion(newStackShapes, numberOfShapesToPop));
  };

  const generateQuestion = (stackShapes, popCount) => {
    const questionArray = [];

    if (stackShapes.length === 1) {
      questionArray.push(`Push the shape ${stackShapes[0]}`);
    } else {
      questionArray.push(
        `Push the shapes ${stackShapes
          .slice(0, -1)
          .join(", ")} and ${stackShapes.slice(-1)}`
      );
    }

    if (popCount === 1) {
      questionArray.push(`then pop ${popCount} shape`);
    } else {
      questionArray.push(`then pop ${popCount} shapes`);
    }

    const question = questionArray.join(", ");

    return question;
  };

  useEffect(() => {
    generateRandomShapes();
  }, []);

  const applyOperationAndGetStack = (operations) => {
    let newStack = new StackImplementation();
    let newPoppedShapes = [];

    operations.forEach((operation) => {
      if (operation.type === "pop") {
        for (let i = 0; i < operation.count; i++) {
          if (!newStack.isEmpty()) {
            newPoppedShapes.push(newStack.pop());
          }
        }
      } else if (operation.type === "push") {
        newStack.push(operation.shape);
      }
    });

    setPoppedShapes(newPoppedShapes);
    setStack(newStack);
    return newStack.stack;
  };

  useEffect(() => {
    if (operations.length > 0) {
      applyOperationAndGetStack(operations);
    }
  }, [operations]);

  const TOTAL_TIME = 60;
  const handleTimeUpdate = (timeLeft) => {
    setTimeTaken(TOTAL_TIME - timeLeft);
  };

  const calculatePoints = (timeTaken) => {
    return TOTAL_TIME - timeTaken;
  };

  const handleLevelCompletion = async (earnedPoints) => {
    if (currentUser) {
      try {
        const response = await axios.post("http://localhost:5000/update_user_level", { 
          userId: currentUser.uid,
          section:"Stack_Level",
          level: "ThirdLevel",       
          status: true, 
          score: earnedPoints, 
          
        });
  
        console.log(response.data.message); 
      } catch (error) {
        console.error("Error updating user level:", error);
      }
    }
  };
  const handleCheck = async () => {
    const lastPoppedShape = poppedShapes[poppedShapes.length - 1];
    if (userAnswer === lastPoppedShape) {
      setCheckResult3("Great!");
      setThirdLevelCompleted(true);
      setFadeOut(true);
      setCelebrate(true);
      setTryAgain(false);
      const earnedPoints = calculatePoints(timeTaken);
      setPoints3(earnedPoints);

      await handleLevelCompletion(earnedPoints);
    } else {
      setCheckResult3("Incorrect");
      setCelebrate(false);
      setTryAgain(true);
    }
    setTimeout(() => {
      setTryAgain(false);
    }, 500);
  };

  return (
    <div className="all-div">
      <AlgoLingoBar />
      <div className="other">
        <div>
          <h1 className="title-styling">Stack</h1>
          <h2 className="title-styling">Third Level</h2>
        </div>
        <div className="queue-navbar-line"></div>

        <LevelsBar
          pushClicked={true}
          popClicked={true}
          peekClicked={true}
          isEmptyClicked={true}
          checkResult={"Great!"}
          checkResult2={"Great!"}
        />
        <br></br>
        <div className="third-level-container">
          <div className="shapes-container">
            <div className="stack">
              {stack.stack.map((shape, index) => (
                <div key={`stack-${index}`} className={`shape ${shape}`}></div>
              ))}
            </div>
            <div className="shapes">
              {poppedShapes
                .slice()
                .reverse()
                .map((shape, index) => (
                  <div
                    key={`popped-${index}`}
                    className={`shape ${shape} ${fadeOut ? "fade-out" : ""}`}
                  ></div>
                ))}
            </div>
          </div>
          <div className="question">
            <h3>What will be the last popped shape after</h3>
            <p>{questionText}</p>
            <input
              type="text"
              placeholder="Enter your answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="input-class"
            />
            {checkResult3 && <p>{checkResult3}</p>}
          </div>
          <button
            className="stack-level-first-game-buttons"
            onClick={handleCheck}
          >
            Check
          </button>
          <Celebration active={celebrate} />
          <TryAgainAnimation active={tryAgain} />
        </div>
        <Timer
          isActive={timerActive}
          onTimeUpdate={handleTimeUpdate}
          totalTime={TOTAL_TIME}
        />
        <div>
          <p>Points: {points3}</p>
        </div>
      </div>
    </div>
  );
}

export default ThirdLevel;
