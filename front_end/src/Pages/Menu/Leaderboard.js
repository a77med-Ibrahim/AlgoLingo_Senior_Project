import React, { useEffect, useState } from "react";
import axios from "axios";
import AlgoLingoBar from "./AlgoLingoBar";
import "./Leaderboard.css";
import { useAuth } from "../Menu/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userLevelData, setUserLevelData] = useState(null);
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.log("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

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

  const calculateTotalPoints = () => {
    let totalPoints = 0;
    if (userLevelData) {
      const levelsWithData = Object.values(userLevelData).filter(level => level !== null && level !== undefined);
      for (const level of levelsWithData) {
        totalPoints += level.score || 0;
      }
    }
    return totalPoints;
  };

  const updateLeaderboard = async () => {
    if (currentUser && userData) {
      try {
        const totalPoints = calculateTotalPoints();
        await axios.post("http://localhost:5000/update_leaderboard", {
          userId: currentUser.uid,
          userName: userData.name || "Null",
          totalPoints: totalPoints,
        });
      } catch (error) {
        console.error("Error updating leaderboard:", error);
      }
    }
  };

  useEffect(() => {
    updateLeaderboard();
  }, [userLevelData, userData]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_leaderboard");
        const sortedLeaderboard = response.data.sort((a, b) => b.totalPoints - a.totalPoints); 
        setLeaderboard(sortedLeaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, []);

  const getCupIcon = (index) => {
    switch (index) {
      case 0:
        return "🏆"; 
      case 1:
        return "🥈"; 
      case 2:
        return "🥉"; 
      default:
        return null;
    }
  };

  return (
    <div className="main-div">
      <AlgoLingoBar />
      <div className="leaderboard-container">
        <h1 className="leaderboardname">Leaderboard</h1>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={index}>
                <td className="rank-cell">{index + 1} {getCupIcon(index)}</td>
                <td>{user.userName}</td>
                <td>{user.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    

    </div>
 
  );
};

export default Leaderboard;
