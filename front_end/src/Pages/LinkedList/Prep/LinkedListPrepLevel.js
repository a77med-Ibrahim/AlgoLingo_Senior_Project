import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "../LevelBar";
import React, { useState, useEffect, forwardRef } from "react";
import Xarrow from "react-xarrows";
import Celebration from "../../Celebration/Celebration";
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
  const [celebrate, setCelebrate] = useState(false);

  const [pushToHeadClicked, setPushToHeadClicked] = useState(false);
  const [pushAfterValueClicked, setPushAfterValueClicked] = useState(false);
  const [pushToTailClicked, setPushToTailClicked] = useState(false);
  const [deleteHeadClicked, setDeleteHeadClicked] = useState(false);
  const [deleteValueClicked, setDeleteValueClicked] = useState(false);
  const [deleteTailClicked, setDeleteTailClicked] = useState(false);

  const [hoveredButton, setHoveredButton] = useState(null); // State to track hovered button
  const [lastHoveredButton, setLastHoveredButton] = useState(null); // State to track last hovered button

  useEffect(() => {
    setBoxReferences(
      Array.from({ length: numberOfBoxes }, (_, index) => ({
        id: `box-${index}`,
        value: boxReferences[index]?.value ?? Math.floor(Math.random() * 100),
      }))
    );
  }, [numberOfBoxes]);

  useEffect(() => {
    if (
      pushToHeadClicked &&
      pushAfterValueClicked &&
      pushToTailClicked &&
      deleteHeadClicked &&
      deleteValueClicked &&
      deleteTailClicked
    ) {
      setCelebrate(true);
    }
  }, [
    pushToHeadClicked,
    pushAfterValueClicked,
    pushToTailClicked,
    deleteHeadClicked,
    deleteValueClicked,
    deleteTailClicked,
  ]);

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
            pushToHeadClicked={pushToHeadClicked}
            deleteHeadClicked={deleteHeadClicked}
            pushAfterValueClicked={pushAfterValueClicked}
            deleteValueClicked={deleteValueClicked}
            deleteTailClicked={deleteTailClicked}
            pushToTailClicked={pushToTailClicked}
          />
          <div>
            <button
              onClick={handlePushToHead}
              className="push-buttons-styling"
              onMouseEnter={() => {
                setHoveredButton("pushToHead");
                setLastHoveredButton("pushToHead");
              }}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Push to Head
            </button>
            <button
              className="push-buttons-styling"
              onClick={handlePushAfterAValue}
              onMouseEnter={() => {
                setHoveredButton("pushAfterValue");
                setLastHoveredButton("pushAfterValue");
              }}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Push after a value
            </button>
            <button
              onClick={handlePushToTail}
              className="push-buttons-styling"
              onMouseEnter={() => {
                setHoveredButton("pushToTail");
                setLastHoveredButton("pushToTail");
              }}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Push to Tail
            </button>
          </div>
          <div>
            <button
              className="push-buttons-styling"
              onClick={handleDeleteHead}
              onMouseEnter={() => {
                setHoveredButton("deleteHead");
                setLastHoveredButton("deleteHead");
              }}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Delete Head
            </button>
            <button
              className="push-buttons-styling"
              onClick={handleDeleteValue}
              onMouseEnter={() => {
                setHoveredButton("deleteValue");
                setLastHoveredButton("deleteValue");
              }}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Delete value
            </button>
            <button
              className="push-buttons-styling"
              onClick={handleDeleteTail}
              onMouseEnter={() => {
                setHoveredButton("deleteTail");
                setLastHoveredButton("deleteTail");
              }}
              onMouseLeave={() => setHoveredButton(null)}
            >
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
          <div className="game-container">
            {renderBoxesAndArrows()}
            <Celebration active={celebrate} />
          </div>
          <div className="code-container">
            <h1 className="title-code-style">
              {getButtonName(lastHoveredButton)}
            </h1>
            <p className="code-style">{getAlgorithmName(lastHoveredButton)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getButtonName(button) {
  switch (button) {
    case "pushToHead":
      return "Push to Head";
    case "pushAfterValue":
      return "Push after a value";
    case "pushToTail":
      return "Push to Tail";
    case "deleteHead":
      return "Delete Head";
    case "deleteValue":
      return "Delete value";
    case "deleteTail":
      return "Delete Tail";
    default:
      return "Code";
  }
}

function getAlgorithmName(button) {
  switch (button) {
    case "pushToHead":
      return "This code pushes a node to the head of the linked list.";
    case "pushAfterValue":
      return "This code inserts a new node after a specific value in the linked list.";
    case "pushToTail":
      return "This code pushes a node to the tail of the linked list.";
    case "deleteHead":
      return "This code deletes the head node of the linked list.";
    case "deleteValue":
      return "This code deletes a node with a specific value from the linked list.";
    case "deleteTail":
      return "This code deletes the tail node of the linked list.";
    default:
      return "";
  }
}

export default LinkedListPrepLevel;
