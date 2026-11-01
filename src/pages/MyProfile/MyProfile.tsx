import * as React from "react";
import VerticalTabs from "../../components/VerticalTabs/VerticalTabs";
import { Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import classes from "./MyProfile.module.scss";
import { useLocation, useNavigate } from "react-router-dom";

const MyProfilePage = (): React.JSX.Element => {
	const navigate = useNavigate();
	const location = useLocation();
	const requestedTab = location.state?.tab;
	const initialTab = requestedTab === 1 || requestedTab === 2 ? requestedTab : 0;
	const returnPath = typeof location.state?.from === "string" ? location.state.from : null;
	const handleBack = () => {
		if (returnPath) navigate(returnPath);
		else if (Number(window.history.state?.idx ?? 0) > 0) navigate(-1);
		else navigate("/home");
	};
	return (
		<main className={classes.page}>
			<div className={classes.content}>
				<Button className={classes.backButton} onClick={handleBack} startIcon={<KeyboardBackspaceIcon />}>
					{returnPath ? "Back to previous page" : "Back to home"}
				</Button>
				<header className={classes.heading}>
					<h1>Account settings</h1>
					<p>Manage your personal information and account preferences.</p>
				</header>
				<VerticalTabs initialTab={initialTab} />
			</div>
		</main>
	);
};

export default MyProfilePage;
