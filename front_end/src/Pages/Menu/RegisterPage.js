import React, { useState } from "react";
import "./Register.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig"; // Assume you have this configuration file

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRe_Password] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== re_password) {
      setError("Passwords do not match");
      return;
    }

    const auth = getAuth(firebaseApp);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Registration failed:", error);
            // Handle error
            setError("Registration failed: " + error.message);
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
          value={re_password}
          onChange={(e) => setRe_Password(e.target.value)}
        />
      </div>
      <div className="register-button">
        <button className="buttons-color" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
