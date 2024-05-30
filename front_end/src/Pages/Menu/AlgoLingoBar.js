import "./AlgoLingoBar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

function AlgoLingoBar() {
  const navigate = useNavigate();
  const goToMainPage = () => {
    navigate("/menu");
  };
  const goToProfile = () => {
    navigate("/profile");
  };
  const goToLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="menu-bar">
      <button className="algolingo-button" onClick={goToMainPage}>
        Algolingo
      </button>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <button className="algolingo-button" onClick={goToProfile}>
        profile
      </button>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <button className="algolingo-button" onClick={goToLeaderboard}>
        leaderboard
      </button>
    </div>
  );
}

export default AlgoLingoBar;
