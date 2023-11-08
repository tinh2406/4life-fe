import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";

export interface ProtectedRouteProps {
	children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const user = useSelector((state: RootState) => state.auth.login.currentUser);
	const navigate = useNavigate();
	// const isAllowed = !allowedRoles || allowedRoles.some(allowedRole => user?.roles.includes(allowedRole));

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
		// } else if (!isAllowed) {
		// 	navigate("/not-found");
		// }
	}, [user, navigate]);
	return <>{children}</>;
};

export const ProtectedAuthen = ({ children }: ProtectedRouteProps) => {
	const user = useSelector((state: RootState) => state.auth.login.currentUser);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user, navigate]);
	return <>{children}</>;
};
