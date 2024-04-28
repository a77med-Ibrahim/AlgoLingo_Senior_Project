import LevelsBar from "../LevelBar";
import AlgoLingoBar from "../../Menu/AlgoLingoBar";
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
  function heapify(heap, n, i, comparator) {
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1; // left = 2*i + 1
    const right = 2 * i + 2; // right = 2*i + 2

    // If left child exists and is greater than root
    if (left < n && comparator(heap[left].number, heap[largest].number)) {
        largest = left;
    }

    // If right child exists and is greater than largest so far
    if (right < n && comparator(heap[right].number, heap[largest].number)) {
        largest = right;
    }

    // If largest is not root
    if (largest !== i) {
        [heap[i], heap[largest]] = [heap[largest], heap[i]]; // Swap
        // Recursively heapify the affected sub-tree
        heapify(heap, n, largest, comparator);
    }
}




  const nodePositions = [
    {x: 500, y: 300},
    {x: 450, y: 380},
    {x: 550, y: 380},
    {x: 400, y: 460},
    {x: 600, y: 460},

]
   const initialHeap = [
    { id: 0, number: 5, position: nodePositions[0] },
    { id: 1, number: 3, position: nodePositions[1] },
    { id: 2, number: 8, position: nodePositions[2] },
    { id: 3, number: 1, position: nodePositions[3] },
    { id: 4, number: 4, position: nodePositions[4] },
  ];

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


function PrepLevel(){
    const [heap, setHeap] = useState([
        { id: 0, number: 5, position: { x: 500, y: 300 } },
        { id: 1, number: 3, position: { x: 450, y: 380 } },
        { id: 2, number: 8, position: { x: 550, y: 380 } },
        { id: 3, number: 1, position: { x: 400, y: 460 } },
        { id: 4, number: 4, position: { x: 600, y: 460 } },
    ]);
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
                <h2 className="title-styling">Preparation</h2>
                <div className="navbar-line" />
                <LevelsBar />
                <div className="heap-container">
                {heap.map((node, index) => {
            const position = nodePositions[index];
            const nodeStyle = {
              position: 'absolute',
              left: `${position.x}px`,
              top: `${position.y}px`,
              // ... rest of your styles
            };

            return (
              <DraggableNode
                key={node.id}
                id={node.id}
                number={node.number}
                onMoveNode={moveNode}
                style={nodeStyle}
              />
            );
          })}
                </div>
                <button onClick={checkHeap}>Check Heap</button>
                <p>Current task: {isMaxHeap ? "Create a Max Heap" : "Create a Min Heap"}</p>
                {taskCompleted && !isMaxHeap && <p>Well done! You've completed both tasks!</p>}
            </div>
        </div>
    );
}
export default PrepLevel;

