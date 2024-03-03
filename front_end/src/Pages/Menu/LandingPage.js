import React from "react";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="container">
      <div className="input-group">
        <label>Email</label>
        <input type="email" placeholder="Enter your email" />
      </div>
      <div className="input-group">
        <label>Password</label>
        <input type="password" placeholder="Enter your password" />
      </div>
      <div className="login-signup-buttons">
        <button className="buttons-color">Login</button>
        <button className="buttons-color">Sign up</button>
      </div>
    </div>
  );
}

export default LandingPage;
