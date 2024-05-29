import React, { useState, useEffect } from "react";
import "./SecondLevel.css";
import StackImplementation from "./StackImplementation";
import LevelsBar from "./LevelBar";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import TryAgainAnimation from "../TryAgainAnimation/TryAgain";
import Celebration from "../Celebration/Celebration";
import Timer from "../Menu/Timer";
import { useAuth } from "../Menu/AuthContext";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../Menu/firebaseConfig";


function SecondLevel() {
  const { currentUser } = useAuth();
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [stack, setStack] = useState(new StackImplementation());
  const [poppedValues, setPoppedValues] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [operations, setOperations] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [checkResult2, setCheckResult2] = useState("");
  const [secondLevelCompleted, setSecondLevelCompleted] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [timeTaken, setTimeTaken] = useState(0);
  const [points2, setPoints2] = useState(0);

  const generateRandomValues = () => {
    const newStack = new StackImplementation();
    const initialStackValues = Array.from({ length: 2 }, () =>
      Math.floor(Math.random() * 100)
    );

    initialStackValues.forEach((value) => newStack.push(value));

    const numberOfFieldsDynamic = Math.floor(Math.random() * 5) + 3; // Random number between 1 and 5 for additional push values
    const newStackValues = Array.from({ length: numberOfFieldsDynamic }, () =>
      Math.floor(Math.random() * 100)
    ); // Generate random values

    const newOperations = [];

    const numberOfValuesToPush = Math.min(
      Math.floor(Math.random() * 7) + 4,
      newStackValues.length
    );
    const valuesToPush = newStackValues.slice(0, numberOfValuesToPush);

    valuesToPush.forEach((value) => {
      newStack.push(value);
      newOperations.push({ type: "push", values: [value] });
    });

    const remainingCapacity = newStack.stack.length;

    const popCount = Math.min(
      Math.floor(Math.random() * Math.min(remainingCapacity, 3)) + 1,
      remainingCapacity
    );
    newOperations.push({ type: "pop", count: popCount });

    setStack(newStack);
    setQuestionText(generateQuestion(valuesToPush, popCount));
    setOperations(newOperations);
  };

  const generateQuestion = (stackValues, popCount) => {
    const questionArray = [];

    questionArray.push(`Push ${stackValues.join(", ")}`);

    questionArray.push(`Pop ${popCount} values`);

    const question = questionArray.join(" AND ");

    return question;
  };

  useEffect(() => {
    generateRandomValues();
  }, []);

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
  const userAnswerNum = parseInt(userAnswer);
  const lastPoppedValue = poppedValues[poppedValues.length - 1];

  if (userAnswerNum === lastPoppedValue) {
    setCheckResult2("Great!");
    setSecondLevelCompleted(true);
    setCelebrate(true);
    setTryAgain(false);
    const earnedPoints = calculatePoints(timeTaken);
    setPoints2(earnedPoints); 
    
    const handleLevelCompletion = async (earnedPoints) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        if (typeof earnedPoints !== 'undefined') {
          const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      const updatedCompletedLevels = {
        ...userData.completedLevels,
        SecondLevel: true, 
      };
      const updatedPoints = {
        ...userData.Points,
        points2:earnedPoints,
      }


      await updateDoc(userDocRef, {
        completedLevels: updatedCompletedLevels,
        Points : updatedPoints,
        
      });
        }
      }
    };
     
    handleLevelCompletion(earnedPoints);
    
  } else {
    setCheckResult2("Failed");
    setSecondLevelCompleted(false);
    setCelebrate(false);
    setTryAgain(true);
  }
  setTimeout(() => {
    setTryAgain(false);
  }, 500);
};


  const handlePopArrowClick = () => {
    document.querySelector(".popped-values").classList.add("fade-out");
  };

  return (
    <div className="all-div">
      <AlgoLingoBar />
      <div className="other">
        <h1 className="title-styling">Stack</h1>

        <h2 className="title-styling">First Level</h2>

        <LevelsBar
          pushClicked={true}
          popClicked={true}
          peekClicked={true}
          isEmptyClicked={true}
          checkResult={"Great!"}
          checkResult2={secondLevelCompleted ? "Great!" : ""}
        />
        <br />
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

            <button className="arrow pop-arrow" onClick={handlePopArrowClick}>
              <div>Pop</div>
              <div className="arrow-down"></div>
            </button>
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
            {/* Display check result */}
            {checkResult2 && <p>{checkResult2}</p>}
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
        <Timer isActive={timerActive} onTimeUpdate={handleTimeUpdate} totalTime={TOTAL_TIME} />
<div>
  <p>Points earned: {calculatePoints(timeTaken)}</p>
</div>
      </div>
    </div>
  );
}

export default SecondLevel;
