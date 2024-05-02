import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/Menu/LandingPage";
import MenuPage from "./Pages/Menu/Menu";
import PreperationLevel from "./Pages/Stack_Level/PreperationLevel/PreperationLevel";
import React, { useState } from "react";
import FirstLevel from "./Pages/Stack_Level/FirstLevel";
import RegisterPage from "./Pages/Menu/RegisterPage";
import SecondLevel from "./Pages/Stack_Level/SecondLevel";
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
            path="/preperation-level/second-level"
            element={<SecondLevel />}
          />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
