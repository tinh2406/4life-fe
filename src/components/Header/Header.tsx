import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Avatar, Badge, Button, Menu, MenuItem, Divider } from "@mui/material";
import classes from "./Header.module.scss";
import logo from "../../assets/images/logo.png";
import defaultAvatar from "../../assets/images/defaultAvatar.jpg";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
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
					color="inherit"
					className={classes.notifyBtn}
					aria-controls="notification-menu"
					aria-haspopup="true"
					aria-label="Notifications"
					onClick={event => {
						setOpenMenu(event.currentTarget);
						if (notify?.setHasNew) notify.setHasNew(false);
					}}
				>
					<Badge
						color="error"
						variant="dot"
						invisible={!notify?.hasNew && !Object.keys(notify?.newNoti ?? {}).length}
						sx={{
							"& .MuiBadge-badge": {
								bgcolor: "#d36b4a",
								right: 3,
								top: 3
							}
						}}
					>
						<NotificationsIcon className={classes.notifyIcon} />
					</Badge>
				</IconButton>
				<Notifycations close={handleCloseMenu} openMenu={openMenu} />
				<button
					type="button"
					className={classes.wrapperUser}
					onClick={handleClick}
					aria-expanded={open}
					aria-haspopup="true"
					aria-label="User menu"
				>
					<Avatar
						alt={user?.name ?? "User Avatar"}
						src={user?.avatar ? user.avatar : defaultAvatar}
						sx={{ width: 32, height: 32 }}
					/>
					{user?.name && <span className={classes.username}>{user.name}</span>}
				</button>
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
	const isHomeActive = location.pathname === "/" || location.pathname.startsWith("/home");
	const isRoomsActive = location.pathname.startsWith("/rooms");
	const isAboutActive = location.pathname.startsWith("/about");
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.auth.login.currentUser);

	return (
		<header className={classes.header}>
			<div className={classes.wrapperHeader}>
				<div className={classes.wrapperLogo}>
					<NavLink to="/home" className={classes.logoLink} aria-label="4LIFE Home">
						<img src={logo} alt="4LIFE" className={classes.logo} />
					</NavLink>
				</div>
				<nav className={classes.navPill} aria-label="Main Navigation">
					<NavLink
						to="/home"
						className={({ isActive }) =>
							`${classes.navItem} ${isActive || isHomeActive ? classes.active : ""}`
						}
					>
						Home
					</NavLink>
					<NavLink
						to="/rooms"
						className={({ isActive }) =>
							`${classes.navItem} ${isActive || isRoomsActive ? classes.active : ""}`
						}
					>
						Accommodations
					</NavLink>
					<NavLink
						to="/about"
						className={({ isActive }) =>
							`${classes.navItem} ${isActive || isAboutActive ? classes.active : ""}`
						}
					>
						About
					</NavLink>
				</nav>
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
		</header>
	);
};

export default Header;
