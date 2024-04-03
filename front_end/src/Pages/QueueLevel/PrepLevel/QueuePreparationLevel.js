import React from "react";
import "./QueuePreparationLevel.css";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "./Levels Bar/LevelsBar";
import Amongus from "../Amongos/Amongus";

function QueuePreparationLevel() {
  return (
    <div className="flexing">
      <AlgoLingoBar />
      <div className="width-of-objects">
        <h1 className="title-styling">Queue</h1>
        <h2 className="title-styling">Preparation</h2>
        <LevelsBar />
        <div className="queue-button-group">
          <button>EnQueue</button>
          <button>DeQueue</button>
          <button>Peek</button>
          <button>isEmpty</button>
        </div>
        <div className="queue-rectangle"></div>

        {/* <Amongus className="amongus" /> */}
      </div>
    </div>
  );
}
export default QueuePreparationLevel;
