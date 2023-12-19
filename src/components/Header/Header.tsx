import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, IconButton } from "@mui/material";
import { Avatar } from "@mui/material";
import classes from "./Header.module.scss";
import logo from "../../assets/images/logo.png";
import defaultAvatar from "../../assets/images/defaultAvatar.jpg";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { RootState } from "../../store";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Logout from "@mui/icons-material/Logout";
import { logoutUser } from "../../store/acthAction";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Notifycations from "../Notifycations/Notifycations";
import { useNotify } from "../../context/notify";

const UserProfileDropdown = () => {
	const user = useSelector((state: RootState) => state.auth.login.currentUser);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [openMenu, setOpenMenu] = useState<(EventTarget & HTMLButtonElement) | undefined>();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const notify = useNotify();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleLogout = () => {
		setAnchorEl(null);
		logoutUser(dispatch, navigate);
		localStorage.removeItem("user");
	};

	const handleCloseMenu = () => setOpenMenu(undefined);

	return (
		<>
			<div className={classes.wrapperRightHeader}>
				<IconButton
					size="small"
					disableRipple
					color="inherit"
					sx={{ px: 1 }}
					aria-controls="notification-menu"
					aria-haspopup="true"
					onClick={event => {
						setOpenMenu(event.currentTarget);
						if (notify?.setHasNew) notify.setHasNew(false);
					}}
				>
					<NotificationsIcon
						sx={{
							color: notify?.hasNew ? "red" : "#959595"
						}}
						fontSize="medium"
					/>
					{!!Object.keys(notify.newNoti).length && (
						<p
							style={{
								position: "absolute",
								right: "0.5rem",
								top: "-0.5rem",
								fontSize: 12,
								color: "gray"
							}}
						>
							{Object.keys(notify.newNoti).length}
						</p>
					)}
				</IconButton>
				<Notifycations close={handleCloseMenu} openMenu={openMenu} />
				<div className={classes.wrapperUser} onClick={handleClick}>
					<Avatar alt="User Avatar" src={user?.avatar ? user.avatar : defaultAvatar} />
					<div className={classes.username}>{user?.name ? user?.name : ""}</div>
				</div>
			</div>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: "background.paper",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0
						}
					}
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<MenuItem
					sx={{
						"&:hover": {
							backgroundColor: "#f7e1e6"
						}
					}}
					onClick={handleClose}
				>
					<PeopleOutlineIcon className={classes.menuIcon} />
					<div className={classes.menuItem} onClick={() => navigate("/profile")}>
						My Profile
					</div>
				</MenuItem>
				<MenuItem
					sx={{
						"&:hover": {
							backgroundColor: "#f7e1e6"
						}
					}}
					onClick={handleClose}
				>
					<EditNoteIcon className={classes.menuIcon} />
					<div className={classes.menuItem} onClick={() => navigate("/manage-posts")}>
						Manage Posts
					</div>
				</MenuItem>
				<MenuItem
					sx={{
						"&:hover": {
							backgroundColor: "#f7e1e6"
						}
					}}
					onClick={handleClose}
				>
					<EditNoteIcon className={classes.menuIcon} />
					<div className={classes.menuItem} onClick={() => navigate("/my-bookings")}>
						My Bookings
					</div>
				</MenuItem>
				<MenuItem
					sx={{
						"&:hover": {
							backgroundColor: "#f7e1e6"
						}
					}}
					onClick={handleClose}
				>
					<FavoriteBorderIcon className={classes.menuIcon} />
					<div className={classes.menuItem} onClick={() => navigate("/my-favorites")}>
						My Favorite
					</div>
				</MenuItem>
				<Divider />
				<MenuItem
					sx={{
						"&:hover": {
							backgroundColor: "#f7e1e6"
						}
					}}
					onClick={handleLogout}
				>
					<Logout className={classes.menuIcon} />
					<div className={classes.menuItem}>Logout</div>
				</MenuItem>
			</Menu>
		</>
	);
};

const Header = (): React.JSX.Element => {
	const location = useLocation();
	const isHomeActive = location.pathname.startsWith("/home");
	const isRoomsActive = location.pathname.startsWith("/rooms");
	const isAboutActive = location.pathname.startsWith("/about");
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.auth.login.currentUser);

	return (
		<>
			<Grid container>
				<div className={classes.wrapperHeader}>
					<div className={classes.wrapperLogo}>
						<img src={logo} alt="Logo" className={classes.logo} />
					</div>
					<div className={classes.wrapperTab}>
						<NavLink to="home" className={`${classes.tabItem} ${isHomeActive ? classes.active : ""}`}>
							Home
						</NavLink>
						<NavLink to="rooms" className={`${classes.tabItem} ${isRoomsActive ? classes.active : ""}`}>
							Accommodations
						</NavLink>
						<NavLink to="about" className={`${classes.tabItem} ${isAboutActive ? classes.active : ""}`}>
							About
						</NavLink>
					</div>
					{user || localStorage.getItem("user") ? (
						<UserProfileDropdown />
					) : (
						<div className={classes.wrapperBtn}>
							<Button
								variant="outlined"
								className={`${classes.customButton} ${classes.suBtn}`}
								onClick={() => navigate("/signup")}
							>
								Sign Up
							</Button>
							<Button
								variant="contained"
								className={`${classes.customButton} ${classes.lgBtn}`}
								onClick={() => navigate("/login")}
							>
								Login
							</Button>
						</div>
					)}
				</div>
			</Grid>
		</>
	);
};

export default Header;
