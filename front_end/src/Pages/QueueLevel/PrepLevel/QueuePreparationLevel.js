import React, { useState } from "react";
import "./QueuePreparationLevel.css";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "./Levels Bar/LevelsBar";

const namesArray = [
  "Mohammed",
  "khaled",
  "Hussein",
  "Hamza",
  "Emir",
  "Murat",
  "Hakan",
];

function getRandomName() {
  const randomIndex = Math.floor(Math.random() * namesArray.length);
  return namesArray[randomIndex];
}

function QueuePreparationLevel() {
  const [showCircle, setShowCircle] = useState(false);
  const [circleName, setCircleName] = useState("");

  const handleEnQueueClick = () => {
    setShowCircle(true);
    setCircleName(getRandomName());
    setTimeout(() => {
      setShowCircle(false);
    }, 3000); // Hide the circle after 3 seconds (adjust as needed)
  };

  return (
    <div className="flexing">
      <AlgoLingoBar />
      <div className="width-of-objects">
        <h1 className="title-styling">Queue</h1>
        <h2 className="title-styling">Preparation</h2>
        <div className="navbar-line" />
        <LevelsBar />
        <h3>
          Imagine you are waiting in a line to reach the cashier. The first one
          to come is the first one to pay and leave. That's how Queue works
          (FIFO) First In First Out
        </h3>
        <div className="flexing">
          <div className="queue-button-group">
            <button onClick={handleEnQueueClick}>EnQueue</button>
            <button>DeQueue</button>
            <button>Peek</button>
            <button>isEmpty</button>
          </div>
          {/* <div className="queue-rectangle"> */}
          {showCircle && (
            <div className="circle">
              <p className="circle-names">{circleName}</p>
            </div>
          )}
          {/* </div> */}
          <div className="cashier-box"> Chashier  </div>
        </div>
      </div>
    </div>
  );
}
export default QueuePreparationLevel;
