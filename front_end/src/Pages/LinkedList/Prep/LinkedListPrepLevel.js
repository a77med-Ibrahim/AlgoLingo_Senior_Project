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
  const [isInputVisible, setInputVisible] = useState(false);
  const [isDeleteInputVisible, setDeleteInputVisible] = useState(false);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [deleteValue, setDeleteValue] = useState("");

  const [pushToHeadClicked, setPushToHeadClicked] = useState(false);
  const [pushAfterValueClicked, setPushAfterValueClicked] = useState(false);
  const [pushToTailClicked, setPushToTailClicked] = useState(false);
  const [deleteHeadClicked, setDeleteHeadClicked] = useState(false);
  const [deleteValueClicked, setDeleteValueClicked] = useState(false);
  const [deleteTailClicked, setDeleteTailClicked] = useState(false);

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
      setPushToHeadClicked(true);
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
      setPushToTailClicked(true);
    } else {
      alert("5 Nodes is the limit");
    }
  };

  const handleDeleteTail = () => {
    if (numberOfBoxes > 0) {
      setNumberOfBoxes((prevNumberOfBoxes) => prevNumberOfBoxes - 1);
      setBoxReferences((prevBoxReferences) => prevBoxReferences.slice(0, -1));
      setDeleteTailClicked(true);
    } else {
      alert("Add nodes to delete");
    }
  };

  const handleDeleteHead = () => {
    if (numberOfBoxes > 0) {
      setNumberOfBoxes((prevNumberOfBoxes) => prevNumberOfBoxes - 1);
      setBoxReferences((prevBoxReferences) => prevBoxReferences.slice(1));
      setDeleteHeadClicked(true);
    } else {
      alert("No nodes to delete");
    }
  };

  const handlePushAfterAValue = () => {
    setInputVisible(true);
    setPushAfterValueClicked(true);
  };

  const handleDeleteValue = () => {
    setDeleteInputVisible(true);
    setDeleteValueClicked(true);
  };

  const handleChange1 = (event) => {
    setValue1(event.target.value);
  };

  const handleChange2 = (event) => {
    setValue2(event.target.value);
  };

  const handleDeleteChange = (event) => {
    setDeleteValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const index = boxReferences.findIndex(
      (box) => box.value === parseInt(value1)
    );
    if (index !== -1 && numberOfBoxes < 5) {
      const newBox = { id: `box-${numberOfBoxes}`, value: parseInt(value2) };
      const newBoxReferences = [...boxReferences];
      newBoxReferences.splice(index + 1, 0, newBox);

      // Update IDs of all subsequent boxes
      for (let i = index + 1; i < newBoxReferences.length; i++) {
        newBoxReferences[i].id = `box-${i}`;
      }

      setNumberOfBoxes(newBoxReferences.length);
      setBoxReferences(newBoxReferences);
    } else {
      alert("Either the value is not found or the limit of 5 nodes is reached");
    }
    setInputVisible(false);
    setValue1("");
    setValue2("");
  };

  const handleDeleteSubmit = (event) => {
    event.preventDefault();
    const index = boxReferences.findIndex(
      (box) => box.value === parseInt(deleteValue)
    );
    if (index !== -1) {
      const newBoxReferences = [...boxReferences];
      newBoxReferences.splice(index, 1);

      // Update IDs of all subsequent boxes
      for (let i = index; i < newBoxReferences.length; i++) {
        newBoxReferences[i].id = `box-${i}`;
      }

      setNumberOfBoxes(newBoxReferences.length);
      setBoxReferences(newBoxReferences);
    } else {
      alert("Value not found");
    }
    setDeleteInputVisible(false);
    setDeleteValue("");
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
        {index === 0 && (
          <p
            className={`head-text ${numberOfBoxes === 1 ? "single-head" : ""}`}
          >
            Head
          </p>
        )}
        {index === numberOfBoxes - 1 && (
          <p
            className={`tail-text ${numberOfBoxes === 1 ? "single-tail" : ""}`}
          >
            Tail
          </p>
        )}
        <p>{box.value}</p>
        {index === numberOfBoxes - 1 && <p className="null-text">null</p>}
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
          <LevelsBar
            pushClicked={pushToHeadClicked}
            popClicked={deleteHeadClicked}
            peekClicked={pushAfterValueClicked}
            isEmptyClicked={deleteValueClicked}
            deleteTailClicked={deleteTailClicked}
            pushTailClicked={pushToTailClicked}
          />
          <div>
            <button onClick={handlePushToHead} className="push-buttons-styling">
              Push to Head
            </button>
            <button
              className="push-buttons-styling"
              onClick={handlePushAfterAValue}
            >
              Push after a value
            </button>
            <button onClick={handlePushToTail} className="push-buttons-styling">
              Push to Tail
            </button>
          </div>
          <div>
            <button className="push-buttons-styling" onClick={handleDeleteHead}>
              Delete Head
            </button>
            <button
              className="push-buttons-styling"
              onClick={handleDeleteValue}
            >
              Delete value
            </button>
            <button className="push-buttons-styling" onClick={handleDeleteTail}>
              Delete Tail
            </button>
          </div>
          {isInputVisible && (
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                value={value1}
                onChange={handleChange1}
                className="input-field"
                placeholder="Enter the value to insert after"
              />
              <input
                type="number"
                value={value2}
                onChange={handleChange2}
                className="input-field"
                placeholder="Enter the new node value"
              />
              <button type="submit">Submit</button>
            </form>
          )}
          {isDeleteInputVisible && (
            <form onSubmit={handleDeleteSubmit}>
              <input
                type="number"
                value={deleteValue}
                onChange={handleDeleteChange}
                className="input-field"
                placeholder="Enter the value to delete"
              />
              <button type="submit">Submit</button>
            </form>
          )}
          <p>Number Of Nodes: {numberOfBoxes}</p>
          <div className="game-container">{renderBoxesAndArrows()}</div>
        </div>
      </div>
    </div>
  );
}

export default LinkedListPrepLevel;