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
                style={{ width: "230px" }}
                className="linkedlist-first-level-input-field"
                placeholder="Enter the value to insert after"
              />
              <input
                type="number"
                value={value2}
                onChange={handleChange2}
                style={{ width: "210px" }}
                className="linkedlist-first-level-input-field"
                placeholder="Enter the new node value"
              />

              <button type="submit" className="push-buttons-styling">
                Submit
              </button>
            </form>
          )}
          {isDeleteInputVisible && (
            <form onSubmit={handleDeleteSubmit}>
              <input
                type="number"
                value={deleteValue}
                onChange={handleDeleteChange}
                style={{ width: "200px" }}
                className="linkedlist-first-level-input-field"
                placeholder="Enter the value to delete"
              />
              <button type="submit" className="push-buttons-styling">
                Submit
              </button>
            </form>
          )}
          <p>Number Of Nodes: {numberOfBoxes}</p>
          <div className="game-container">
            {renderBoxesAndArrows()}
            <Celebration active={celebrate} />
          </div>
          <div className="linked-list-code-container">
            <h1 className="code-description-title-style">
              {getButtonName(lastHoveredButton)}
            </h1>
            <h3 className="linked-list-prep-level-code-style">
              {getAlgorithmCode(lastHoveredButton)}
            </h3>
            <div className="code-description-line"></div>
            <h3 className="linked-list-code_description">
              {getAlgorithmDescription(lastHoveredButton)}
            </h3>
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

function getAlgorithmCode(button) {
  switch (button) {
    case "pushToHead":
      return "public void pushToHead(int data) {\n    Node newNode = new Node(data);\n    newNode.next = head;\n    head = newNode;\n}";
    case "pushAfterValue":
      return "public void pushAfterValue(int valueToInsertAfter, int data) {Node newNode = new Node(data);Node current = head;while (current != null && current.data != valueToInsertAfter) {current = current.next;}if (current != null) {newNode.next = current.next;current.next = newNode;}}";
    case "pushToTail":
      return "public void pushToTail(int data) {Node newNode = new Node(data);if (head == null) {head = newNode;} else {Node current = head;while (current.next != null) {current = current.next;}current.next = newNode;}}";
    case "deleteHead":
      return "public void deleteHead() {if (head != null) {head = head.next;}}";
    case "deleteValue":
      return "public void deleteValue(int valueToDelete) {if (head == null) {return;}if (head.data == valueToDelete) {head = head.next; return;}Node current = head;while (current.next != null && current.next.data != valueToDelete) {current = current.next;}if (current.next != null) {current.next = current.next.next;}}";
    case "deleteTail":
      return "public void deleteTail() {if (head == null || head.next == null) {head = null; } else {Node current = head;while (current.next.next != null) {current = current.next;}current.next = null; }}";
    default:
      return "";
  }
}
function getAlgorithmDescription(button) {
  switch (button) {
    case "pushToHead":
      return "It begins by creating a new node object with the given data, setting its next reference to point to the current head of the list, effectively linking it as the new first element. Subsequently, the head pointer is updated to reference this new node, thereby making it the head of the list. This method executes in constant time complexity O(1), as it performs a fixed number of operations regardless of the size of the linked list, facilitating fast and efficient insertion of elements at the beginning of the list.";
    case "pushAfterValue":
      return "It starts by traversing the list until it finds the node containing the specified value, then it creates a new node with the given data. Once the node is found, the new node is inserted after it by adjusting the next references accordingly. If the specified value is not found, or if the list is empty, the insertion operation is not performed. This method enables efficient insertion after a specific value, preserving the integrity of the linked list structure. It operates in linear time complexity O(n) due to the traversal required to find the specified value.";
    case "pushToTail":
      return "Starting with the creation of a new node object with the given data, it then traverses the list until it reaches the last node. Upon reaching the tail, it sets the next reference of the current last node to point to the newly created node, effectively appending it to the end of the list. If the list is initially empty, the new node becomes the head of the list. This operation ensures efficient insertion of elements at the tail of the linked list, maintaining its integrity. It operates in linear time complexity O(n), where n is the number of nodes in the list.";
    case "deleteHead":
      return "It begins by checking if the list is not empty, ensuring there is at least one node to delete. If the list is not empty, it updates the head pointer to point to the next node in the list, effectively removing the current head. This operation executes in constant time complexity O(1), as it performs a fixed number of operations regardless of the size of the linked list. It provides a straightforward and efficient means of maintaining the integrity of the linked list structure while efficiently handling the deletion of the first node.";
    case "deleteValue":
      return "It first checks if the list is empty; if so, it returns immediately. If the value to delete is found at the head of the list, it moves the head to the next node. Otherwise, it traverses the list until it reaches the node before the one containing the value to delete. Once found, it skips the node containing the value to delete by adjusting the next reference of the preceding node. This method efficiently handles the deletion of a specific value while maintaining the integrity of the linked list structure. It operates in linear time complexity O(n) due to the traversal required to find the specified value.";
    case "deleteTail":
      return "If the list is either empty or contains only one node, it sets the head to null. Otherwise, it traverses the list until it reaches the second-to-last node. Upon reaching this node, it sets its next reference to null, effectively removing the last node from the list. This operation ensures the integrity of the linked list structure while efficiently handling the deletion of the tail node. It operates in linear time complexity O(n) due to the traversal required to reach the second-to-last node.";
    default:
      return "";
  }
}

export default LinkedListPrepLevel;
