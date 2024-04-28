import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/Menu/LandingPage";
import MenuPage from "./Pages/Menu/Menu";
import PreperationLevel from "./Pages/Stack_Level/PreperationLevel/PreperationLevel";
import React, { useState } from "react";
import FirstLevel from "./Pages/Stack_Level/FirstLevel";
import RegisterPage from "./Pages/Menu/RegisterPage";
import QueuePreparationLevel from "./Pages/QueueLevel/PrepLevel/QueuePreparationLevel";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Change initial state to false

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div>
        {/* Render LandingPage if not authenticated */}
        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <LandingPage onSignIn={handleSignIn} />
              ) : (
                <MenuPage />
              )
            }
          />
          <Route path="/preperation-level/" element={<PreperationLevel />} />
          <Route
            path="/preperation-level/first-level"
            element={<FirstLevel />}
          />
          <Route
            path="/queue-preparation/"
            element={<QueuePreparationLevel />}
          />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
