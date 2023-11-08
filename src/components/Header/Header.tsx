import React from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";
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
import { UserUpdate } from "../../types/model/userUpdate";
// import { CurrentUser } from "../../types/model/currentUser";

const UserProfileDropdown = () => {
	const user: UserUpdate = useSelector((state: RootState) => state.auth.login.currentUser);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();
	const dispatch = useDispatch();

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
	// console.log(localStorage.getItem("user").name);
	// JSON.parse(localStorage.getItem("user") ?? "")?.name
	return (
		<>
			<div className={classes.wrapperUser} onClick={handleClick}>
				<Avatar alt="User Avatar" src={user?.avatar ? user.avatar : defaultAvatar} />
				<div className={classes.username}>{user?.name ? user?.name : ""}</div>
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
					<div className={classes.menuItem}>Manage Post</div>
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
					<div className={classes.menuItem}>My Favorite</div>
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
							Rooms
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
