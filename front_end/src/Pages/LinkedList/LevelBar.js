import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LevelBar.css";

function LevelsBar({
  activeButtonIndex,
  taskCompleted,
  pushToHeadClicked,
  deleteHeadClicked,
  pushAfterValueClicked,
  deleteValueClicked,
  deleteTailClicked,
  pushToTailClicked,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const levels = ["prep", 1, 2];

  const [isFirstLevelUnlocked, setIsFirstLevelUnlocked] = useState(
    JSON.parse(localStorage.getItem("isFirstLevelUnlocked")) || false
  );

  useEffect(() => {
    if (
      pushToHeadClicked &&
      deleteHeadClicked &&
      pushAfterValueClicked &&
      deleteValueClicked &&
      deleteTailClicked &&
      pushToTailClicked
    ) {
      setIsFirstLevelUnlocked(true);
      localStorage.setItem("isFirstLevelUnlocked", true);
    }
  }, [
    pushToHeadClicked,
    deleteHeadClicked,
    pushAfterValueClicked,
    deleteValueClicked,
    deleteTailClicked,
    pushToTailClicked,
  ]);

  useEffect(() => {
    if (location.pathname === "/LinkedListPrepLevel") {
      setIsFirstLevelUnlocked(false);
      localStorage.setItem("isFirstLevelUnlocked", false);
    }
  }, [location.pathname]);

  const isUnlocked = (index) => {
    if (index === 1) {
      return isFirstLevelUnlocked;
    } else if (index === 2) {
      return taskCompleted;
    } else {
      return true;
    }
  };

  const handleButtonClick = (index) => {
    if (isUnlocked(index)) {
      if (levels[index] === "prep") {
        navigate("/LinkedListPrepLevel");
      } else if (index === 1) {
        navigate("/LinkedListFirstLevel");
      } else {
        navigate("/LinkedListSecondLevel");
      }
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
