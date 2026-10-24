import { ReactNode } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import classes from "./AuthLayout.module.scss";
import AuthImg from "../../assets/images/auth.png";
import Logo from "../../assets/images/logo.png";

type AuthLayoutProps = {
	mode: "login" | "signup";
	children: ReactNode;
	onGoogleLogin: () => void;
};

const AuthLayout = ({ mode, children, onGoogleLogin }: AuthLayoutProps) => {
	const isLogin = mode === "login";

	return (
		<main className={classes.page}>
			<section className={classes.panel} aria-label={isLogin ? "Log in to 4LIFE" : "Create a 4LIFE account"}>
				<div className={classes.visual}>
					<img src={AuthImg} alt="A resort beside a quiet tropical pool" className={classes.visualImage} />
					<div className={classes.visualShade} />
					<Link to="/home" className={classes.brand} aria-label="4LIFE home">
						<img src={Logo} alt="4LIFE" />
					</Link>
					<div className={classes.visualCopy}>
						<h1>Your next stay starts here.</h1>
						<p>Find a place that feels right for the way you travel.</p>
					</div>
				</div>

				<div className={classes.content}>
					<nav className={classes.switcher} aria-label="Account">
						<Link to="/login" className={isLogin ? classes.activeTab : classes.tab} aria-current={isLogin ? "page" : undefined}>
							Log in
						</Link>
						<Link to="/signup" className={!isLogin ? classes.activeTab : classes.tab} aria-current={!isLogin ? "page" : undefined}>
							Create account
						</Link>
					</nav>

					<header className={classes.heading}>
						<h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
						<p>{isLogin ? "Log in to continue planning your stay." : "Join 4LIFE to save and book places to stay."}</p>
					</header>

					<Button className={classes.googleButton} variant="outlined" onClick={onGoogleLogin} type="button">
						<img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="" />
						{isLogin ? "Continue with Google" : "Sign up with Google"}
					</Button>

					<div className={classes.divider}><span>or continue with email</span></div>
					{children}
					<p className={classes.legal}>Your account keeps saved places and bookings together.</p>
				</div>
			</section>
		</main>
	);
};

export default AuthLayout;
