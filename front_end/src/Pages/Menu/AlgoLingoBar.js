import "./AlgoLingoBar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

function AlgoLingoBar() {
  const navigate = useNavigate();
  const goToMainPage = () => {
    navigate("/menu");
  };

  return (
    <div className="menu-bar">
      <button className="algolingo-button" onClick={goToMainPage}>
        Algolingo
      </button>
    </div>
  );
}

export default AlgoLingoBar;
