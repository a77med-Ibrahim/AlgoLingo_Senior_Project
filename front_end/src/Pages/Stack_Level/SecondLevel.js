import React, { useState, useEffect } from "react";
import "./SecondLevel.css";
import StackImplementation from "./StackImplementation"; // Import the StackImplementation class
import LevelsBar from "./LevelBar"; // Import the LevelsBar component
import AlgoLingoBar from "../Menu/AlgoLingoBar";

function SecondLevel() {
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [stack, setStack] = useState(new StackImplementation()); // Initialize stack using StackImplementation
  const [poppedValues, setPoppedValues] = useState([]);
  const [questionText, setQuestionText] = useState(""); // State to hold question text
  const [operations, setOperations] = useState([]); // State to hold the generated operations
  const [userAnswer, setUserAnswer] = useState(""); // State to hold user's answer
  const [checkResult, setCheckResult] = useState("");
  const [checkResult2, setCheckResult2] = useState("");
  const [SecondLevelCompleted, setSecondLevelCompleted] = useState(false); // State to track first level completion

  // Function to generate random values for the stack bar and set question text
  const generateRandomValues = () => {
    const newStack = new StackImplementation(); // Create a new stack instance
    const initialStackValues = Array.from(
      { length: 2 }, // Initial values length
      () => Math.floor(Math.random() * 100)
    ); // Generate random initial values

    // Push initial random values onto the stack
    initialStackValues.forEach((value) => newStack.push(value));

    const numberOfFieldsDynamic = Math.floor(Math.random() * 5) + 3; // Random number between 1 and 5 for additional push values
    const newStackValues = Array.from(
      { length: numberOfFieldsDynamic },
      () => Math.floor(Math.random() * 100)
    ); // Generate random values

    const newOperations = [];

    // Push up to three random values onto the stack
    const numberOfValuesToPush = Math.min(
      Math.floor(Math.random() * 7) + 4,
      newStackValues.length
    );
    const valuesToPush = newStackValues.slice(0, numberOfValuesToPush);

    // Push each value onto the stack
    valuesToPush.forEach((value) => {
      newStack.push(value);
      newOperations.push({ type: "push", values: [value] });
    });

    // Calculate the remaining capacity of the stack after push operations
    const remainingCapacity = newStack.stack.length;

    // Generate a random pop operation with a count greater than or equal to 1 and less than or equal to the remaining capacity,
    const popCount = Math.min(
      Math.floor(Math.random() * Math.min(remainingCapacity, 3)) + 1,
      remainingCapacity
    );
    newOperations.push({ type: "pop", count: popCount });

    setStack(newStack); // Update the stack state with the new stack instance
    setQuestionText(generateQuestion(valuesToPush, popCount));
    setOperations(newOperations);
  };

  // Function to generate a random question
  const generateQuestion = (stackValues, popCount) => {
    const questionArray = [];

    // Push operation for the first sentence
    questionArray.push(`Push ${stackValues.join(", ")}`);

    // Pop operation for the second sentence
    questionArray.push(`Pop ${popCount} values`);

    // Combine the questions
    const question = questionArray.join(" AND ");

    return question;
  };

  useEffect(() => {
    generateRandomValues();
  }, []);

  // Function to handle clicking on a button
  const handleButtonClick = (index) => {
    setActiveButtonIndex(index);
  };

  // Log the generated stack and the stack after the operation is applied to the console
  useEffect(() => {
    console.log(applyOperationAndGetStack(stack.stack));
  }, [operations]); // Only trigger the effect when the 'operations' state changes

  const applyOperationAndGetStack = (currentStack) => {
    let newStack = new StackImplementation(); // Create a new stack instance

    // Copy the current stack elements to the new stack
    currentStack.forEach((value) => {
      newStack.push(value);
    });

    let newPoppedValues = []; // Initialize an empty array for new popped values

    // Apply the operations
    operations.forEach((operation) => {
      if (operation.type === "pop") {
        for (let i = 0; i < operation.count; i++) {
          if (!newStack.isEmpty()) {
            // Remove the last value from the stack and add it to the poppedValues array
            newPoppedValues.push(newStack.pop());
          }
        }
      } else if (operation.type === "push") {
        operation.values.forEach((value) => {
          newStack.push(value);
        });
      }
    });

    // Update the stack state with the new stack instance
    setStack(newStack);

    // Update the poppedValues state with the newPoppedValues array
    setPoppedValues(newPoppedValues);

    // Return the new stack after applying the operations
    return newStack.stack;
  };

  // Function to handle clicking the "Check" button
  const handleCheck = () => {
    // Convert the user's answer to a number
    const userAnswerNum = parseInt(userAnswer);

    // Get the last popped value from the poppedValues array
    const lastPoppedValue = poppedValues[poppedValues.length - 1];

    // Check if the user's answer matches the last popped value
    if (userAnswerNum === lastPoppedValue) {
      // If correct, set check result to "Great!"
      setCheckResult2("Great!");
      setSecondLevelCompleted(true);
    } else {
      // If incorrect, set check result to "Failed"
      setCheckResult2("Failed");
    }
  };

  // Function to handle clicking the pop arrow (button)
  const handlePopArrowClick = () => {
    // Trigger fade-out effect for popped values
    document.querySelector(".popped-values").classList.add("fade-out");
  };

  return (
    <div className="all-div">
      <AlgoLingoBar />
      <div className="other">
        <h1 className="title-styling">Stack</h1>
        <h2 className="title-styling">First Level</h2>
        {/* Render LevelsBar component */}
        <LevelsBar
          pushClicked={true} // Assuming the first button is always unlocked in the first level
          popClicked={true} // Assuming the second button is always unlocked in the first level
          peekClicked={true} // Assuming the third button is always unlocked in the first level
          isEmptyClicked={true} // Assuming the fourth button is always unlocked in the first level
          checkResult={"Great!"}
          checkResult2={SecondLevelCompleted ? "Great!" : ""}

        />
        <br />
        <div className="second-level-container">
          <div className="bucket-container">
          <div className="arrow push-arrow">
              <div className="arrow-up"></div>
              <div>Push</div>
            </div>
            <div className="bucket" align="center">
              {/* Render popped values */}
              <div className="popped-values">
                {[...poppedValues].reverse().map((value, index) => (
                  <div key={`popped-${index}`} className="popped-value">
                    {value}
                  </div>
                ))}
              </div>
              {/* Render stack values */}
              {[...stack.stack].reverse().map((value, index) => (
                <div key={index} className="stack-value">
                  {value}
                </div>
              ))}
            </div>
            {/* Right arrow pointing down for pop */}
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
          <button className="check-button" onClick={handleCheck}>
            Check
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecondLevel;

