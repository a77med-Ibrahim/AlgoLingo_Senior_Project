import React, { useState } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const auth = getAuth(firebaseApp);

function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigate("/menu");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        completedLevels: {},
        points: {},
      });

      navigate("/menu");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Sign in to AlgoLingo</h2>
      <button className="google-signin" onClick={handleSignInWithGoogle}>
        <img
          src="https://img.icons8.com/color/16/000000/google-logo.png"
          alt="Google icon"
        />{" "}
        Continue with Google
      </button>
      <p className="filling-text">or</p>
      {error && <div className="error-message">{error}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setError("");
          setPassword(e.target.value);
        }}
      />
      <button className="login-button" onClick={handleLogin}>
        Log in
      </button>
      <p className="filling-text">No account?</p>
      <button className="signup-button" onClick={() => navigate("/register")}>
        Sign up
      </button>
    </div>
  );
}

export default LandingPage;
