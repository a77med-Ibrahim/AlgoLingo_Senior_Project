import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useAuth } from "../Menu/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Menu/firebaseConfig";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

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

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {userData && (
        <div className="profile-details">
          <p>{currentUser.email}</p>
          <p>{`First Level: ${userData.completedLevels && userData.completedLevels.FirstLevel ? "Completed with " + `${userData.points} Points` : "Not Completed"}`}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
