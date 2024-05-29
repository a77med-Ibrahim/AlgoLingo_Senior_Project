import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useAuth } from "../Menu/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Menu/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "../Menu/firebaseConfig";
import AlgoLingoBar from "./AlgoLingoBar";

const auth = getAuth(firebaseApp);

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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
  }, [currentUser]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  if (!currentUser) {
    return null;
  }

  const renderBar = (label, points, isCompleted) => {
    const maxPoints = 300; // Set a max point value for scaling the bars
    const barWidth = isCompleted ? Math.min((points / maxPoints) * 100, 60) : 60; // Ensure the bar width does not exceed 100%
    const barColor = isCompleted ? "linear-gradient(to right, yellow, orange)" : "red";
    const barText = isCompleted ? `${points} Points` : "Level not completed";

    return (
      <div className="profilebar-container">
        <div
          className="profilebar"
          style={{ width: `${barWidth}%`, background: barColor }}
        >
          {label}
        </div>
        <div className="profilebar-label">{barText}</div>
      </div>
    );
  };

  return (
    <div className="main-div">
      <AlgoLingoBar />
      <div className="profile-container">
        <h1>Profile</h1>
        <div className="profile-details">
          <div className="profilebar-container">
            <div className="profilebar" style={{ width: "100%" }}>
              {`Name: ${userData?.name || "N/A"}`}
            </div>
          </div>
          <br />
          <div className="profilebar-container">
            <div className="profilebar" style={{ width: "100%" }}>
              {`Email: ${currentUser.email}`}
            </div>
            <br />
          </div>
          {renderBar(
            "Stack First Level",
            userData?.Points?.points || 0,
            userData?.completedLevels?.FirstLevel || false
          )}
          {renderBar(
            "Stack Second Level",
            userData?.Points?.points2 || 0,
            userData?.completedLevels?.SecondLevel || false
          )}
          {renderBar(
            "Stack Third Level",
            userData?.Points?.points3 || 0,
            userData?.completedLevels?.ThirdLevel || false
          )}
          {renderBar(
            "Linked List First Level",
            userData?.Points?.pointsLinkedListFirstLevel || 0,
            userData?.completedLevels?.LinkedListFirstLevel || false
          )}
          {renderBar(
            "Linked List Second Level",
            userData?.Points?.pointsLinkedListSecondLevel || 0,
            userData?.completedLevels?.LinkedListSecondLevel || false
          )}
          {renderBar(
            "Binary Search First Level",
            userData?.Points?.pointsBSLevel1 || 0,
            userData?.completedLevels?.BSLevel1 || false
          )}
          {renderBar(
            "Binary Search Second Level",
            userData?.Points?.pointsBSLevel2 || 0,
            userData?.completedLevels?.BSLevel2 || false
          )}
          {renderBar(
            "Queue First Level",
            userData?.Points?.pointsQueueFirstLevel || 0,
            userData?.completedLevels?.QueueFirstLevel || false
          )}
          {renderBar(
            "Queue Second Level",
            userData?.Points?.pointsQueueSecondLevel || 0,
            userData?.completedLevels?.QueueSecondLevel || false
          )}
        </div>
        <br />
        <button className="profilebutton-color" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
