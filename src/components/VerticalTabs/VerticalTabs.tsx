import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import classes from "./VerticalTabs.module.scss";
import UserProfileForm from "../Form/UserProfileForm/UserProfileForm";
import { Grid } from "@mui/material";
import ChangePasswordForm from "../Form/ChangePasswordForm/ChangePasswordForm";
import ResquestToModForm from "../Form/ResquestToModForm/ResquestToModForm";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
			className={classes.tabPanel}
		>
			{value === index && (
				<Box sx={{ p: 2 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `vertical-tab-${index}`,
		"aria-controls": `vertical-tabpanel-${index}`
	};
}

export default function VerticalTabs() {
	const [value, setValue] = React.useState(0);

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Grid sx={{ display: "flex", height: "100vh", width: "100vw" }}>
			<Tabs
				orientation="vertical"
				value={value}
				onChange={handleChange}
				aria-label="Vertical tabs example"
				sx={{
					borderRight: 2,
					borderColor: "divider",
					"& .MuiTabs-indicator": {
						backgroundColor: "#FF385C"
					},
					"& .MuiTabs-flexContainer": {
						"& .Mui-selected": {
							color: "#FF385C"
						}
					}
				}}
			>
				<Tab label="Personal Profile" {...a11yProps(0)} className={classes.tab} />
				<Tab label="Change Password" {...a11yProps(1)} className={classes.tab} />
				<Tab label="Resquest To Mod" {...a11yProps(2)} className={classes.tab} />
			</Tabs>
			<TabPanel value={value} index={0}>
				<UserProfileForm />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ChangePasswordForm />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<ResquestToModForm />
			</TabPanel>
		</Grid>
	);
}
