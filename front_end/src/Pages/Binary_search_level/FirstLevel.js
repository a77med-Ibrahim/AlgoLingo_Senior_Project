import LevelsBar from "./LevelBar";
import AlgoLingoBar from "../Menu/AlgoLingoBar";
import { useDrag, useDrop } from 'react-dnd';
import React, { useState } from "react";

function DraggableNode({ id, number, onMoveNode, style }) {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'node',
      item: { id },
      collect: monitor => ({
        isDragging: !!monitor.isDragging(),
      }),
    }), [id]);
  
    const [, drop] = useDrop(() => ({
      accept: 'node',
      drop: (item) => {
        if (item.id !== id) {
          onMoveNode(item.id, id);
        }
      },
    }), [id]);
    const ref = React.useRef(null);
    drag(drop(ref));
  
    // Define the style inside the component that uses isDragging
    const nodeStyle = {
      ...style,
      opacity: isDragging ? 0.5 : 1,
      fontWeight: 'bold',
      cursor: 'move',
      width: 50,
      height: 50,
      borderRadius: '50%',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 10
      // You will need to add 'position', 'left', and 'top' properties here after calculating the positions
    };

    return (
      <div ref={ref} style={{ ...nodeStyle, opacity: isDragging ? 0.5 : 1}}>
        {number}
      </div>
    );
}

const nodePositions = [
    { x: 800, y: 300 },
    { x: 675, y: 380 },
    { x: 925, y: 380 },
    { x: 600, y: 460 },
    { x: 1000, y: 460 },
    { x: 750, y: 460 },
    { x: 850, y: 460 },
];

function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1; // Generates a random number between 1 and 100
}

const initialHeap = Array.from({ length: 7 }, (_, index) => ({
    id: index,
    number: generateRandomNumber(),
    position: nodePositions[index],
}));

function isMaxHeapFunction(heap) {
    for (let i = 0; i < heap.length; i++) {
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        if ((left < heap.length && heap[i].number < heap[left].number) ||
            (right < heap.length && heap[i].number < heap[right].number)) {
            return false;
        }
    }
    return true;
}

function isMinHeap(heap) {
    for (let i = 0; i < heap.length; i++) {
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        if ((left < heap.length && heap[i].number > heap[left].number) ||
            (right < heap.length && heap[i].number > heap[right].number)) {
            return false;
        }
    }
    return true;
}

function FirstLevel(){
    const [heap, setHeap] = useState(initialHeap);
    const [isMaxHeap, setIsMaxHeap] = useState(true); // Start with sorting a max heap
    const [taskCompleted, setTaskCompleted] = useState(false);

    function checkHeap() {
        const isValidHeap = isMaxHeap ? isMaxHeapFunction(heap) : isMinHeap(heap);
        if (isValidHeap) {
            alert(`Correct! This is a ${isMaxHeap ? "max" : "min"} heap.`);
            if (isMaxHeap) {
                setIsMaxHeap(false); // Switch to min heap
                setTaskCompleted(false); // Reset for the next task
            } else {
                setTaskCompleted(true); // Mark the min heap task as completed
            }
        } else {
            alert(`Incorrect, this is not a ${isMaxHeap ? "max" : "min"} heap. Try again.`);
        }
    }
    const moveNode = (fromId, toId) => {
        const newHeap = [...heap]; // Clone the current state to avoid direct mutation
        const fromIndex = newHeap.findIndex(node => node.id === fromId);
        const toIndex = newHeap.findIndex(node => node.id === toId);
    
        if (fromIndex < 0 || toIndex < 0) {
            console.error('Invalid indices', { fromIndex, toIndex });
            return; // Exit if no valid indices were found
        }
    
        // Swap the numbers of the two nodes
        const temp = newHeap[fromIndex].number; // Temporarily store the number from fromIndex
        newHeap[fromIndex].number = newHeap[toIndex].number; // Assign toIndex number to fromIndex
        newHeap[toIndex].number = temp; // Assign stored number to toIndex
    
        setHeap(newHeap); // Update the state
    };
  
    return (
        <div className="flexing">
            <AlgoLingoBar />
            <div className="width-of-objects">
                <h1 className="title-styling">Binary Search</h1>
                <h2 className="title-styling">Level 1</h2>
                <div className="navbar-line" />
                <LevelsBar 
                maxHeapClicked={true}
                minHeapClicked={true}
                />
                <div className="heap-container">
                    {heap.map((node, index) => (
                        <DraggableNode
                            key={node.id}
                            id={node.id}
                            number={node.number}
                            onMoveNode={moveNode}
                            style={{ position: 'absolute', left: `${node.position.x}px`, top: `${node.position.y}px` }}
                        />
                    ))}
                </div>
                <button onClick={checkHeap}>Check Heap</button>
                <p>Current task: {isMaxHeap ? "Create a Max Heap" : "Create a Min Heap"}</p>
                {taskCompleted && !isMaxHeap && <p>Well done! You've completed both tasks!</p>}
            </div>
        </div>
    );
}

export default FirstLevel;
