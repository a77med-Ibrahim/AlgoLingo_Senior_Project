import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LevelBar.css";

function LevelsBar({
  activeButtonIndex,
  pushClicked,
  popClicked,
  peekClicked,
  isEmptyClicked,
  deleteTailClicked,
  pushTailClicked,
}) {
  const navigate = useNavigate();

  const levels = ["prep", 1, 2];

  useEffect(() => {
    // Check if all preparation steps are completed
    const allPrepCompleted =
      pushClicked &&
      popClicked &&
      peekClicked &&
      isEmptyClicked &&
      deleteTailClicked &&
      pushTailClicked;

    // If all preparation steps are completed, unlock level 1
    if (allPrepCompleted) {
      localStorage.setItem("level1Unlocked", true);
    }
  }, [
    pushClicked,
    popClicked,
    peekClicked,
    isEmptyClicked,
    deleteTailClicked,
    pushTailClicked,
  ]);

  const isUnlocked = (index) => {
    if (index === 0) {
      // "prep" level is always unlocked
      return true;
    } else if (index === 1) {
      // Level 1 is unlocked only if all prep level buttons are clicked
      return localStorage.getItem("level1Unlocked") === "true";
    } else {
      // Level 2 is always locked
      return false;
    }
  };

  const getButtonColor = (index) => {
    return isUnlocked(index) ? "#3498db" : "grey";
  };

  const handleButtonClick = (index) => {
    if (levels[index] === "prep") {
      navigate("/LinkedListPrepLevel");
    } else if (index === 1) {
      if (isUnlocked(index)) {
        navigate("/LinkedListFirstLevel");
      } else {
        alert("Complete all preparation steps to unlock this level");
      }
    } else {
      // For level 2 and others, currently do nothing or handle accordingly
      alert("This level is locked.");
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
