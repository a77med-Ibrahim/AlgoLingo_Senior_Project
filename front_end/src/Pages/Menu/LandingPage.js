import React, { useState } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig"; 
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth(firebaseApp); 

function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        navigate("/menu");
      })
      .catch((error) => {
        console.error("Error during sign in:", error);
        const errorCode = error.code;
        const errorMessage = error.message;
        if (error.code === 'auth/invalid-credential') {
          setError("Invalid credentials. Please check your email and password.");
        } else {
          setError(errorMessage); // Display the actual Firebase error message
        }
      });
  };
  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Additional code to handle successful sign-in
      navigate('/menu'); // Or wherever you want to navigate after sign-in
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      // Handle error appropriately
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
            setError(""); // Reset error message on input change
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
