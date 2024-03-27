import React from "react";
import "./LevelBar.css";

function LevelsBar({
  activeButtonIndex,
  handleButtonClick,
  pushClicked,
  popClicked,
  peekClicked,
  isEmptyClicked,
}) {
  const levels = [1, 2, 3, 4, 5];

  const isUnlocked = (index) => {
    // Check if all required buttons are clicked
    if (index === 0) {
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
