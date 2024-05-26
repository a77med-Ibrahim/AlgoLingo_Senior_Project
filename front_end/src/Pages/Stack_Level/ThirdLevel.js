import React, { useState, useEffect } from "react";
import "./ThirdLevel.css";
import StackImplementation from "./StackImplementation"; // Import the StackImplementation class
import LevelsBar from "./LevelBar"; // Import the LevelsBar component
import AlgoLingoBar from "../Menu/AlgoLingoBar";

function ThirdLevel() {
  const [stack, setStack] = useState(new StackImplementation()); // Initialize stack using StackImplementation
  const [poppedShapes, setPoppedShapes] = useState([]);
  const [questionText, setQuestionText] = useState(""); // State to hold question text
  const [operations, setOperations] = useState([]); // State to hold the generated operations
  const [userAnswer, setUserAnswer] = useState(""); // State to hold user's answer
  const [checkResult, setCheckResult] = useState("");
  const [thirdLevelCompleted, setThirdLevelCompleted] = useState(false); // State to track third level completion

  // Function to generate random shapes for the stack and set question text
  const generateRandomShapes = () => {
    const newStack = new StackImplementation(); // Create a new stack instance

    const shapes = ["circle", "triangle", "square", "rectangle", "octagon"];

    const initialStackShapes = shapes.slice(0, 2); // Initial shapes
    initialStackShapes.forEach((shape) => newStack.push(shape));

    const numberOfShapes = Math.floor(Math.random() * 5) + 3; // Random number between 3 and 7 for additional push shapes
    const newStackShapes = shapes.slice(2, numberOfShapes + 2); // Generate random shapes

    const newOperations = [];

    newStackShapes.forEach((shape) => {
      newStack.push(shape);
      newOperations.push({ type: "push", shape });
    });

    const remainingCapacity = newStack.stack.length;
    const popCount = Math.min(Math.floor(Math.random() * Math.min(remainingCapacity, 3)) + 1, remainingCapacity);
    newOperations.push({ type: "pop", count: popCount });

    setStack(newStack); // Update the stack state with the new stack instance
    setQuestionText(generateQuestion(newStackShapes, popCount));
    setOperations(newOperations);
  };

  // Function to generate a random question
  const generateQuestion = (stackShapes, popCount) => {
    return `Push ${stackShapes.join(", ")} AND Pop ${popCount} shapes`;
  };

  useEffect(() => {
    generateRandomShapes();
  }, []);

  // Log the generated stack and the stack after the operation is applied to the console
  useEffect(() => {
    console.log(applyOperationAndGetStack(stack.stack));
  }, [operations]); // Only trigger the effect when the 'operations' state changes

  const applyOperationAndGetStack = (currentStack) => {
    let newStack = new StackImplementation(); // Create a new stack instance

    currentStack.forEach((shape) => {
      newStack.push(shape);
    });

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

    setStack(newStack);
    setPoppedShapes(newPoppedShapes);

    return newStack.stack;
  };

  // Function to handle clicking the "Check" button
  const handleCheck = () => {
    const lastPoppedShape = poppedShapes[poppedShapes.length - 1];
    if (userAnswer === lastPoppedShape) {
      setCheckResult("Great!");
      setThirdLevelCompleted(true);
    } else {
      setCheckResult("Failed");
    }
  };

  return (
    <div className="all-div">
      <AlgoLingoBar />
      <div className="other">
        <h1 className="title-styling">Stack</h1>
        <h2 className="title-styling">Third Level</h2>
        {/* Render LevelsBar component */}
        <LevelsBar
          pushClicked={true}
          popClicked={true}
          peekClicked={true}
          isEmptyClicked={true}
          checkResult={thirdLevelCompleted ? "Great!" : ""}
        />
        <br></br>
        <div className="third-level-container">
          <div className="shapes-container">
            <div className="shapes">
              {[...poppedShapes].reverse().map((shape, index) => (
                <div key={`popped-${index}`} className={`shape ${shape}`}></div>
              ))}
            </div>
            <div className="stack">
              {[...stack.stack].reverse().map((shape, index) => (
                <div key={index} className={`shape ${shape}`}></div>
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
            {checkResult && <p>{checkResult}</p>}
          </div>
          <button className="check-button" onClick={handleCheck}>
            Check
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThirdLevel;
