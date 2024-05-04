import { useNavigate } from "react-router-dom";
import stackImage from "./Img/stackImg.webp";
import queueImage from "./Img/queueImg.png";
import linkedList from "./Img/LL.png";
import AlgoLingoBar from "./AlgoLingoBar";
import "./Menu.css";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firebaseAuth, db } from "./firebaseConfig"; // Ensure these are correctly imported from your config file

function Menu() {
  const [activeCircle, setActiveCircle] = useState(null);
  const [lastClickedCircle, setLastClickedCircle] = useState(null);

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
    { id: 4, top: "300px", left: "-175px", isOpen: true, image: null },
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
  }, [firebaseAuth, db]); // Dependencies in the useEffect should be checked if they are necessary

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
  };

  const handleStartButtonClick = () => {
    if (lastClickedCircle && isLevelUnlocked(lastClickedCircle)) {
      if (lastClickedCircle === 1) {
        navigate("/preperation-level");
      } else if (lastClickedCircle === 2) {
        alert("Second level is not complete yet");
        // navigate("/queue-preparation");
      }
    }
  };

  return (
    <div className="main-div">
      <AlgoLingoBar />
      <div className="levels-bar">
        <button className="levels-button">Levels</button>
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
        <button
          onClick={handleStartButtonClick}
          className={`start-button ${
            activeCircle && isLevelUnlocked(activeCircle) ? "" : "locked"
          }`}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Menu;
