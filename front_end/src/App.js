import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/Menu/LandingPage";
import MenuPage from "./Pages/Menu/Menu";
import FirstLevel from "../src/Pages/Stack_Level/FirstLevel"; // Import the FirstLevel component
import React, { useState } from "react";
import "./App.css";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div>
        {!isAuthenticated && <LandingPage onSignIn={handleSignIn} />}
        {isAuthenticated && (
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/first-level" element={<FirstLevel />} />{" "}
            {/* Define route to FirstLevel component */}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
