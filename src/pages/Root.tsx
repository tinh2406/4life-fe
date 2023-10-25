import React from "react";
import Header from "../components/Header/Header";
import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";

const RootLayout = (): React.JSX.Element => {
	return (
		<Grid container>
			<Grid item xs={12}>
				<Header />
			</Grid>
			<Grid item xs={12}>
				<Outlet />
			</Grid>
		</Grid>
	);
};

export default RootLayout;
