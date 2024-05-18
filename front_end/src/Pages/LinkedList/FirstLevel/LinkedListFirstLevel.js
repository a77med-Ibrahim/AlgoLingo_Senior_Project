import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "../LevelBar";
import React from "react";
import Xarrow from "react-xarrows";
import "./LinkedListFirstLevel.css";

function LinkedListFirstLevel() {
  return (
    <div>
      <div className="all-div">
        {" "}
        <AlgoLingoBar />
        <div className="other">
          <h1 className="title-styling">Linked List</h1>
          <h2 className="title-styling">First Level</h2>
          <div className="navbar-line" />
          <LevelsBar />
        </div>
      </div>
    </div>
  );
}
export default LinkedListFirstLevel;
