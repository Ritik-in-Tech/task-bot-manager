import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AuthGuard;
