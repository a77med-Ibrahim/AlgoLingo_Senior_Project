import React, { useState } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from "./firebaseConfig"; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseAuth, db } from "./firebaseConfig";

const auth = getAuth(firebaseApp); 

function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate("/menu");
    } catch (error) {
      console.error("Error during sign in:", error);
      setError(error.message); 
    }
  };

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const displayName = user.displayName;
      const email = user.email;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        name: displayName,
        email: email,
        completedLevels: {},
        points: {}
      });

      navigate('/menu');
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setError(error.message); 
    }
  };
  

  return (
    <div className="container">
      {error && <div className="error-message">{error}</div>}
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
          onChange={(e) => {
            setError(""); 
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className="login-signup-buttons">
        <button className="buttons-color" onClick={handleLogin}>
          Login
        </button>
        <button
          className="buttons-color"
          onClick={() => navigate("/register")}
        >
          Sign up
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

export default LandingPage;
