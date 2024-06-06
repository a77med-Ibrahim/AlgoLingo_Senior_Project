import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";
import axios from "axios";

const auth = getAuth(firebaseApp);

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
      const response = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });
      if (response.status === 201) {
        navigate("/");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again later.");
    }
  };

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await axios.post('http://localhost:5000/Googleregister', {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      });
      if (response.status === 201) {
        navigate("/menu");
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setError("Sign in with Google failed. Please try again later.");
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

      {error && <div className="filling-text">{error}</div>}
    </div>
  );
};

export default RegisterPage;
