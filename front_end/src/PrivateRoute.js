import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './Pages/Menu/AuthContext'; 

const PrivateRoute = ({ element, ...props }) => {
  const { currentUser } = useAuth(); 

  return currentUser ? (
    <Route {...props} element={element} />
  ) : (
    <Navigate to="/" /> 
  );
};

export default PrivateRoute;
