import React, { useState, useEffect } from "react";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "../Levels Bar/LevelsBar";
import "./QueuePreparationLevel.css";
import Celebration from "../../Celebration/Celebration";

function QueuePreparationLevel() {
  const [levelUnlocked, setLevelUnlocked] = useState(false);
  const [queue, setQueue] = useState([]);
  const [newIndex, setNewIndex] = useState(null);
  const [dequeueIndex, setDequeueIndex] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [enqueueClicked, setEnqueueClicked] = useState(false);
  const [dequeueClicked, setDequeueClicked] = useState(false);
  const [containerTitle, setContainerTitle] = useState("Code");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (enqueueClicked && dequeueClicked) {
      setLevelUnlocked(true);
      setCelebrate(true);
    }
  }, [enqueueClicked, dequeueClicked]);

  const enqueue = () => {
    if (queue.length < 4) {
      const newValue = Math.floor(Math.random() * 100);
      setQueue([newValue, ...queue]);
      setNewIndex(0);
      setEnqueueClicked(true);
    }
  };

  const dequeue = () => {
    if (queue.length > 0) {
      setDequeueIndex(queue.length - 1);
      setDequeueClicked(true);
    }
  };

  const handleAnimationEnd = () => {
    if (dequeueIndex !== null) {
      setQueue(queue.slice(0, dequeueIndex));
      setDequeueIndex(null);
    }
    setNewIndex(null);
  };

  return (
    <div>
      <div className="all-div">
        <AlgoLingoBar />
        <div className="other">
          <h1 className="title-styling">Queue</h1>
          <h2 className="title-styling">Preparation</h2>
          <div className="navbar-line" />
          <LevelsBar levelUnlocked={levelUnlocked} />
          <div className="queue-controls">
            <button
              className="queue-buttons-styling"
              onClick={enqueue}
              onMouseEnter={() => {
                setContainerTitle("EnQueue");
                setCode(
                  `public void enqueue(T item) {items.add(item);}
                `
                );
                setDescription(
                  "The enqueue method in the Java code initiates by creating a new node object with the provided data. It then appends this node to the end of the queue represented by the Queue class, effectively adding it as the last element. This operation executes in constant time complexity O(1), as it involves a fixed number of operations irrespective of the queue's size, facilitating rapid and efficient insertion of elements at the rear of the queue."
                );
              }}
            >
              EnQueue
            </button>
            <button
              className="queue-buttons-styling"
              onClick={dequeue}
              onMouseEnter={() => {
                setContainerTitle("DeQueue");
                setCode(
                  "public T dequeue() {if (!isEmpty()) {return items.remove(0);} else {return null;}} "
                );
                setDescription(
                  "It begins by checking if the queue is not empty using the `isEmpty` method. If the queue is not empty, it removes and returns the first item using the `remove(0)` method of the `items` list, effectively dequeuing the element. If the queue is empty, indicating there are no elements to dequeue, the method returns `null`. This operation executes in constant time complexity O(1), meaning it performs a fixed number of operations regardless of the queue's size, enabling swift and efficient removal of elements from the front of the queue."
                );
              }}
            >
              DeQueue
            </button>
          </div>
          <div className="queue-visual">
            <div className="label-enqueue">EnQueue</div>
            <div className="arrow enqueue-arrow">➜</div>
            <div className="queue">
              {queue.map((item, index) => (
                <div
                  key={index}
                  className={`queue-item ${
                    index === dequeueIndex ? "dequeue" : ""
                  } ${index === newIndex ? "enqueue" : ""}`}
                  onAnimationEnd={handleAnimationEnd}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="arrow dequeue-arrow">➜</div>
            <div className="label-dequeue">DeQueue</div>
          </div>
          <div className="queue-code-container">
            <h1 className="queue-code-description-title-style">
              {containerTitle}
            </h1>
            <h3 className="queue-prep-level-code-style">{code}</h3>
            <div className="queue-code-description-line"></div>
            <h3 className="queue-code-description">{description}</h3>
          </div>
        </div>
      </div>
      <Celebration active={celebrate} />
    </div>
  );
}

export default QueuePreparationLevel;
