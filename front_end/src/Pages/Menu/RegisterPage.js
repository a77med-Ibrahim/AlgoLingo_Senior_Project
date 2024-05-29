import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { firebaseApp } from "./firebaseConfig"; 
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { firebaseConfig } from '../Menu/firebaseConfig';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp); // Initialize Firestore

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !rePassword) {
      setError("All fields are required");
      return;
    }

    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store the user's name in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        completedLevels: {},
        points: {}
      });

      navigate('/menu');
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed: " + error.message);
    }
  };

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      
      // Check if the user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        // If the user does not exist, store the user's name in Firestore
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          completedLevels: {},
          points: {}
        });
      }

      navigate('/menu');
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setError("Error signing in with Google: " + error.message);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <div className="input-group">
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Re-enter Password</label>
        <input
          type="password"
          placeholder="Re-enter your password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />
      </div>
      <div className="register-button">
        <button className="buttons-color" onClick={handleRegister}>
          Register
        </button>
      </div>
      <div className="register-button">
        <button className="buttons-color" onClick={handleSignInWithGoogle}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
