import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LevelBar.css";
import { useAuth } from "../Menu/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore"; 
import { db } from "../Menu/firebaseConfig";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../Menu/firebaseConfig";

function LevelsBar({
  maxHeapClicked,
  minHeapClicked,
  activeButtonIndex,
  taskCompleted,
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
      return maxHeapClicked && minHeapClicked || userData?.completedLevels?.BSLevel1;
    } else if (index === 2) {
      return taskCompleted || userData?.completedLevels?.BSLevel2;
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
