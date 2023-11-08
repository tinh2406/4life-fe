import * as React from "react";
import VerticalTabs from "../../components/VerticalTabs/VerticalTabs";
import { Grid } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import classes from "./MyProfile.module.scss";
import { useNavigate } from "react-router-dom";

const MyProfilePage = (): React.JSX.Element => {
	const navigate = useNavigate();
	return (
		<Grid container>
			<Grid xs={12} className={classes.icon}>
				<KeyboardBackspaceIcon onClick={() => navigate("/home")} className={classes.backIcon} />
			</Grid>
			<VerticalTabs />
		</Grid>
	);
};

export default MyProfilePage;
