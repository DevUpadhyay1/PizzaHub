// components/routes/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // or from context
  const isAdmin = user && user.role === "admin";
  console.log(localStorage.getItem("user"));
  return isAdmin ? children : <Navigate to="/login" replace />;
};

export default AdminRoute;
