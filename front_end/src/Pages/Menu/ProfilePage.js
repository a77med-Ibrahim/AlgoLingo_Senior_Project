import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useAuth } from "../Menu/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Menu/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "../Menu/firebaseConfig";
import AlgoLingoBar from "./AlgoLingoBar";
import axios from "axios";
const auth = getAuth(firebaseApp);

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const[userLevelData,setUserLevelData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const response = await axios.get("http://localhost:5000/get_user_data", {
            params: {
              userId: currentUser.uid
            }
          });

          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

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

        setUserLevelData(prevData => ({
          ...prevData,
          [level]: response.data
        }));
      } catch (error) {
        console.error(`Error retrieving data for ${section} - ${level}:`, error);
      }
    }
  };

  useEffect(() => {
    fetchUserLevelData("Stack_Level", "FirstLevel");
    fetchUserLevelData("Stack_Level", "SecondLevel");
    fetchUserLevelData("Stack_Level", "ThirdLevel");
    fetchUserLevelData("QueueLevel", "queueFirstLevel");
    fetchUserLevelData("QueueLevel", "queueSecondLevel");    
    fetchUserLevelData("LinkedList", "LinkedFirstLevel");
    fetchUserLevelData("LinkedList", "LinkedSecondLevel");
    fetchUserLevelData("Binary_search_level", "BSLevel2");
    fetchUserLevelData("Binary_search_level", "BinaryFirstLevel");
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
    const maxPoints = 300; 
    const barWidth = isCompleted ? Math.min((points / maxPoints) * 100, 100) : 20; 
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
    <div className="profmain-div">
      <div className="almain-div"><AlgoLingoBar /></div>
      <div className="profile-container">
        <h1 className="profilenamename" >Profile</h1>
        <div className="profile-details">
          <div className="profile-info">
            <div className="profile-info-item">{`Name: ${userData?.name || "N/A"}`}</div>
            <div className="profile-info-item">{`Email: ${currentUser.email}`}</div>
          </div>
          <div className="progress-bars">
            {renderBar(
              "Stack 1:",
              userLevelData?.FirstLevel?.score || 0,
              userLevelData?.FirstLevel?.status || false
            )}
            {renderBar(
              "Stack 2:",
              userLevelData?.SecondLevel?.score || 0,
              userLevelData?.SecondLevel?.status || false
            )}
            {renderBar(
              "Stack 3:",
              userLevelData?.ThirdLevel?.score || 0,
              userLevelData?.ThirdLevel?.status || false
            )}
            {renderBar(
              "Queue 1:",
              userLevelData?.queueFirstLevel?.score || 0,
              userLevelData?.queueFirstLevel?.status || false
            )}
            {renderBar(
              "Queue 2:",
              userLevelData?.queueSecondLevel?.score || 0,
              userLevelData?.queueSecondLevel?.status || false
            )}
            {renderBar(
              "Linked 1:",
              userLevelData?.LinkedFirstLevel?.score || 0,
              userLevelData?.LinkedFirstLevel?.status || false
            )}
            {renderBar(
              "Linked 2:",
              userLevelData?.LinkedSecondLevel?.score || 0,
              userLevelData?.LinkedSecondLevel?.status || false
            )}
            {renderBar(
              "Binary 1:",
              userLevelData?.BinaryFirstLevel?.score || 0,
              userLevelData?.BinaryFirstLevel?.status || false
            )}
            {renderBar(
              "Binary 2:",
              userLevelData?.BSLevel2?.score || 0,
              userLevelData?.BSLevel2?.status || false
            )}
          </div>
        </div>
        <button className="profile-button" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
