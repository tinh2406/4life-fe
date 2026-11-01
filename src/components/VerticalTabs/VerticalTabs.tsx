import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import classes from "./VerticalTabs.module.scss";
import UserProfileForm from "../Form/UserProfileForm/UserProfileForm";
import { Grid } from "@mui/material";
import ChangePasswordForm from "../Form/ChangePasswordForm/ChangePasswordForm";
import ResquestToModForm from "../Form/ResquestToModForm/ResquestToModForm";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<section
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
			className={classes.tabPanel}
		>
			{value === index && <Box className={classes.panelContent}>{children}</Box>}
		</section>
	);
}

function a11yProps(index: number) {
	return {
		id: `vertical-tab-${index}`,
		"aria-controls": `vertical-tabpanel-${index}`
	};
}

type VerticalTabsProps = { initialTab?: number };

export default function VerticalTabs({ initialTab = 0 }: VerticalTabsProps) {
	const [value, setValue] = React.useState(initialTab);

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Grid container className={classes.accountLayout}>
			<Tabs
				orientation="vertical"
				value={value}
				onChange={handleChange}
				aria-label="Account settings"
				className={classes.tabs}
			>
				<Tab icon={<PersonOutlineIcon />} iconPosition="start" label="Personal information" {...a11yProps(0)} className={classes.tab} />
				<Tab icon={<LockOutlinedIcon />} iconPosition="start" label="Password & security" {...a11yProps(1)} className={classes.tab} />
				<Tab icon={<HomeWorkOutlinedIcon />} iconPosition="start" label="Become a host" {...a11yProps(2)} className={classes.tab} />
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
