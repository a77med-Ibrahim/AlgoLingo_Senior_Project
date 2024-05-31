import React, { useState, useEffect } from "react";
import "./PreperationLevel.css";
import { useNavigate } from "react-router-dom";
import LevelsBar from "../LevelBar";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import Celebration from "../../Celebration/Celebration";
let boxCount = 0;

function PreperationLevel() {
  const navigate = useNavigate();

  const [isEmpty, setIsEmpty] = useState(null);
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [pushClicked, setPushClicked] = useState(false);
  const [popClicked, setPopClicked] = useState(false);
  const [peekClicked, setPeekClicked] = useState(false);
  const [isEmptyClicked, setIsEmptyClicked] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleButtonClick = (index) => {
    setActiveButtonIndex(index);
    if (index === 0) {
      navigate("/preperation-level");
    }
  };

  useEffect(() => {
    if (popClicked && pushClicked && isEmptyClicked && peekClicked) {
      setCelebrate(true);
    }
  }, [popClicked, pushClicked, isEmptyClicked, peekClicked]);

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
  let popInProgress = false;

  //Hover Handling for Push
  function pushHandleHover() {
    setHoveredButton("push");
  }

  function pushOnClick() {
    if (boxCount >= 6) {
      return;
    }

    const box = document.createElement("div");
    box.className = "box";

    const boxNumber = document.createElement("span");
    boxNumber.className = "box-number";
    boxNumber.textContent = boxCount + 1;
    box.appendChild(boxNumber);

    // Set the opacity of the box number based on the showNumbers flag
    if (!showNumbers) {
      boxNumber.style.opacity = "0"; // Hide the number if showNumbers is false
    }

    // Append the box to the container
    const rectanglecontainer = document.querySelector(".rectanglecontainer");
    rectanglecontainer.appendChild(box);
    document.querySelector(".rectanglecontainer").appendChild(box);

    // Calculate the translateY value based on boxCount
    const boxHeight = 70; // Assuming the height of each box is 70px
    const margin = 3; // Assuming the margin between boxes is 3px
    const availableHeight = rectanglecontainer.clientHeight; // Get the height of the rectanglecontainer

    // Calculate the translateY value
    const translateYValue =
      -1 + availableHeight - (boxHeight + margin) * (boxCount + 1);

    // Animate the box dropping
    setTimeout(() => {
      box.style.transform = `translateY(${translateYValue}px)`;
    }, 50);

    // Increment boxCount for the next box
    boxCount++;
  }

  //Hover Handling for Pop
  function popHandleHover() {
    setHoveredButton("pop");
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
    const lastBox = document.querySelector(
      ".rectanglecontainer .box:last-child"
    );

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
    setHoveredButton("peek");
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
    setHoveredButton("isEmpty");
  }

  function isEmptyOnClick() {
    const empty = boxCount === 0;
    const result = empty ? "True" : "False";
    setIsEmpty(result);
  }

  function getButtonName(button) {
    switch (button) {
      case "push":
        return "Push";
      case "pop":
        return "Pop";
      case "peek":
        return "Peek";
      case "isEmpty":
        return "isEmpty";
      default:
        return "Code";
    }
  }

  function getAlgorithmName(button) {
    switch (button) {
      case "push":
        return "Function takes (value) entered by user and uses (this.stack.push) to push value into the stack";
      case "pop":
        return "Function firstly checks if the stack is empty or not using (isEmpty) function, if isEmpty=='true' don't do anything, else pops the last entered value";
      case "peek":
        return "Returns the values inside of the stack starting from 0 - len-1";
      case "isEmpty":
        return "Function checks if the stack is = to 0 it returns True, if stack.length>=1 return False";
      default:
        return "";
    }
  }

  function getCode(button) {
    switch (button) {
      case "push":
        return "push(value) {this.stack.push(value);}";
      case "pop":
        return "pop() {if (this.isEmpty()) {return null;}return this.stack.pop();}";
      case "peek":
        return "peek() {return this.stack[this.stack.length - 1];}";
      case "isEmpty":
        return "isEmpty() {return this.stack.length === 0;}";
      default:
        return "";
    }
  }

  return (
    <div className="all-div">
      <AlgoLingoBar />
      <div className="game-content">
        <h1 className="title">Stack</h1>
        <h2 className="title">Preparation</h2>

        <div className="queue-navbar-line"></div>

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
          <div className="rectanglecontainer"></div>
          <div className="stack-code-container">
            <h1 className="stack-code-description-title-style">
              {getButtonName(hoveredButton)}
            </h1>
            <h2 className="stack-prep-level-code-style">
              {getCode(hoveredButton)}
            </h2>
            <div className="stack-code-description-line"></div>
            <p className="stack-code-description">
              {getAlgorithmName(hoveredButton)}
            </p>
          </div>
        </div>
      </div>
      <Celebration active={celebrate} />
    </div>
  );
}

export default PreperationLevel;
