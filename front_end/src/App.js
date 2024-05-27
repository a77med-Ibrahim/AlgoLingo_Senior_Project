import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LandingPage from "./Pages/Menu/LandingPage";
import MenuPage from "./Pages/Menu/Menu";
import PreperationLevel from "./Pages/Stack_Level/PreperationLevel/PreperationLevel";
import FirstLevel from "./Pages/Stack_Level/FirstLevel";
import ThirdLevel from "./Pages/Stack_Level/ThirdLevel";
import RegisterPage from "./Pages/Menu/RegisterPage";
import SecondLevel from "./Pages/Stack_Level/SecondLevel";
import QueuePreparationLevel from "./Pages/QueueLevel/PrepLevel/QueuePreparationLevel";
import LinkedListPrepLevel from "./Pages/LinkedList/Prep/LinkedListPrepLevel";
import PrepLevel from "./Pages/Binary_search_level/PrepLevel/PrepLevel";
import LevelOne from "./Pages/Binary_search_level/FirstLevel";
import BSLevel2 from "./Pages/Binary_search_level/BSLevel2";
import "./App.css";
import LinkedListFirstLevel from "./Pages/LinkedList/FirstLevel/LinkedListFirstLevel";
import LinkedListSecondLevel from "./Pages/LinkedList/SecondLevel/LinkedListSecondLevel";
import QueueFirstLevel from "./Pages/QueueLevel/queueFirstLevel";
import QueueSecondLevel from "./Pages/QueueLevel/queueSecondLevel";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firebaseConfig } from './Pages/Menu/firebaseConfig';


// Initialize Firebase
firebase.initializeApp(firebaseConfig);


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };



  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div>
          <Routes>
            <Route path="/menu" element={<MenuPage />} />
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
            <Route path="/LandingPage" element={<LandingPage />} />
            <Route path="/preperation-level/first-level" element={<FirstLevel />} />
            <Route path="/preperation-level/third-level" element={<ThirdLevel />} />
            <Route path="/queuefirstlevel" element={<QueueFirstLevel />} />
            <Route path="/queueSecondLevel" element={<QueueSecondLevel />} />
            <Route path="/preperation-level/" element={<PreperationLevel />} />
            <Route path="/LinkedListFirstLevel" element={<LinkedListFirstLevel />} />
            <Route path="/LinkedListSecondLevel" element={<LinkedListSecondLevel />} />
            <Route path="/preperation-level/second-level" element={<SecondLevel />} />
            <Route path="/queue-preparation/" element={<QueuePreparationLevel />} />
            <Route path="/LinkedListPrepLevel" element={<LinkedListPrepLevel />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/PrepLevel" element={<PrepLevel />} />
            <Route path="/FirstLevel" element={<LevelOne />} />
            <Route path="/BSLevel2" element={<BSLevel2 />} />
          </Routes>
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;
