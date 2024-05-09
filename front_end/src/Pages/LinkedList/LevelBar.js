import React from "react";
import { useNavigate } from "react-router-dom";
import "./LevelBar.css";

function LevelsBar({
  activeButtonIndex,
  pushClicked,
  popClicked,
  peekClicked,
  isEmptyClicked,
}) {
  const navigate = useNavigate();

  const levels = ["prep", 1, 2];

  const isUnlocked = (index) => {
    // Check if all required buttons are clicked
    if (index === 1) {
      // For the first button, check if all other required buttons are clicked
      return pushClicked && popClicked && peekClicked && isEmptyClicked;
    } else {
      // For other buttons, check if all buttons before it are clicked
      return levels.slice(0, index).every((level) => level === "X");
    }
  };

  const getButtonColor = (index) => {
    return isUnlocked(index) ? "#3498db" : "grey";
  };

  const handleButtonClick = (index) => {
    if (levels[index] === "prep") {
      navigate("/LinkedListPrepLevel");
    } else if (index === 1) {
      navigate("/preperation-level/first-level");
    } else {
      // Handle navigation for other levels
    }
  };

  const renderButtons = () => {
    return levels.map((number, index) => (
      <button
        key={index}
        className={`buttonsss ${index === activeButtonIndex ? "active" : ""}`}
        style={{ backgroundColor: getButtonColor(index) }}
        onClick={() => handleButtonClick(index)}
        disabled={!isUnlocked(index)}
      >
        {isUnlocked(index) ? number : "X"}
      </button>
    ));
  };

  return (
    <div>
      <h2>Levels</h2>
      <div className="button-bar">{renderButtons()}</div>
    </div>
  );
}

export default LevelsBar;
