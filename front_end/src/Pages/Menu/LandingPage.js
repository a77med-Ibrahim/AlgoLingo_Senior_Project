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
      <button>Login</button>
    </div>
  );
}

export default LandingPage;
