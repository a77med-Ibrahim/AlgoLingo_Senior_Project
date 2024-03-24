import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/Menu/LandingPage";
import MenuPage from "./Pages/Menu/Menu";
import PreperationLevel from "./Pages/Stack_Level/PreperationLevel/PreperationLevel";
import React, { useState } from "react";
import FirstLevel from "./Pages/Stack_Level/FirstLevel";

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
        {!isAuthenticated && <LandingPage onSignIn={handleSignIn} />}

        {/* Render MenuPage and other routes if authenticated */}
        {isAuthenticated && (
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/preperation-level/" element={<PreperationLevel />} />
            <Route
              path="/preperation-level/first-level"
              element={<FirstLevel />}
            />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
