import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LevelsBar.css";
import { useAuth } from "../../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../Menu/firebaseConfig";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../Menu/firebaseConfig";
import axios from "axios";

function LevelsBar({ activeButtonIndex, levelUnlocked, level2Unlocked }) {
  const navigate = useNavigate();

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
    fetchUserLevelData("QueueLevel", "queueFirstLevel");
    fetchUserLevelData("QueueLevel", "queueSecondLevel");
    
  }, [currentUser]);

  const isUnlocked = (index) => {
    if (index === 1) {
      return levelUnlocked || userData?.queueFirstLevel?.status;
    } else if (index === 2) {
      return level2Unlocked || userData?.queueSecondLevel?.status;
    } else {
      return levels.slice(0, index).every((level) => level === "X");
    }
  };

  const getButtonClass = (index) => {
    return isUnlocked(index) ? "" : "locked";
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
        className={`queue-level-bar-buttons ${getButtonClass(index)} ${
          index === activeButtonIndex ? "active" : ""
        }`}
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
      <div className="button-bar-queue-level">{renderButtons()}</div>
    </div>
  );
}

export default LevelsBar;
