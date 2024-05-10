import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "../LevelBar";
import React, { useRef, useState, useEffect, forwardRef } from "react";
import Xarrow from "react-xarrows";
import "./LinkedListPrepLevel.css";

// Wrap Xarrow component with forwardRef
const ForwardedXarrow = forwardRef((props, ref) => (
  <Xarrow {...props} forwardRef={ref} />
));

function LinkedListPrepLevel() {
  const [numberOfBoxes, setNumberOfBoxes] = useState(1);
  const [boxReferences, setBoxReferences] = useState([]);

  useEffect(() => {
    // Update boxReferences whenever numberOfBoxes changes
    setBoxReferences(
      Array.from({ length: numberOfBoxes }, (_, index) => ({
        id: `box-${index}`, // Assign unique ID
      }))
    );
  }, [numberOfBoxes]);

  const handlePushToTail = () => {
    if (numberOfBoxes < 5) {
      setNumberOfBoxes((prevNumberOfBoxes) => prevNumberOfBoxes + 1);
    } else {
      alert("5 Nodes is the limit");
    }
  };

  // Function to dynamically render the boxes and arrows
  const renderBoxesAndArrows = () => {
    return boxReferences.map((box, index) => (
      <div
        key={box.id}
        id={box.id}
        className={`box-style ${index === numberOfBoxes - 1 ? "animate" : ""}`}
      >
        <p>{index + 1}</p>
        {index < boxReferences.length - 1 && (
          <ForwardedXarrow
            key={`arrow-${index}`}
            start={box.id} // Use box ID as start point
            end={boxReferences[index + 1].id} // Use next box ID as end point
            lineColor="blue"
            startAnchor="right"
            endAnchor="left"
          />
        )}
        <div className="line-style" />
      </div>
    ));
  };
  // Function to update arrows when number of boxes changes
  return (
    <div>
      <div className="all-div">
        <AlgoLingoBar />
        <div className="other">
          <h1 className="title-styling">Linked List</h1>
          <h2 className="title-styling">Preparation</h2>
          <div className="navbar-line" />
          <LevelsBar />
          <div>
            <button className="push-buttons-styling"> Push to Head </button>
            <button className="push-buttons-styling">Push after a value</button>
            <button onClick={handlePushToTail} className="push-buttons-styling">
              Push to Tail
            </button>
          </div>
          <div>
            <button className="push-buttons-styling">Delete Head</button>
            <button className="push-buttons-styling">
              Delete after a value
            </button>
            <button className="push-buttons-styling">Delete Tail</button>
          </div>
          <p>Number Of Nodes: {numberOfBoxes}</p>
          <div className="game-container">
            {/* Render dynamic boxes and arrows */}
            {renderBoxesAndArrows()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkedListPrepLevel;
