import React, { useState } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
    </div>
  );
}

export default LandingPage;
