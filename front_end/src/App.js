import React, { useState } from "react";
import "./App.css";
import MenuPage from "./Pages/Menu/Menu";
import LandingPage from "./Pages/Menu/LandingPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  return (
    <div>
      {/* Only render LandingPage if the user is not authenticated */}
      {!isAuthenticated && <LandingPage onSignIn={handleSignIn} />}
      {/* Render MenuPage only if the user is authenticated */}
      {isAuthenticated && <MenuPage />}
    </div>
  );
}

export default App;
