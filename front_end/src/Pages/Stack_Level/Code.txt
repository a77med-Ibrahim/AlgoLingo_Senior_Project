import React, { useState, useEffect } from "react";
import "./FirstLevel.css";

function FirstLevel() {
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [stackValues, setStackValues] = useState([]);

  // Function to generate random values for the stack bar
  const generateRandomValues = () => {
    const numberOfFieldsDynamic = Math.floor(Math.random() * 9) + 1; // Random number between 1 and 9
    const newStackValues = Array.from(
      { length: numberOfFieldsDynamic },
      (_, i) => Math.floor(Math.random() * 100)
    ); // Generate random values
    setStackValues(newStackValues);
  };

  useEffect(() => {
    // Initialize stack values when the component mounts
    generateRandomValues();
  }, []); // Empty dependency array ensures it only runs once on mount

  const handleButtonClick = (index) => {
    setActiveButtonIndex(index);
  };

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

  const getButtonColor = (index) => {
    return index === activeButtonIndex ? "#e74c3c" : "#3498db";
  };

  const Question = () => {
    const pushOrPop = Math.round(Math.random());
    let popCount = 0;

    if (pushOrPop === 0) {
      // Pop operation
      popCount = Math.floor(Math.random() * stackValues.length);
      return `Pop ${popCount} values from the stack bar`;
    } else {
      // Push operation
      const numberOfValues = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3
      const values = Array.from(
        { length: numberOfValues },
        () => Math.floor(Math.random() * 100) + 1
      ); // Generate random values

      // Format the string for the visible text
      const pushText = `Push ${values.join(", ")}`;

      return pushText;
    }
  };

  return (
    <div>
      <h1 className="title-styling">Stacks</h1>

      {/* Levels bar*/}
      <div className="button-bar">{renderButtons()}</div>

      {/* Existing stack bar */}
      <div className="stack-bar">
        {stackValues.map((value, index) => (
          <div key={index} className="stack-field">
            {value}
          </div>
        ))}
      </div>

      {/* The Question */}
      <h2>What will be the last popped value..</h2>

      {/* Text field to display random data */}
      <div>
        <p>{Question()} </p>
      </div>
    </div>
  );
}

export default FirstLevel;
