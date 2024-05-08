import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "../LevelBar";
import "./LinkedListPrepLevel.css";

function LinkedListPrepLevel() {
  return (
    <div>
      <div className="all-div">
        <AlgoLingoBar />
        <div className="other">
          <h1 className="title-styling">Linked List</h1>
          <h2 className="title-styling">Preparation</h2>
          <div className="navbar-line" />
          <div className="game-container">
            <div className="linked-list-rectangles"/>
            <div className="linked-list-rectangles"/>
            <div className="linked-list-rectangles"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkedListPrepLevel;
