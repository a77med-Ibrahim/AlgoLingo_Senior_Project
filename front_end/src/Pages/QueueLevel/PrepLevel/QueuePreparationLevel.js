import React from "react";
import "./QueuePreparationLevel.css";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "./Levels Bar/LevelsBar";
// import Amongos from "../Amongos/Amongos";

function QueuePreparationLevel() {
  return (
    <div className="flexing">
      <AlgoLingoBar />
      <div className="width-of-objects">
        <h1 className="title-styling">Queue</h1>
        <h2 className="title-styling">Preparation</h2>
        <LevelsBar />
        {/* <Amongos /> */}
      </div>
    </div>
  );
}
export default QueuePreparationLevel;
