import type React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store";

const AuthGuard: React.FC = () => {
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated,
	);
	if (!isAuthenticated) {
		return <Navigate to="/" replace />;
	}
	return <Outlet />;
};

export default AuthGuard;
