import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { firebaseApp } from "./firebaseConfig"; // Assuming firebaseApp is correctly initialized
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../Menu/firebaseConfig';

const auth = getAuth(firebaseApp); // Use the initialized auth instance

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
      // Additional code to handle successful sign-in
      navigate('/menu'); // Or wherever you want to navigate after sign-in
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      // Handle error appropriately
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
      {/* Other input fields for email, password, and re-enter password */}
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
