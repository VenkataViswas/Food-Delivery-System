import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const username = localStorage.getItem("username");

  if (!username) {
    // If the username is not set, redirect to the login page
    return <Navigate to="/login" replace />;
  }


  // If the username is set, render the requested component
  return element;
};

export default ProtectedRoute;
