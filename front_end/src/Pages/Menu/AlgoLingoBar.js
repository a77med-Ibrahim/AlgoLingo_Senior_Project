import "./AlgoLingoBar.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function AlgoLingoBar() {
  const navigate = useNavigate();

  const goToMainPage = () => {
    navigate("/");
  };

  return (
    <div className="menu-bar">
      <button className="algolingo-button" onClick={goToMainPage}>
        AlgoLingo
      </button>
    </div>
  );
}

export default AlgoLingoBar;
