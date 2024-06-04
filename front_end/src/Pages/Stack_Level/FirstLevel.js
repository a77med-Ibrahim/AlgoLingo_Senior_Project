import React, { useState, useEffect } from "react";
import "./FirstLevel.css";
import StackImplementation from "./StackImplementation";
import LevelsBar from "./LevelBar";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import { useAuth } from "../Menu/AuthContext";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../Menu/firebaseConfig";
import TryAgainAnimation from "../TryAgainAnimation/TryAgain";
import Celebration from "../Celebration/Celebration";
import Timer from "../Menu/Timer";
import axios from "axios";

function FirstLevel() {
  const { currentUser } = useAuth();
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [stack, setStack] = useState(new StackImplementation());
  const [poppedValues, setPoppedValues] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [operations, setOperations] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [checkResult, setCheckResult] = useState("");
  const [firstLevelCompleted, setFirstLevelCompleted] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [timeTaken, setTimeTaken] = useState(0);
  const [points, setPoints] = useState(0);
  const [randomizeElements, setRandomizeElements] = useState(null);
  const [manualElementCount, setManualElementCount] = useState(0);

  const initializeStack = async (elementCount) => {
    try {
      console.log(`Requesting stack with ${elementCount} elements`); // Log the request
      const response = await axios.get(`http://127.0.0.1:5000/fill_stack?count=${elementCount}`);
      const initialStackValues = response.data;
      console.log("Received stack values:", initialStackValues); // Log the received data

      const newStack = new StackImplementation();
      initialStackValues.forEach((value) => newStack.push(value));

      const popCount = Math.floor(Math.random() * Math.min(elementCount, 3)) + 1;
      const newOperations = [{ type: "pop", count: popCount }];

      setStack(newStack);
      setQuestionText(generateQuestion(initialStackValues, popCount));
      setOperations(newOperations);
    } catch (error) {
      console.error("Error initializing stack:", error);
    }
  };

  const generateQuestion = (stackValues, popCount) => {
    const questionArray = [];

    questionArray.push(`Push ${stackValues.join(", ")}`);
    questionArray.push(`Pop ${popCount} values`);

    const question = questionArray.join(" AND ");

    return question;
  };

  useEffect(() => {
    if (randomizeElements !== null) {
      const elementCount = randomizeElements ? Math.floor(Math.random() * 5) + 3 : manualElementCount;
      initializeStack(elementCount);
    }
  }, [randomizeElements, manualElementCount]);

  const handleButtonClick = (index) => {
    setActiveButtonIndex(index);
  };

  useEffect(() => {
    console.log(applyOperationAndGetStack(stack.stack));
  }, [operations]);

  const applyOperationAndGetStack = (currentStack) => {
    let newStack = new StackImplementation();

    currentStack.forEach((value) => {
      newStack.push(value);
    });

    let newPoppedValues = [];

    operations.forEach((operation) => {
      if (operation.type === "pop") {
        for (let i = 0; i < operation.count; i++) {
          if (!newStack.isEmpty()) {
            newPoppedValues.push(newStack.pop());
          }
        }
      } else if (operation.type === "push") {
        operation.values.forEach((value) => {
          newStack.push(value);
        });
      }
    });

    setStack(newStack);
    setPoppedValues(newPoppedValues);

    return newStack.stack;
  };

  const TOTAL_TIME = 60;
  const handleTimeUpdate = (timeLeft) => {
    setTimeTaken(TOTAL_TIME - timeLeft);
  };

  const calculatePoints = (timeTaken) => {
    return TOTAL_TIME - timeTaken;
  };

  const handleCheck = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/check_answer", {
        user_answer: userAnswer,
        popped_values: poppedValues,
      });

      const { result, is_correct } = response.data;

      setCheckResult(result);
      if (is_correct) {
        setFirstLevelCompleted(true);
        setCelebrate(true);
        setTryAgain(false);
        setTimerActive(false);
        const earnedPoints = calculatePoints(timeTaken);
        setPoints(earnedPoints);

        const handleLevelCompletion = async (earnedPoints) => {
          if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            if (typeof earnedPoints !== "undefined") {
              const userDocSnap = await getDoc(userDocRef);
              const userData = userDocSnap.data();
              const updatedCompletedLevels = {
                ...userData.completedLevels,
                FirstLevel: true,
              };
              const updatedPoints = {
                ...userData.Points,
                points: (userData.Points?.points || 0) + earnedPoints,
              };

              await updateDoc(userDocRef, {
                completedLevels: updatedCompletedLevels,
                Points: updatedPoints,
              });
            }
          }
        };

        handleLevelCompletion(earnedPoints);
      } else {
        setCelebrate(false);
        setTryAgain(true);
      }
      setTimeout(() => {
        setTryAgain(false);
      }, 500);
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  const handleManualCountChange = (e) => {
    setManualElementCount(parseInt(e.target.value));
  };

  const handlePromptResponse = (response) => {
    if (response === "random") {
      setRandomizeElements(true);
    } else {
      setRandomizeElements(false);
      setManualElementCount(0); // Reset manual count when switching to manual input
    }
  };

  return (
    <div className="all-div">
      <AlgoLingoBar />
      <div className="other">
        <h1 className="title-styling">Stack</h1>
        <h2 className="title-styling">First Level</h2>
        <div className="queue-navbar-line"></div>
        <div className="prompt-container">
          <h3>Do you want the number of elements in the stack to be randomized or manually entered?</h3>
          <button
            className="stack-level-first-game-buttons"
            onClick={() => handlePromptResponse("random")}
          >
            Randomize
          </button>
          <button
            className="stack-level-first-game-buttons"
            onClick={() => handlePromptResponse("manual")}
          >
            Manual
          </button>
          {randomizeElements === false && (
            <div>
              <h3>Enter the number of elements you want to play with (max 7):</h3>
              <input
                type="number"
                placeholder="Number of elements"
                min="1"
                max="7"
                step="1"
                value={manualElementCount}
                onChange={handleManualCountChange}
                className="input-class"
              />
              <button
                className="stack-level-first-game-buttons"
                onClick={() => setRandomizeElements(false)}
              >
                Start
              </button>
            </div>
          )}
        </div>
        <LevelsBar
          pushClicked={true}
          popClicked={true}
          peekClicked={true}
          isEmptyClicked={true}
          checkResult={firstLevelCompleted ? "Great!" : ""}
        />
        <br></br>
        <div className="second-level-container">
          <div className="bucket-container">
            <div className="arrow push-arrow">
              <div className="arrow-up"></div>
              <div>Push</div>
            </div>
            <div className="bucket" align="center">
              <div className="popped-values">
                {[...poppedValues].reverse().map((value, index) => (
                  <div key={`popped-${index}`} className="popped-value">
                    {value}
                  </div>
                ))}
              </div>
              {[...stack.stack].reverse().map((value, index) => (
                <div key={index} className="stack-value">
                  {value}
                </div>
              ))}
            </div>
            <div className="arrow pop-arrow">
              <div>Pop</div>
              <div className="arrow-down"></div>
            </div>
          </div>
          <div className="question">
            <h3>What will be the last popped value after</h3>
            <p>{questionText}</p>
            <input
              type="number"
              placeholder="Enter your answer"
              min="0"
              step="1"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="input-class"
            />
            {checkResult && <p>{checkResult}</p>}
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
          <p>Points earned: {calculatePoints(timeTaken)}</p>
        </div>
      </div>
    </div>
  );
}

export default FirstLevel;
