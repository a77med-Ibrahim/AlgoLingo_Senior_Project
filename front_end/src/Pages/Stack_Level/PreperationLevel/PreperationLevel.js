import React, { useState } from "react";
import "./PreperationLevel.css";
import { useNavigate } from "react-router-dom";
import LevelsBar from "../LevelBar";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";

let boxCount = 0;

function PreperationLevel() {
  const navigate = useNavigate();

  const [isEmpty, setIsEmpty] = useState(null); // State to track whether the stack is empty
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [pushClicked, setPushClicked] = useState(false);
  const [popClicked, setPopClicked] = useState(false);
  const [peekClicked, setPeekClicked] = useState(false);
  const [isEmptyClicked, setIsEmptyClicked] = useState(false);

  const handleButtonClick = (index) => {
    setActiveButtonIndex(index);
    if (index === 0) {
      navigate("/preperation-level");
    }
  };

  const handleButtonClickOnce = (type) => {
    switch (type) {
      case "push":
        setPushClicked(true);
        break;
      case "pop":
        setPopClicked(true);
        break;
      case "peek":
        setPeekClicked(true);
        break;
      case "isEmpty":
        setIsEmptyClicked(true);
        break;
      default:
        break;
    }
  };

  // let boxCount = 0;
  let showNumbers = false;
  let popInProgress = false; // Flag to track if a pop operation is in progress

  //Hover Handling for Push
  function pushHandleHover() {
    document.querySelector(".code-bar h1").innerText = "Push";
    document.querySelector(".code-bar h2").innerText =
      "push(value) {this.stack.push(value);}";
    document.querySelector(".code-bar p").innerText =
      "Function takes (value) entered by user and uses (this.stack.push) to push value into the stack";
  }

  function pushOnClick() {
    // Check if the maximum number of boxes has been reached
    if (boxCount >= 6) {
      return; // Exit the function if the limit is reached
    }

    // Create a new box element
    const box = document.createElement("div");
    box.className = "box";

    // Create and append a span element for the box number
    const boxNumber = document.createElement("span");
    boxNumber.className = "box-number";
    boxNumber.textContent = boxCount + 1;
    box.appendChild(boxNumber);

    // Set the opacity of the box number based on the showNumbers flag
    if (!showNumbers) {
      boxNumber.style.opacity = "0"; // Hide the number if showNumbers is false
    }

    // Append the box to the container
    document.querySelector(".rectangle").appendChild(box);

    // Calculate the translateY value based on boxCount
    const translateYValue = 660 - (70 + 3) * boxCount;

    // Animate the box dropping
    setTimeout(() => {
      box.style.transform = `translateY(${translateYValue}px)`;
    }, 50);

    // Increment boxCount for the next box
    boxCount++;
  }

  //Hover Handling for Pop
  function popHandleHover() {
    document.querySelector(".code-bar h1").innerText = "Pop";
    document.querySelector(".code-bar h2").innerText =
      "pop() {if (this.isEmpty()) {return null;}return this.stack.pop();}";
    document.querySelector(".code-bar p").innerText =
      "Fucntion firstly checks if the stack is empty or not using (isEmpty) function, if isEmpty=='true' don't do anything, else pops the last entered value ";
  }

  function popOnClick() {
    // Check if a pop operation is already in progress
    if (popInProgress) {
      return; // Exit the function if a pop operation is already in progress
    }

    // Check if there are any boxes to pop
    if (boxCount <= 0) {
      return; // Exit the function if there are no boxes
    }

    // Set the flag to indicate that a pop operation is in progress
    popInProgress = true;

    // Select the last box element
    const lastBox = document.querySelector(".rectangle .box:last-child");

    // Calculate the translateY value to move the box out of the viewport
    const translateYValue = -70; // Move the box up by its height

    // Animate the box moving out of the viewport
    lastBox.style.transition = "transform 0.5s ease-in-out";
    lastBox.style.transform = `translateY(${translateYValue}px)`;

    // Remove the box after the animation completes
    setTimeout(() => {
      lastBox.remove();

      // Decrement boxCount
      boxCount--;

      // Reset the flag after the animation completes
      popInProgress = false;
    }, 500); // Wait for the transition duration
  }

  //Hover Handling for Peek
  function peekHandleHover() {
    document.querySelector(".code-bar h1").innerText = "Peek";
    document.querySelector(".code-bar h2").innerText =
      " peek() {return null;}return this.stack[this.stack.length - 1];}";
    document.querySelector(".code-bar p").innerText = "Description about Peek";
  }
  function peekOnClick() {
    showNumbers = true; // Set the flag to show box numbers

    // Select all box numbers and set their opacity to 1
    const boxNumbers = document.querySelectorAll(".box-number");
    boxNumbers.forEach((number) => {
      number.style.opacity = "1";
    });
  }

  //Hover Handling for isEmpty
  function isEmptyHandleHover() {
    document.querySelector(".code-bar h1").innerText = "isEmpty";
    document.querySelector(".code-bar h2").innerText =
      "isEmpty() {return this.stack.length === 0;}";
    document.querySelector(".code-bar p").innerText =
      "Function checks if the stack is = to 0 it returns True, if stack.length>=1 return False ";
  }

  function isEmptyOnClick() {
    const empty = boxCount === 0;
    const result = empty ? "True" : "False";
    setIsEmpty(result);
  }

  return (
    <div className="all-div">
      <AlgoLingoBar />
      <div className="game-content">
        <h1 className="title">Stack</h1>
        <h2 className="title">Preparation</h2>

        <LevelsBar
          activeButtonIndex={activeButtonIndex}
          handleButtonClick={handleButtonClick}
          pushClicked={pushClicked}
          popClicked={popClicked}
          peekClicked={peekClicked}
          isEmptyClicked={isEmptyClicked}
        />

        <div className="prep-level-container">
          <div className="button-group">
            <button
              className="prep-level-buttons"
              onMouseEnter={pushHandleHover}
              onClick={() => {
                pushOnClick();
                handleButtonClickOnce("push");
              }}
            >
              Push
            </button>
            <button
              className="prep-level-buttons"
              onMouseEnter={popHandleHover}
              onClick={() => {
                popOnClick();
                handleButtonClickOnce("pop");
              }}
            >
              Pop
            </button>
            <button
              className="prep-level-buttons"
              onMouseEnter={peekHandleHover}
              onClick={() => {
                peekOnClick();
                handleButtonClickOnce("peek");
              }}
            >
              Peek
            </button>
            <button
              className="prep-level-buttons"
              onMouseEnter={isEmptyHandleHover}
              onClick={() => {
                isEmptyOnClick();
                handleButtonClickOnce("isEmpty");
              }}
            >
              isEmpty
            </button>
            {isEmpty !== null && <p className="is-empty-result"> {isEmpty}</p>}
          </div>
          <div className="rectangle"></div>
          <div className="code-bar">
            <h1 className="title_code_style">Code</h1>
            <h2 className="code_style"></h2>
            <p className="code_description"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreperationLevel;
