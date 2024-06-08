import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LevelBar.css";
import { useAuth } from "../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore"; 
import { db } from "../Menu/firebaseConfig";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../Menu/firebaseConfig";
import axios from "axios";

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
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const auth = getAuth(firebaseApp);

  const fetchUserLevelData = async (section, level) => {
    if (currentUser) {
      try {
        const response = await axios.get("http://localhost:5000/get_user_level_data", {
          params: {
            userId: currentUser.uid,
            section: section,
            level: level
          }
        });

        setUserData(prevData => ({
          ...prevData,
          [level]: response.data
        }));
      } catch (error) {
        console.error(`Error retrieving data for ${section} - ${level}:`, error);
      }
    }
  };

  useEffect(() => {
    fetchUserLevelData("LinkedList", "LinkedFirstLevel");
    fetchUserLevelData("LinkedList", "LinkedSecondLevel");
    
  }, [currentUser]);

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
      return isFirstLevelUnlocked || userData?.LinkedFirstLevel?.status;
    } else if (index === 2) {
      return taskCompleted || userData?.LinkedSecondLevel?.status;
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
