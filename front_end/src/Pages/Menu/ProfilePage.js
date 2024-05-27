import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext'; 
import { getAuth, signOut } from 'firebase/auth';
import { firebaseApp } from "../Menu/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "../Menu/firebaseConfig";

const auth = getAuth(firebaseApp);

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    completedLevels: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData({
              name: currentUser.displayName,
              email: currentUser.email,
              completedLevels: userDoc.data().completedLevels || []
            });
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };
      fetchUserData();
    }
  }, [currentUser]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/');
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Completed Levels:</strong></p>
        <ul>
          {userData.completedLevels.map((level, index) => (
            <li key={index}>{level}</li>
          ))}
        </ul>
      </div>
      <div className="profile-actions">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ProfilePage;
