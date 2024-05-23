import { useNavigate } from "react-router-dom";
import stackImage from "./Img/stackImg.png";
import queueImage from "./Img/queueImg.png";
import linkedList from "./Img/LL.png";
import AlgoLingoBar from "./AlgoLingoBar";
import Heap from "./Img/Heap1.png";
import "./Menu.css";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firebaseAuth, db } from "./firebaseConfig";

function Menu() {
  const [activeCircle, setActiveCircle] = useState(null);
  const [lastClickedCircle, setLastClickedCircle] = useState(null);
  const [definitionOfLevel, setDefinitionOfLevel] = useState("");
  const [nameOfLevel, setNameOfLevel] = useState("");

  const [circleData, setCircleData] = useState([
    { id: 1, top: "60px", left: "90px", isOpen: true, image: stackImage },
    { id: 2, top: "150px", left: "-40px", isOpen: true, image: queueImage },
    {
      id: 3,
      top: "220px",
      left: "-20px",
      isOpen: true,
      image: linkedList,
      size: "small",
    },
    { id: 4, top: "300px", left: "-175px", isOpen: true, image: Heap },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (firebaseAuth.currentUser) {
      const userId = firebaseAuth.currentUser.uid;
      const userDocRef = doc(db, "progress", userId);
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userProgress = docSnap.data();
            updateLevels(userProgress);
          } else {
            // Handle the case where there is no data
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error fetching user progress:", error);
        });
    }
  }, [firebaseAuth, db]);

  const updateLevels = (userProgress) => {
    const updatedCircles = circleData.map((circle) => ({
      ...circle,
      isOpen: userProgress[circle.id] ? userProgress[circle.id].isOpen : false,
    }));
    setCircleData(updatedCircles);
  };

  const isLevelUnlocked = (circleId) => {
    const circle = circleData.find((circle) => circle.id === circleId);
    return circle.isOpen;
  };

  const handleCircleClick = (circleId) => {
    setActiveCircle(activeCircle === circleId ? null : circleId);
    setLastClickedCircle(circleId);
    if (circleId === 1) {
      setNameOfLevel("Stack");
      setDefinitionOfLevel(
        'A stack is a linear data structure in which elements are added and removed from only one end, called the "top" of the stack, following the Last In, First Out (LIFO) principle. This means that the most recently added element is the first one to be removed. Basic operations for a stack include `push`, which adds an element to the top, `pop`, which removes the top element, and `peek`, which shows the values inside of the Stack. Stacks are commonly used in scenarios such as expression evaluation, syntax parsing, and maintaining function calls (call stack) in programming languages. They are typically implemented using arrays or linked lists.'
      );
    } else if (circleId === 2) {
      setNameOfLevel("Queue");
      setDefinitionOfLevel(
        'A queue is a linear data structure that follows the First In, First Out (FIFO) principle, where elements are added at one end, called the "rear," and removed from the other end, called the "front." This means that the element added earliest is the first to be removed. The basic operations of a queue include `enqueue`, which adds an element to the rear, and `dequeue`, which removes an element from the front. Queues are widely used in various applications such as scheduling processes in operating systems, handling requests in web servers, and managing tasks in asynchronous data processing. They can be implemented using arrays, linked lists.'
      );
    } else if (circleId === 3) {
      setNameOfLevel("Linked List");
      setDefinitionOfLevel(
        "A linked list is a fundamental data structure in computer science used to organize data in a linear sequence, where each element, called a node, contains a data value and a reference (or pointer) to the next node in the sequence. Operations on linked lists include pushing to the head, where a new node is inserted at the beginning of the list, deleting the head, which removes the first node, push after a given value, inserting a new node immediately after a specified node, delete  by value, removing the first node that contains a specified value, push to tail involves adding a new node at the end of the list, delete tail requires removing the last node. These operations make linked lists versatile and dynamic structures suitable for various applications."
      );
    } else if (circleId === 4) {
      setNameOfLevel("Heap sort");
      setDefinitionOfLevel(
        "Heap sort is a comparison-based sorting algorithm that uses a binary heap data structure to create a sorted array. It begins by building a max heap from the input data, where the largest element is at the root of the heap. The heap property ensures that each parent node is greater than or equal to its child nodes, and the reverse is true for a min heap, where the smallest element is at the root."
      );
    } else {
      setDefinitionOfLevel("");
    }
  };

  const handleStartButtonClick = () => {
    if (lastClickedCircle && isLevelUnlocked(lastClickedCircle)) {
      if (lastClickedCircle === 1) {
        navigate("/preperation-level");
      } else if (lastClickedCircle === 2) {
        alert("Second level is not complete yet");
        // navigate("/queue-preparation");
      } else if (lastClickedCircle === 3) {
        navigate("/LinkedListPrepLevel");
      } else if (lastClickedCircle === 4) {
        navigate("/PrepLevel");
      }
    }
  };

  return (
    <div className="main-div">
      <AlgoLingoBar />
      <div className="levels-bar">
        <button className="levels-button">levels</button>
        <div className="levels-space">
          {circleData.map((circle) => (
            <button
              key={circle.id}
              className={`circles ${circle.isOpen ? "" : "closed"}`}
              style={{ top: circle.top, left: circle.left }}
              onClick={() => handleCircleClick(circle.id)}
            >
              {circle.isOpen ? circle.id : "X"}
            </button>
          ))}
        </div>
      </div>
      <div className="start-bar">
        <div className={`image-container ${activeCircle ? "visible" : ""}`}>
          {activeCircle && circleData[activeCircle - 1].image && (
            <img
              className="image"
              src={circleData[activeCircle - 1].image}
              alt={`Circle ${activeCircle} Image`}
            />
          )}
        </div>
        {nameOfLevel && <h1 className="level-name">{nameOfLevel}</h1>}
        {definitionOfLevel && (
          <p className="level-definition">{definitionOfLevel}</p>
        )}
        <button
          onClick={handleStartButtonClick}
          className={`start-button ${
            activeCircle && isLevelUnlocked(activeCircle) ? "" : "locked"
          }`}
        >
          start
        </button>
      </div>
    </div>
  );
}

export default Menu;
