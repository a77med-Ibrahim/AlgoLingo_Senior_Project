import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "../LevelBar";
import React, { useRef, useState, useEffect, forwardRef } from "react";
import Xarrow from "react-xarrows";
import "./LinkedListPrepLevel.css";

const boxStyle = {
  position: "relative",
  border: "red solid 2px",
  borderRadius: "10px",
  padding: "5px",
  width: "20%",
  height: "100px",
  display: "inline-block",
  boxSizing: "border-box",
  marginRight: "10%",
};

const lineStyle = {
  content: "''",
  position: "absolute",
  width: "2px",
  height: "100%",
  backgroundColor: "blue",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

// Wrap Xarrow component with forwardRef
const ForwardedXarrow = forwardRef((props, ref) => (
  <Xarrow {...props} forwardRef={ref} />
));

function LinkedListPrepLevel() {
  const [numberOfBoxes, setNumberOfBoxes] = useState(1);
  const [numberOfArrows, setNumberOfArrows] = useState(0);

  useEffect(() => {
    boxesRefs.current = Array.from({ length: numberOfBoxes }, () =>
      React.createRef()
    );
    arrowsRefs.current = Array.from({ length: numberOfBoxes - 1 }, () =>
      React.createRef()
    );
  }, [numberOfBoxes]);

  const handlePushToTail = () => {
    setNumberOfBoxes((prevNumberOfBoxes) => {
      console.log("Number of boxes:", prevNumberOfBoxes + 1);
      return prevNumberOfBoxes + 1;
    });

    setNumberOfArrows((prevNumberOfArrows) => {
      console.log("Number of arrows:", prevNumberOfArrows + 1);
      return prevNumberOfArrows + 1;
    });
  };

  const boxesRefs = useRef([]);
  const arrowsRefs = useRef([]);

  // Generate random numbers for each rectangle
  const randomNumbers = useRef(
    Array.from({ length: numberOfBoxes }, () => Math.floor(Math.random() * 100))
  );

  // Function to dynamically render the boxes and arrows
  const renderBoxesAndArrows = () => {
    return boxesRefs.current.map((boxRef, index) => (
      <div key={index} style={boxStyle} ref={boxRef}>
        <p>{index + 1}</p> {/* Displaying index + 1 as numbers start from 1 */}
        {index < boxesRefs.current.length - 1 && (
          <ForwardedXarrow
            key={`arrow-${index}`} // Add a key to each arrow
            start={boxRef}
            end={boxesRefs.current[index + 1]}
            lineColor="blue"
            ref={(arrow) => (arrowsRefs.current[index] = arrow)} // Store reference to arrows
          />
        )}
        <div style={lineStyle} />
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
          <div className="ll-buttons">
            <button> Push to Head </button>
            <button> Push to Middle </button>
            <button onClick={handlePushToTail}> Push to Tail </button>
          </div>

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
