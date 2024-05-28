import React, { useState, useEffect } from "react";
import "./ThirdLevel.css";
import StackImplementation from "./StackImplementation"; // Import the StackImplementation class
import LevelsBar from "./LevelBar"; // Import the LevelsBar component
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import Celebration from "../Celebration/Celebration";
import TryAgainAnimation from "../TryAgainAnimation/TryAgain";

function ThirdLevel() {
  const [stack, setStack] = useState(new StackImplementation()); // Initialize stack using StackImplementation
  const [poppedShapes, setPoppedShapes] = useState([]);
  const [questionText, setQuestionText] = useState(""); // State to hold question text
  const [operations, setOperations] = useState([]); // State to hold the generated operations
  const [userAnswer, setUserAnswer] = useState(""); // State to hold user's answer
  const [checkResult3, setcheckResult3] = useState("");
  const [thirdLevelCompleted, setThirdLevelCompleted] = useState(false); // State to track third level completion
  const [fadeOut, setFadeOut] = useState(false); // State to control fade-out effect
  const [celebrate, setCelebrate] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);

  // Function to generate random shapes for the stack and set question text
  const generateRandomShapes = () => {
    const newStack = new StackImplementation(); // Create a new stack instance

    const shapes = ["triangle", "square", "rectangle", "octagon"];

    const newStackShapes = [];
    const selectedShapes = new Set(); // Use a set to ensure uniqueness of shapes

    // Select one shape of each type randomly
    while (selectedShapes.size < shapes.length) {
      const randomIndex = Math.floor(Math.random() * shapes.length);
      selectedShapes.add(shapes[randomIndex]);
    }

    // Convert set to array
    selectedShapes.forEach((shape) => newStackShapes.push(shape));

    // Shuffle the selected shapes
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

    // Pop random number of shapes (between 1 to 3)
    const numberOfShapesToPop = Math.floor(Math.random() * 3) + 1;
    newOperations.push({ type: "pop", count: numberOfShapesToPop });

    setOperations(newOperations);
    setStack(newStack); // Update the stack state with the new stack instance
    setQuestionText(generateQuestion(newStackShapes, numberOfShapesToPop));
  };

  // Function to generate a random question
  const generateQuestion = (stackShapes, popCount) => {
    const questionArray = [];

    // Push operation for the first sentence
    if (stackShapes.length === 1) {
      questionArray.push(`Push the shape ${stackShapes[0]}`);
    } else {
      questionArray.push(
        `Push the shapes ${stackShapes
          .slice(0, -1)
          .join(", ")} and ${stackShapes.slice(-1)}`
      );
    }

    // Pop operation for the second sentence
    if (popCount === 1) {
      questionArray.push(`then pop ${popCount} shape`);
    } else {
      questionArray.push(`then pop ${popCount} shapes`);
    }

    // Combine the questions
    const question = questionArray.join(", ");

    return question;
  };

  useEffect(() => {
    generateRandomShapes();
  }, []);

  // Apply operations to get the final state of the stack and popped shapes
  const applyOperationAndGetStack = (operations) => {
    let newStack = new StackImplementation(); // Create a new stack instance
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
  }, [operations]); // Only trigger the effect when the 'operations' state changes

  // Function to handle clicking the "Check" button
  const handleCheck = () => {
    const lastPoppedShape = poppedShapes[poppedShapes.length - 1];
    if (userAnswer === lastPoppedShape) {
      setcheckResult3("Great!");
      setThirdLevelCompleted(true);
      setFadeOut(true);
      setCelebrate(true);
      setTryAgain(false);
    } else {
      setcheckResult3("Incorrect");
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
        <h1 className="title-styling">Stack</h1>
        <h2 className="title-styling">Third Level</h2>
        {/* Render LevelsBar component */}
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
          <button className="check-button" onClick={handleCheck}>
            Check
          </button>
          <Celebration active={celebrate} />
          <TryAgainAnimation active={tryAgain} />
        </div>
      </div>
    </div>
  );
}

export default ThirdLevel;
