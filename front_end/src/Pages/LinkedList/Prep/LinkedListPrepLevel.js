import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "../LevelBar";
import React, { useState, useEffect, forwardRef } from "react";
import Xarrow from "react-xarrows";
import "./LinkedListPrepLevel.css";

// Wrap Xarrow component with forwardRef
const ForwardedXarrow = forwardRef((props, ref) => (
  <Xarrow {...props} forwardRef={ref} />
));

function LinkedListPrepLevel() {
  const [numberOfBoxes, setNumberOfBoxes] = useState(1);
  const [boxReferences, setBoxReferences] = useState([
    { id: `box-0`, value: Math.floor(Math.random() * 100) },
  ]);
  const [animateBoxHead, setAnimateBoxHead] = useState(null);
  const [animateBoxTail, setAnimateBoxTail] = useState(null);

  useEffect(() => {
    setBoxReferences(
      Array.from({ length: numberOfBoxes }, (_, index) => ({
        id: `box-${index}`,
        value: boxReferences[index]?.value ?? Math.floor(Math.random() * 100),
      }))
    );
  }, [numberOfBoxes]);

  const handlePushToHead = () => {
    if (numberOfBoxes < 5) {
      const newValue = Math.floor(Math.random() * 100);
      const newBox = { id: `box-0`, value: newValue };
      setNumberOfBoxes((prevNumberOfBoxes) => prevNumberOfBoxes + 1);
      setBoxReferences((prevBoxReferences) => [
        newBox,
        ...prevBoxReferences.map((box, index) => ({
          ...box,
          id: `box-${index + 1}`,
        })),
      ]);
      setAnimateBoxHead(newBox.id);
    } else {
      alert("5 Nodes is the limit");
    }
  };

  const handlePushToTail = () => {
    if (numberOfBoxes < 5) {
      const newValue = Math.floor(Math.random() * 100);
      const newBox = { id: `box-${numberOfBoxes}`, value: newValue };
      setNumberOfBoxes((prevNumberOfBoxes) => prevNumberOfBoxes + 1);
      setBoxReferences((prevBoxReferences) => [...prevBoxReferences, newBox]);
      setAnimateBoxTail(newBox.id);
    } else {
      alert("5 Nodes is the limit");
    }
  };

  const handleDeleteTail = () => {
    if (numberOfBoxes > 0) {
      setNumberOfBoxes((prevNumberOfBoxes) => prevNumberOfBoxes - 1);
      setBoxReferences((prevBoxReferences) => prevBoxReferences.slice(0, -1));
    } else {
      alert("Add nodes to delete");
    }
  };

  const handleDeleteHead = () => {
    if (numberOfBoxes > 0) {
      setNumberOfBoxes((prevNumberOfBoxes) => prevNumberOfBoxes - 1);
      setBoxReferences((prevBoxReferences) => prevBoxReferences.slice(1));
    } else {
      alert("No nodes to delete");
    }
  };

  const renderBoxesAndArrows = () => {
    return boxReferences.map((box, index) => (
      <div
        key={box.id}
        id={box.id}
        className={`box-style ${
          box.id === animateBoxHead ? "animate-head" : ""
        } ${box.id === animateBoxTail ? "animate-tail" : ""}`}
      >
        {index === 0 && <p className="head-text">Head</p>}{" "}
        {/* Always render "Head" text on top of the first node */}
        {index === numberOfBoxes - 1 && <p className="tail-text">Tail</p>}{" "}
        {/* Always render "Tail" text on top of the last node */}
        <p>{box.value}</p>
        {index === numberOfBoxes - 1 && <p className="null-text">null</p>}{" "}
        {/* Render "null" element for the last node */}
        {index < boxReferences.length - 1 && (
          <ForwardedXarrow
            key={`arrow-${index}`}
            start={box.id}
            end={boxReferences[index + 1].id}
            lineColor="blue"
            startAnchor="right"
            endAnchor="left"
          />
        )}
        <div className="line-style" />
      </div>
    ));
  };

  useEffect(() => {
    if (animateBoxHead !== null) {
      const timer = setTimeout(() => {
        setAnimateBoxHead(null);
      }, 1000); // Duration of animation in ms

      return () => clearTimeout(timer);
    }
  }, [animateBoxHead]);

  useEffect(() => {
    if (animateBoxTail !== null) {
      const timer = setTimeout(() => {
        setAnimateBoxTail(null);
      }, 1000); // Duration of animation in ms

      return () => clearTimeout(timer);
    }
  }, [animateBoxTail]);

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
            <button onClick={handlePushToHead} className="push-buttons-styling">
              Push to Head
            </button>
            <button className="push-buttons-styling">Push after a value</button>
            <button onClick={handlePushToTail} className="push-buttons-styling">
              Push to Tail
            </button>
          </div>
          <div>
            <button className="push-buttons-styling" onClick={handleDeleteHead}>
              Delete Head
            </button>
            <button className="push-buttons-styling">
              Delete after a value
            </button>
            <button className="push-buttons-styling" onClick={handleDeleteTail}>
              Delete Tail
            </button>
          </div>
          <p>Number Of Nodes: {numberOfBoxes}</p>
          <div className="game-container">{renderBoxesAndArrows()}</div>
        </div>
      </div>
    </div>
  );
}

export default LinkedListPrepLevel;
