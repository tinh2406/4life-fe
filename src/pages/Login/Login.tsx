import { useState } from "react";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { schemaLoginForm } from "../../utils/get-schema-login-form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUser } from "../../store/acthAction";
import { UserLogin } from "../../types/model/userLogin";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { URL } from "../../utils/get-client-id";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { getUserProfile } from "../../api/auth.api";
import { loginSuccess } from "../../store/authSlice";
import AuthImg from "../../assets/images/auth.png";
import classes from "./Login.module.scss";
import React from "react";

const LoginPage = (): React.JSX.Element => {
	const [errorLogin, setErrorLogin] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleClickShowPassword = () => setShowPassword(show => !show);

	const login = useGoogleLogin({
		onSuccess: async tokenResponse => {
			const accessToken = tokenResponse?.access_token;
			try {
				const apiResponse = await axios.post(`${URL}/auths/google-login`, {
					accessToken
				});
				localStorage.setItem("accessToken", apiResponse.data.token);
				getUserProfile()
					.then(response => {
						dispatch(loginSuccess(response.data));
					})
					.catch(error => {
						console.log(error);
					});
				localStorage.setItem("user", JSON.stringify(apiResponse.data.userResult));
				navigate("/home");
			} catch (error) {
				console.error("Error sending token to server:", error);
			}
		}
	});

	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm({ resolver: yupResolver(schemaLoginForm) });

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsSubmitting(true);
		const userLoginData = data as UserLogin;
		try {
			const statuss = await loginUser(userLoginData, dispatch, navigate);
			if (statuss === 404 || statuss === 400)
				setErrorLogin("The login details you provided are incorrect. Please try again!");
		} catch (error) {
			// loginFailed();
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Grid container className={classes.wrapperLogin}>
			<Grid item xs={0} md={6} sm={6}>
				<img src={AuthImg} alt="Auth" className={classes.authImg} />
			</Grid>
			<Grid container item xs={12} md={6} sm={6} className={classes.loginForm}>
				<Grid item xs={10} className={classes.options}>
					<Grid item xs={3}>
						<h3
							className={`${classes.link} ${classes.signup}`}
							onClick={() => {
								navigate("/signup");
							}}
						>
							Sign Up
						</h3>
					</Grid>
					<Grid item xs={9}>
						<h3
							className={`${classes.link} ${classes.linkActive}`}
							onClick={() => {
								navigate("/login");
							}}
						>
							Login
						</h3>
					</Grid>
				</Grid>
				<Grid item xs={10}>
					<div className={classes.ggBtn}>
						<img
							className={classes.ggBtnImg}
							src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
							alt="Google"
						></img>
						<div className={classes.text} onClick={() => login()}>
							Log in with Google
						</div>
					</div>
					<div className={classes.line}></div>
				</Grid>
				<Grid item xs={10}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Grid item xs={12} className={classes.wrapperInput}>
							<TextField
								id="email"
								label="Enter your email"
								variant="standard"
								className={classes.inputField}
								error={!!errors.email}
								helperText={errors.email?.message}
								{...register("email")}
								placeholder="Email"
							/>
							<div className={classes.text}>Email</div>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="password"
								label="Enter your password"
								variant="standard"
								error={!!errors.password}
								helperText={errors.password?.message}
								{...register("password")}
								placeholder="Password"
								type={showPassword ? "text" : "password"}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												edge="end"
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									)
								}}
								className={classes.inputField}
							/>
							<div className={classes.text}>Password</div>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.error}>{errorLogin}</div>
						</Grid>
						<Grid item xs={12} className={classes.wrapperForgotPassword}>
							<div className={classes.forgotPassword} onClick={() => navigate("/forgot-password")}>
								Forgot password
							</div>
						</Grid>
						<Grid item xs={12}>
							<Button
								type="submit"
								variant="contained"
								data-testid="login-button"
								className={classes.btnLogin}
							>
								{isSubmitting ? (
									<Box sx={{ display: "flex" }}>
										<CircularProgress color="inherit" />
									</Box>
								) : (
									"Login"
								)}
							</Button>
						</Grid>
						<Grid item xs={12} className={classes.switchOption}>
							<div className={classes.text}>You don't have account?</div>
							<div className={classes.forgotPassword} onClick={() => navigate("/signup")}>
								Sign Up
							</div>
						</Grid>
					</form>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default LoginPage;
