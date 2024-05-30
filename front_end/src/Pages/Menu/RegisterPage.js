import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseApp } from "./firebaseConfig";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { firebaseConfig } from "../Menu/firebaseConfig";

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        completedLevels: {},
        points: {},
      });

      navigate("/");
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
      const displayName = user.displayName;
      const email = user.email;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        name: displayName,
        email: email,
        completedLevels: {},
        points: {},
      });

      navigate("/menu");
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Sign up for AlgoLingo</h2>
      <button className="google-signin" onClick={handleSignInWithGoogle}>
        <img
          src="https://img.icons8.com/color/16/000000/google-logo.png"
          alt="Google icon"
        />{" "}
        Continue with Google
      </button>
      <p className="filling-text">or</p>

      <input
        type="text"
        className="register-input"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Re-enter your password"
        value={rePassword}
        onChange={(e) => setRePassword(e.target.value)}
      />

      <button className="login-button" onClick={handleRegister}>
        Create account
      </button>

      {/* <button className="buttons-color" onClick={handleSignInWithGoogle}>
          Sign in with Google
        </button> */}
      {error && <div className="filling-text">{error}</div>}
    </div>
  );
};

export default RegisterPage;
