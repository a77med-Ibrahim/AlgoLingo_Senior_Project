import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext'; // Ensure this path is correct
import { getAuth, signOut } from 'firebase/auth';
import { firebaseApp } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import './ProfilePage.css';

const auth = getAuth(firebaseApp);

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.name,
        email: currentUser.email,
        // Add other user details you want to display
      });
    }
  }, [currentUser]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/');
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        {/* Add other details here */}
      </div>
      <div className="profile-actions">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ProfilePage;
