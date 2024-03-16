import React, { useState, useEffect } from "react";
import "./FirstLevel.css";

function FirstLevel() {
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [stackValues, setStackValues] = useState([]);
  const [poppedValues, setPoppedValues] = useState([]);
  const [questionText, setQuestionText] = useState(""); // State to hold question text

  // Function to generate random values for the stack bar and set question text
  const generateRandomValues = () => {
    const numberOfFieldsDynamic = Math.floor(Math.random() * 9) + 1; // Random number between 1 and 9
    const newStackValues = Array.from(
      { length: numberOfFieldsDynamic },
      (_, i) => Math.floor(Math.random() * 100)
    ); // Generate random values
    setStackValues(newStackValues);

    // Generate question after setting stack values
    setQuestionText(generateQuestion(newStackValues));
  };

  // Function to generate a random question
  const generateQuestion = (stackValues) => {
    const pushOrPop = Math.round(Math.random());
    let question = "";

    if (pushOrPop === 0) {
      // Pop operation
      const popCount = Math.floor(Math.random() * stackValues.length);
      question = `Pop ${popCount} values from the stack bar`;
    } else {
      // Push operation
      const numberOfValues = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
      const values = Array.from(
        { length: numberOfValues },
        () => Math.floor(Math.random() * 100) + 1
      ); // Generate random values

      // Format the string for the visible text
      question = `Push ${values.join(", ")}`;
    }

    return question;
  };

  useEffect(() => {
    // Generate new stack values and question text when the component mounts or refreshes
    generateRandomValues();
  }, []); // Empty dependency array ensures it only runs once on mount

  // Function to handle clicking on a button
  const handleButtonClick = (index) => {
    setActiveButtonIndex(index);
  };

  // Function to render buttons
  const renderButtons = () => {
    return [1, 2, 3, 4, 5].map((number, index) => (
      <button
        key={index}
        className="button"
        style={{ backgroundColor: getButtonColor(index) }}
        onClick={() => handleButtonClick(index)}
      >
        {number}
      </button>
    ));
  };

  // Function to determine button color based on active state
  const getButtonColor = (index) => {
    return index === activeButtonIndex ? "#e74c3c" : "#3498db";
  };

  return (
    <div>
      <h1 className="title-styling">Stack</h1>
      <h2>Levels</h2>
      {/* Levels bar*/}
      <div className="button-bar">{renderButtons()}</div>

      {/* Existing stack bar */}
      <h2>Stack Bar:</h2>
      <div className="stack-bar">
        {stackValues.map((value, index) => (
          <div key={index} className="stack-field">
            {value}
          </div>
        ))}
        {poppedValues.map((value, index) => (
          <div key={`popped-${index}`} className="stack-field popped">
            {value}
          </div>
        ))}
      </div>

      {/* The Question */}
      <h2>What will be the last popped value after</h2>

      {/* Text field to display random data */}
      <div>
        <p>{questionText} </p>
      </div>
    </div>
  );
}

export default FirstLevel;
