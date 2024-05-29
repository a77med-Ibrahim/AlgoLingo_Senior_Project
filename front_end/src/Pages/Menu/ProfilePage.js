import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useAuth } from "../Menu/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Menu/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "../Menu/firebaseConfig";

const auth = getAuth(firebaseApp);

const ProfilePage = () => {
  const { currentUser} = useAuth();
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
    signOut(auth).then(() => {
      navigate('/');
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };


 
  if (!currentUser) {
    return null;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-details">
        <p>{currentUser.email}</p>
        <p>{`Stack First Level: ${userData?.completedLevels?.FirstLevel ? `${userData.Points.points} Points` : "Not Completed"}`}</p>
        <p>{`Stack Second Level: ${userData?.completedLevels?.SecondLevel ? `${userData.Points.points2} Points` : "Not Completed"}`}</p>
        <p>{`Stack Third Level: ${userData?.completedLevels?.ThirdLevel ? `${userData.Points.points3} Points` : "Not Completed"}`}</p>
        <p>{`Linked List First Level: ${userData?.completedLevels?.LinkedListFirstLevel ? `${userData.Points.pointsLinkedListFirstLevel} Points` : "Not Completed"}`}</p>
        <p>{`Linked List Second Level: ${userData?.completedLevels?.LinkedListSecondLevel ? `${userData.Points.pointsLinkedListSecondLevel} Points` : "Not Completed"}`}</p>
        <p>{`Binary Search First Level: ${userData?.completedLevels?.BSLevel1 ? `${userData.Points.pointsBSLevel1} Points` : "Not Completed"}`}</p>
        <p>{`Binary Search Second Level: ${userData?.completedLevels?.BSLevel2 ? `${userData.Points.pointsBSLevel2} Points` : "Not Completed"}`}</p>
        <p>{`Queue First Level: ${userData?.completedLevels?.QueueFirstLevel ? `${userData.Points.pointsQueueFirstLevel} Points` : "Not Completed"}`}</p>
        <p>{`Queue Second Level: ${userData?.completedLevels?.QueueSecondLevel ? `${userData.Points.pointsQueueSecondLevel} Points` : "Not Completed"}`}</p>
     
      </div>
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
};

export default ProfilePage;
