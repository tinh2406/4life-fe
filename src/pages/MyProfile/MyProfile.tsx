import * as React from "react";
import VerticalTabs from "../../components/VerticalTabs/VerticalTabs";
import { Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import classes from "./MyProfile.module.scss";
import { useNavigate } from "react-router-dom";

const MyProfilePage = (): React.JSX.Element => {
	const navigate = useNavigate();
	return (
		<main className={classes.page}>
			<div className={classes.content}>
				<Button className={classes.backButton} onClick={() => navigate("/home")} startIcon={<KeyboardBackspaceIcon />}>
					Back to home
				</Button>
				<header className={classes.heading}>
					<h1>Account settings</h1>
					<p>Manage your personal information and account preferences.</p>
				</header>
				<VerticalTabs />
			</div>
		</main>
	);
};

export default MyProfilePage;
