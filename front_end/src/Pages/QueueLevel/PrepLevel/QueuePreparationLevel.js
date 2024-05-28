import React, { useState, useEffect } from "react";
import "./QueuePreparationLevel.css";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import LevelsBar from "./Levels Bar/LevelsBar";

function QueuePreparationLevel() {
  const [queue, setQueue] = useState([]);
  const [dequeueing, setDequeueing] = useState(false);
  const [hoveredButton, setHoveredButton] = useState("");
  const [levelUnlocked, setLevelUnlocked] = useState(false);
  const [ItemsAdded, setItemsAdded] = useState(false);
  const [firstEmpty, setFirstEmpty] = useState(false);

  const handleEnQueue = () => {
    const newValue = Math.floor(Math.random() * 100) + 1; // Generate random value
    setQueue((prevQueue) => [newValue, ...prevQueue]);
    setItemsAdded(true);
  };

  const handleDeQueue = () => {
    if (queue.length > 0 && !dequeueing) {
      setDequeueing(true);
      setTimeout(() => {
        setQueue((prevQueue) => prevQueue.slice(0, -1));
        setDequeueing(false);
        if (queue.length === 1){
          setFirstEmpty(true);
        }
      }, 500); // Adjust this duration to match the CSS animation duration
    }
  };


  useEffect(() => {
    if (ItemsAdded && queue.length === 0 && !firstEmpty){
      setFirstEmpty(true);
    }
    setLevelUnlocked(firstEmpty);
  }, [queue, ItemsAdded,firstEmpty]);

  const explanations = {
    enqueue: {
      explanation: "Enqueue adds a new element to the end of the queue.",
      code: `enqueue(value) {
  this.queue.push(value);
}`,
    },
    dequeue: {
      explanation: "Dequeue removes the element from the front of the queue.",
      code: `dequeue() {
  return this.queue.shift();
}`,
    },
  };

  return (
    <div className="flexing">
      <AlgoLingoBar />
      <div className="width-of-objects">
        <h1 className="title-styling">Queue</h1>
        <h2 className="title-styling">Preparation</h2>
        <div className="navbar-line" />
        <LevelsBar 
        levelUnlocked = {levelUnlocked}
        />
        <div className="flexing">
          <div className="queue-button-group">
            <button
              onClick={handleEnQueue}
              onMouseEnter={() => setHoveredButton("enqueue")}
              onMouseLeave={() => setHoveredButton("")}
              disabled={queue.length >= 10} // Disable button if queue is full

            >
              EnQueue
            </button>
            <button
              onClick={handleDeQueue}
              onMouseEnter={() => setHoveredButton("dequeue")}
              onMouseLeave={() => setHoveredButton("")}
            >
              DeQueue
            </button>
          </div>
        </div>
        <div className="queue-container">
          {queue.map((value, index) => (
            <div
              key={index}
              className={`queue-element ${dequeueing && index === queue.length - 1 ? 'dequeue' : ''}`}
            >
              {value}
            </div>
          ))}
        </div>
        <div className="code-container">
          {hoveredButton && (
            <>
              <pre>{explanations[hoveredButton].code}</pre>
              <p style={{ color: "red" }}>{explanations[hoveredButton].explanation}</p>
            </>
          )}
           {levelUnlocked && (
            <p style={{ color: "black" }}>The queue is empty. You can proceed.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QueuePreparationLevel;
