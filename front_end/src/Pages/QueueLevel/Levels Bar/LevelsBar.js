import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LevelsBar.css";
import { useAuth } from "../../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore"; 
import { db } from "../../Menu/firebaseConfig";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../Menu/firebaseConfig";

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
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.log("User document does not exist");
        }
      }
    };
    fetchUserData();
  }, [currentUser])


  const isUnlocked = (index) => {
    if (index === 1) {
      return levelUnlocked || userData?.completedLevels?.QueueFirstLevel;
    } 
    else if(index === 2){
      return level2Unlocked || userData?.completedLevels?.QueueFirstLevel;
    }
    else {  
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
