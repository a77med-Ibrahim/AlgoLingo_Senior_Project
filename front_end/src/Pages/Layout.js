import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

function Layout({ children }) {
  return (
    <div className="main-div">
      <div className="menu-bar">
        <Link to="/" className="algolingo-button">
          AlgoLingo
        </Link>
      </div>
      {children}
    </div>
  );
}

export default Layout;
