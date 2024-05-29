import React, { useState, useEffect } from "react";
import LevelsBar from "../LevelBar";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
import Celebration from "../../Celebration/Celebration";
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
    { x: 41, y: 0 },
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
  const [celebrate, setCelebrate] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [lastHoveredButton, setLastHoveredButton] = useState(null);

  useEffect(() => {
    if (maxHeapClicked && minHeapClicked) {
      setCelebrate(true);
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
        <div className="main-container">
          <div className="heap-container-prep-level">
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
                      width: "5vw",
                      height: "5vw",
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
                onMouseEnter={() => {
                  setHoveredButton("createMaxHeap");
                  setLastHoveredButton("createMaxHeap");
                }}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Create Max Heap
              </button>
              <button
                onClick={handleMinHeap}
                disabled={isAnimating}
                className="prep-heap-level-buttons"
                onMouseEnter={() => {
                  setHoveredButton("createMinHeap");
                  setLastHoveredButton("createMinHeap");
                }}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Create Min Heap
              </button>
            </div>

            {maxHeapClicked && <p>Max heap created successfully!</p>}
            {minHeapClicked && <p>Min heap created successfully!</p>}
          </div>
          <div className="heap-code-container">
            <h1 className="heap-code-description-title-style ">
              {getButtonName(lastHoveredButton)}
            </h1>
            <h3 className="heap-prep-level-code-style">
              {/* {getCode(lastHoveredButton)} */}
            </h3>
            <div className="heap-code-description-line "></div>
            <h3 className="heap-code-description ">
              {getAlgorithmName(lastHoveredButton)}
            </h3>
          </div>
        </div>

        <Celebration active={celebrate} />
      </div>
    </div>
  );
}
function getButtonName(button) {
  switch (button) {
    case "createMaxHeap":
      return "Create Max Heap";
    case "createMinHeap":
      return "Create Min Heap";
    default:
      return "Code";
  }
}
function getCode(button) {
  switch (button) {
    case "createMaxHeap":
      return "public int extractMax() {if (isEmpty())throw new IllegalStateException('Heap is empty');int max = heap.get(0);int lastElement = heap.remove(heap.size() - 1);if (!isEmpty()) {heap.set(0, lastElement);heapifyDown(0);}return max;}private void heapifyUp(int index) {int parentIndex = (index - 1) / 2;while (index > 0 && heap.get(parentIndex) < heap.get(index)) {swap(parentIndex, index);index = parentIndex;parentIndex = (index - 1) / 2;}}private void swap(int i, int j) {int temp = heap.get(i);heap.set(i, heap.get(j));heap.set(j, temp);}";
    case "createMinHeap":
      return "Create Min Heap";
    default:
      return "Code";
  }
}

function getAlgorithmName(button) {
  switch (button) {
    case "createMaxHeap":
      return " It begins by checking if the heap is empty; if so, it returns. If not empty, it retrieves the maximum element from the root of the heap and replaces it with the last element. Then, it calls a heapifyDown operation to maintain the max heap property by recursively swapping the element with its largest child until the heap is properly ordered. Additionally, the code includes private helper methods, heapifyUp and swap, for maintaining the max heap property during insertion and swapping elements, respectively. Overall, this code provides an efficient means to extract the maximum element from a max heap while ensuring the integrity of the heap structure.";
    case "createMinHeap":
      return " It starts by verifying if the heap is empty; if so, it returns. If the heap is not empty, it retrieves the minimum element from the root of the heap and replaces it with the last element. Subsequently, it executes a heapifyDown operation to maintain the min heap property by iteratively swapping the element with its smallest child until the heap is appropriately ordered. Additionally, the code includes private helper methods `heapifyUp` and `swap` to maintain the min heap property during insertion and element swapping, respectively. Overall, this code facilitates efficient extraction of the minimum element from a min heap while ensuring the integrity of the heap structure.";
    default:
      return "";
  }
}

export default PrepLevel;
