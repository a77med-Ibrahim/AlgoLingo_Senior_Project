import React from "react";
import { useNavigate } from "react-router-dom";
import "./LevelBar.css";

function LevelsBar({
  maxHeapClicked,
  minHeapClicked,
  activeButtonIndex,
  taskCompleted,
}) {
  const navigate = useNavigate();
  const levels = ["prep", 1, 2];

  const isUnlocked = (index) => {
    if (index === 1) {
      return maxHeapClicked && minHeapClicked;
    } else if (index === 2) {
      return taskCompleted;
    } else {
      return levels.slice(0, index).every((level) => level === "X");
    }
  };

  const handleButtonClick = (index) => {
    if (levels[index] === "prep") {
      navigate("/PrepLevel");
    } else if (index === 1) {
      navigate("/FirstLevel");
    } else {
      navigate("/BSLevel2");
    }
  };
  const renderButtons = () => {
    return levels.map((number, index) => (
      <button
        key={index}
        className={`linkedlist-level-bar-buttons ${
          index === activeButtonIndex ? "active" : ""
        } ${isUnlocked(index) ? "" : "locked"}`}
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
      <div className="button-bar-linkedlist-level">{renderButtons()}</div>
    </div>
  );
}

export default LevelsBar;
