import React from "react";
import Header from "../components/Header/Header";
import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";

const RootLayout = (): React.JSX.Element => {
	return (
		<Grid container>
			<Grid item xs={12}>
				<Header />
			</Grid>
			<Grid item xs={12}>
				<Outlet />
			</Grid>
			<Grid item xs={12}>
				<Footer />
			</Grid>
		</Grid>
	);
};

export default RootLayout;
