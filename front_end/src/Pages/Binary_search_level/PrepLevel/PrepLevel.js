import React, { useState, useEffect } from "react";
import LevelsBar from "../LevelBar";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import "./PrepLevel.css";

function heapify(heap, n, i, comparator) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && comparator(heap[left], heap[largest])) {
    largest = left;
  }
  if (right < n && comparator(heap[right], heap[largest])) {
    largest = right;
  }
  if (largest !== i) {
    let temp = heap[i];
    heap[i] = heap[largest];
    heap[largest] = temp;
    heapify(heap, n, largest, comparator);
  }
}

function buildHeap(heap, comparator) {
  const n = heap.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(heap, n, i, comparator);
  }
  return heap;
}

function PrepLevel() {
  const initialPositions = [
    { x: 41, y: 0 }, // Example positions in percentages
    { x: 27.75, y: 20.33 },
    { x: 55.25, y: 20.33 },
    { x: 18.75, y: 40.67 },
    { x: 36, y: 40.67 },
    { x: 48.5, y: 40.67 },
    { x: 62.5, y: 40.67 },
  ];

  const generateRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  const initialHeap = initialPositions.map((position, index) => ({
    id: index,
    number: generateRandomNumber(1, 100),
    position: position,
  }));

  const [heap, setHeap] = useState(initialHeap);
  const [maxHeapClicked, setMaxHeapClicked] = useState(false);
  const [minHeapClicked, setMinHeapClicked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (maxHeapClicked && minHeapClicked) {
    }
  }, [maxHeapClicked, minHeapClicked]);

  function handleMaxHeap() {
    setIsAnimating(true);
    const newHeap = buildHeap([...heap], (a, b) => a.number > b.number);
    animateHeap(newHeap, () => setMaxHeapClicked(true));
  }

  function handleMinHeap() {
    setIsAnimating(true);
    const newHeap = buildHeap([...heap], (a, b) => a.number < b.number);
    animateHeap(newHeap, () => setMinHeapClicked(true));
  }

  function animateHeap(newHeap, callback) {
    const animations = [];
    for (let i = 0; i < newHeap.length; i++) {
      animations.push({
        id: newHeap[i].id,
        position: initialPositions[i],
      });
    }
    animations.forEach((animation, index) => {
      setTimeout(() => {
        setHeap((prevHeap) => {
          const updatedHeap = prevHeap.map((node) =>
            node.id === animation.id
              ? { ...node, position: animation.position }
              : node
          );
          return updatedHeap;
        });
        if (index === animations.length - 1) {
          setIsAnimating(false);
          if (callback) callback();
        }
      }, index * 500);
    });
  }

  return (
    <div className="flexing">
      <AlgoLingoBar />
      <div className="width-of-objects">
        <h1 className="title-styling">Binary Search</h1>
        <h2 className="title-styling">Preparation</h2>
        <div className="navbar-line" />
        <LevelsBar
          maxHeapClicked={maxHeapClicked}
          minHeapClicked={minHeapClicked}
        />
        <div
          className="heap-container"
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          {heap.map((node) => {
            const nodeStyle = {
              position: "absolute",
              left: `${node.position.x}%`,
              top: `${node.position.y}%`,
              transition: "left 0.5s ease, top 0.5s ease",
            };
            return (
              <div key={node.id} style={nodeStyle}>
                <div
                  style={{
                    opacity: 1,
                    fontWeight: "bold",
                    cursor: "default",
                    width: "5vw", // using viewport width for responsive size
                    height: "5vw", // same as width to maintain aspect ratio
                    borderRadius: "50%",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "1vw",
                  }}
                >
                  {node.number}
                </div>
              </div>
            );
          })}
          <div className="buttons-placement">
            <button
              onClick={handleMaxHeap}
              disabled={isAnimating}
              className="prep-heap-level-buttons"
            >
              Create Max Heap
            </button>
            <button
              onClick={handleMinHeap}
              disabled={isAnimating}
              className="prep-heap-level-buttons"
            >
              Create Min Heap
            </button>
          </div>
          {maxHeapClicked && <p>Max heap created successfully!</p>}
          {minHeapClicked && <p>Min heap created successfully!</p>}
        </div>
      </div>
    </div>
  );
}

export default PrepLevel;
