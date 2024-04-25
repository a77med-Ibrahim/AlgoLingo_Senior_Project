import React, { useState, useEffect } from "react";
import "./SecondLevel.css";
import StackImplementation from "./StackImplementation"; // Import the StackImplementation class
import LevelsBar from "./LevelBar"; // Import the LevelsBar component
import AlgoLingoBar from "../Menu/AlgoLingoBar";

function FirstLevel() {
  const [stack, setStack] = useState(new StackImplementation()); // Initialize stack using StackImplementation
  const [poppedValues, setPoppedValues] = useState([]);
  const [questionText, setQuestionText] = useState(""); // State to hold question text
  const [operations, setOperations] = useState([]); // State to hold the generated operations
  const [userAnswer, setUserAnswer] = useState(""); // State to hold user's answer
  const [checkResult, setCheckResult] = useState(""); // State to hold check result

  // Function to generate random values for the stack bar and set question text
  const generateRandomValues = () => {
    const numberOfFieldsDynamic = Math.floor(Math.random() * 9) + 1; // Random number between 1 and 9
    const newStackValues = Array.from(
      { length: numberOfFieldsDynamic },
      (_, i) => Math.floor(Math.random() * 100)
    ); // Generate random values
<LevelsBar
            activeButtonIndex={activeButtonIndex}
            handleButtonClick={handleButtonClick}
            pushClicked={true} // Assuming the first button is always unlocked in the first level
            popClicked={true} // Assuming the second button is always unlocked in the first level
            peekClicked={true} // Assuming the third button is always unlocked in the first level
            isEmptyClicked={true} // Assuming the fourth button is always unlocked in the first level
          />
    const newOperations = [];

    // Push up to four random values onto the stack
    const numberOfValuesToPush = Math.min(
      Math.floor(Math.random() * 4) + 1,
      newStackValues.length
    );
    const valuesToPush = newStackValues.slice(0, numberOfValuesToPush);

    // Push each value onto the stack
    valuesToPush.forEach((value) => {
      stack.push(value);
      newOperations.push({ type: "push", values: [value] });
    });

    // Calculate the remaining capacity of the stack after push operations
    const remainingCapacity = stack.stack.length - valuesToPush.length;

    // Generate a random pop operation with a count greater than or equal to 1 and less than or equal to the remaining capacity,

    const popCount = Math.min(
      Math.floor(Math.random() * Math.min(remainingCapacity, 5)) + 1,
      remainingCapacity
    );
    newOperations.push({ type: "pop", count: popCount });

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
    const question = questionArray.join(" and then ");

    return question;
  };

  useEffect(() => {
    generateRandomValues();
  }, []);

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
      setCheckResult("Great!");
    } else {
      // If incorrect, set check result to "Failed"
      setCheckResult("Failed");
    }
  };

  return (
    <div className="all-div">
      <AlgoLingoBar />
      <div className="game-content">
        <h1 className="title">Stack</h1>
        <h2 className="title">First Level</h2>

        <div className="second-level-container">
          <div className="stack-bar">
            {/* Render popped values first */}
            {poppedValues.map((value, index) => (
              <div key={`popped-${index}`} className="pushed-stack-field">
                {value}
              </div>
            ))}
            {/* Render stack values */}
            {[...stack.stack].reverse().map((value, index) => (
              <div key={index} className="stack-field">
                {value}
              </div>
            ))}
          </div>
          <div className="question">
            {/* Display the question */}
            <h2>{questionText}</h2>
            <h3>What will be the last popped value?</h3>
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

export default SecondLevel;
