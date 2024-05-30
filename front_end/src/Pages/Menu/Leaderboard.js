import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Menu/firebaseConfig";
import AlgoLingoBar from "./AlgoLingoBar";
import "./Leaderboard.css";
<style>
import url('https://fonts.cdnfonts.com/css/60s-scoreboard');
</style>

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => {
        const data = doc.data();
        const totalPoints = Object.values(data.Points || {}).reduce(
          (sum, points) => sum + points,
          0
        );
        return {
          name: data.name || "Unknown",
          email: data.email || "No email",
          totalPoints,
        };
      });

      usersList.sort((a, b) => b.totalPoints - a.totalPoints);
      setLeaderboard(usersList);
    };

    fetchLeaderboardData();
  }, []);

  const getCupIcon = (index) => {
    switch (index) {
      case 0:
        return "  🏆"; 
      case 1:
        return "  🥈"; 
      case 2:
        return "  🥉"; 
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
                <td className="rank-cell" >{index + 1} {getCupIcon(index)}</td>
                <td>{user.name}</td>
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
