import React, { useState } from "react";
import "./Menu.css";

import stackImage from "./Img/stackImg.webp";
import queueImage from "./Img/queueImg.png";

function Menu() {
  const [activeCircle, setActiveCircle] = useState(null);

  const circleData = [
    { id: 1, top: "60px", left: "90px", isOpen: true, image: stackImage },
    { id: 2, top: "150px", left: "-40px", isOpen: false, image: queueImage },
    { id: 3, top: "220px", left: "-20px", isOpen: false, image: null },
  ];

  const handleCircleClick = (circleId) => {
    setActiveCircle(activeCircle === circleId ? null : circleId);
  };

  return (
    <div className="main-div">
      <div className="menu-bar">
        <button className="algolingo-button">AlgoLingo</button>
      </div>
      <div className="levels-bar">
        <button className="levels-button">Levels</button>
        <div className="levels-space">
          {circleData.map((circle) => (
            <button
              key={circle.id}
              className={`circles ${circle.isOpen ? "" : "closed"}`}
              style={{ top: circle.top, left: circle.left }}
              onClick={() => handleCircleClick(circle.id)}
            >
              {circle.isOpen ? circle.id : "X"}
            </button>
          ))}
        </div>
      </div>
      <div className="start-bar">
        <div className={`image-container ${activeCircle ? "visible" : ""}`}>
          {activeCircle && circleData[activeCircle - 1].image && (
            <img
              className="image"
              src={circleData[activeCircle - 1].image}
              alt={`Circle ${activeCircle} Image`}
            />
          )}
        </div>
        <button className="start-button">Start</button>
      </div>
    </div>
  );
}

export default Menu;
