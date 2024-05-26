import React, { useState, useEffect } from "react";
import "./SecondLevel.css";
import StackImplementation from "./StackImplementation";
import LevelsBar from "./LevelBar";
import AlgoLingoBar from "../Menu/AlgoLingoBar";

function SecondLevel() {
  const [stack, setStack] = useState(new StackImplementation());
  const [poppedValues, setPoppedValues] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [checkResult, setCheckResult] = useState("");

  useEffect(() => {
    // Generate 2-3 random numbers and push them onto the stack initially
    const initialPushCount = Math.floor(Math.random() * 2) + 2;
    const initialStackValues = Array.from({ length: initialPushCount }, () =>
      Math.floor(Math.random() * 100)
    );
    initialStackValues.forEach((value) => stack.push(value));

    // Automatically pop 2-3 numbers from the stack
    const popCount = Math.floor(Math.random() * 2) + 2;
    const popped = [];
    for (let i = 0; i < popCount; i++) {
      popped.push(stack.pop());
    }
    setPoppedValues(popped);

    // Set the stack initially
    setStack(stack);

    // Generate the initial question text
    const initialQuestionText = `Initial stack: [${initialStackValues.join(", ")}]`;
    setQuestionText(initialQuestionText);
  }, []);

  // Function to handle checking user's answer
  const handleCheck = () => {
    const userAnswerNum = parseInt(userAnswer);
    const firstPoppedValue = poppedValues[0]; // Change here

    if (userAnswerNum === firstPoppedValue) { // Change here
      setCheckResult("Great!");
    } else {
      setCheckResult("Failed");
    }
  };

  return (
    <div className="all-div">
      <AlgoLingoBar />
      <div className="other">
        <h1 className="title-styling">Stack</h1>
        <h2 className="title-styling">Second Level</h2>
        {/* Render LevelsBar component */}
        <LevelsBar
          pushClicked={false}
          popClicked={false}
          peekClicked={false}
          isEmptyClicked={false}
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
                {poppedValues.map((value, index) => (
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
            <div className="arrow pop-arrow">
              <div className="arrow-down"></div>
              <div>Pop</div>
            </div>
          </div>
          <div className="question">
            <h3>Which number will be popped first?</h3>
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
