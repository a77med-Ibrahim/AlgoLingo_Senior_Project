import React from "react";
import { useNavigate } from "react-router-dom";
import "./LevelsBar.css";

function LevelsBar({
  activeButtonIndex,
  pushClicked,
  popClicked,
  peekClicked,
  isEmptyClicked,
  levelUnlocked,
  level2Unlocked,
}) {
  const navigate = useNavigate();

  const levels = ["prep", 1, 2];

  const isUnlocked = (index) => {
    // Check if all required buttons are clicked
    if (index === 1) {
      // For the first button, check if all other required buttons are clicked
      return levelUnlocked;
    } 
    else if(index === 2){
      return level2Unlocked;
    }
    else {
      // For other buttons, check if all buttons before it are clicked
      return levels.slice(0, index).every((level) => level === "X");
    }
  };

  const getButtonColor = (index) => {
    return isUnlocked(index) ? "#3498db" : "grey";
  };

  const handleButtonClick = (index) => {
    if (levels[index] === "prep") {
      navigate("/queue-preparation");
    } else if (index === 1) {
      navigate("/queueFirstLevel");
    } else {
      navigate("/queuesecondlevel");
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
