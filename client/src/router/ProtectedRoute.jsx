import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // const navigate = useNavigate();
  if (!localStorage.getItem("accessToken")) {
    // navigate("/login");
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}
