import React, { useState } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "./api.js";

function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userData = { email, password };
      const response = await registerUser(userData);
      console.log("User registered successfully:", response);
      // Redirect or show success message
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle error
    }
  };

  const handleLogin = async () => {
    try {
      const userData = { email, password };
      const response = await loginUser(userData);
      console.log("User logged in successfully:", response);
      // Redirect or show success message
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error
    }
  };
  return (
    <div className="container">
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
      <div className="login-signup-buttons">
        <button className="buttons-color" onClick={handleLogin}>
          Login
        </button>
        <button
          className="buttons-color"
          onClick={() => {
            handleRegister();
            navigate("/register");
          }}
        >
          Sign up
        </button>
        {/* <button onClick={() => navigate("/register")} className="register-button">
        Register
      </button> */}
      </div>
    </div>
  );
}

export default LandingPage;
