import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import AuthImg from "../../assets/images/auth.png";
import classes from "./Login.module.scss";
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

const LoginPage = (): React.JSX.Element => {
	const [errorLogin, setErrorLogin] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [showPassword, setShowPassword] = React.useState(false);

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
				localStorage.setItem("user", JSON.stringify(apiResponse.data.userResult));
				// console.log(JSON.parse(localStorage.getItem("user")));
				navigate("/home");
				console.log("API Response:", apiResponse.data);
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
			console.log(statuss);
			if (statuss === 404 || statuss === 400)
				setErrorLogin("The login details you provided are incorrect. Please try again!");
		} catch (error) {
			// loginFailed();
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Grid container>
			<Grid item xs={6}>
				<img src={AuthImg} alt="Auth" className={classes.authImg} />
			</Grid>
			<Grid container item xs={6} className={classes.loginForm}>
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
							src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png"
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
								id="standard-basic"
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
								id="standard-basic"
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
												// onMouseDown={handleMouseDownPassword}
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
							<Button type="submit" variant="contained" className={classes.btnLogin}>
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
