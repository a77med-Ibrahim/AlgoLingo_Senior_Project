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
import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";
import { useAuth } from "./AuthContext";
import axios from "axios";

function Menu() {
  const [activeCircle, setActiveCircle] = useState(null);
  const [lastClickedCircle, setLastClickedCircle] = useState(null);
  const [definitionOfLevel, setDefinitionOfLevel] = useState("");
  const [nameOfLevel, setNameOfLevel] = useState("");
  const [userData, setUserData] = useState(null);
  const { currentUser } = useAuth();
  const auth = getAuth(firebaseApp);
  const[userLevelData, setUserLevelData] = useState(null);
  const [circleData, setCircleData] = useState([
    { id: 1, top: "10px", left: "210px", isOpen: true, image: stackImage },
    { id: 2, top: "90px", left: "100px", isOpen: true, image: queueImage },
    { id: 3, top: "170px", left: "-10px", isOpen: true, image: linkedList },
    { id: 4, top: "270px", left: "-40px", isOpen: true, image: Heap },
    { id: 5, top: "350px", left: "-60px", isOpen: false },
    { id: 6, top: "430px", left: "-80px", isOpen: false },
    { id: 7, top: "510px", left: "-200px", isOpen: false },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.log("User document does not exist");
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const updateLevels = (userProgress) => {
    const { completedLevels } = userProgress;

    const updatedCircles = circleData.map((circle, index) => {
      if (index === 0) {
        return { ...circle, isOpen: true };
      }

      const prevLevel = circleData[index - 1];
      const prevLevelKey = `Level${prevLevel.id}`;

      return {
        ...circle,
        isOpen: completedLevels[prevLevelKey] || false,
      };
    });

    setCircleData(updatedCircles);
  };

  const fetchUserLevelData = async (section, level) => {
    if (currentUser) {
      try {
        const response = await axios.get("http://localhost:5000/get_user_level_data", {
          params: {
            userId: currentUser.uid,
            section: section,
            level: level
          }
        });

        setUserLevelData(prevData => ({
          ...prevData,
          [level]: response.data
        }));
      } catch (error) {
        console.error(`Error retrieving data for ${section} - ${level}:`, error);
      }
    }
  };

  useEffect(() => {
    fetchUserLevelData("Stack_Level", "FirstLevel");
    fetchUserLevelData("Stack_Level", "SecondLevel");
    fetchUserLevelData("Stack_Level", "ThirdLevel");
    fetchUserLevelData("QueueLevel", "queueFirstLevel");
    fetchUserLevelData("QueueLevel", "queueSecondLevel");    
    fetchUserLevelData("LinkedList", "LinkedFirstLevel");
    fetchUserLevelData("LinkedList", "LinkedSecondLevel");
    fetchUserLevelData("Binary_search_level", "BSLevel2");
    fetchUserLevelData("Binary_search_level", "BinaryFirstLevel");
  }, [currentUser]);

  const isLevelUnlocked = (circleId) => {
    const circle = circleData.find((circle) => circle.id === circleId);

    const sectionKey = `Section${circle.id}`;

    if (circle.id === 1) {
      return true;
    } else if (circle.id === 2) {
      return userLevelData?.ThirdLevel.status;
    } else if (circle.id === 3) {
      return userLevelData?.queueSecondLevel.status;
    } else if (circle.id === 4) {
      return userLevelData?.LinkedSecondLevel.status;
    }

    return circle.isOpen && userData?.Sections?.[sectionKey];
  };

  const handleCircleClick = (circleId) => {
    if (activeCircle === circleId) {
      setActiveCircle(null);
      setDefinitionOfLevel("");
      setNameOfLevel("");
    } else {
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
      } else if (circleId === 5 || 6 || 7) {
        setNameOfLevel("");
        setDefinitionOfLevel("");
      }
    }
  };

  const handleStartButtonClick = () => {
    if (activeCircle && isLevelUnlocked(lastClickedCircle)) {
      if (lastClickedCircle === 1) {
        navigate("/preperation-level");
      } else if (lastClickedCircle === 2) {
        navigate("/queue-preparation");
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
        <h1 className="levels-button">levels</h1>
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
          {/* <h2 className="sorting-line">--------sorting--------</h2> */}
        </div>
      </div>
      <div className="start-bar">
        {!activeCircle && (
          <p className="default-message">
            Click on a level to start your
            <br></br>
            algorithmic journey.
          </p>
        )}
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
        {activeCircle && (
          <button
            onClick={handleStartButtonClick}
            className={`start-button ${
              activeCircle && isLevelUnlocked(activeCircle) ? "" : "locked"
            }`}
          >
            start
          </button>
        )}
      </div>
    </div>
  );
}

export default Menu;
