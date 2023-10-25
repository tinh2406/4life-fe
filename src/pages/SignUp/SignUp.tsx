import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import AuthImg from "../../assets/images/auth.png";
import classes from "./SignUp.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { schemaRegisterForm } from "../../utils/get-schema-login-form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUser } from "../../store/acthAction";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { URL } from "../../utils/get-client-id";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserRegister } from "../../types/model/userRegister";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const SignUpPage = (): React.JSX.Element => {
	const [showPassword, setShowPassword] = React.useState(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
	} = useForm({ resolver: yupResolver(schemaRegisterForm) });

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsSubmitting(true);
		const userRegisterData = {
			email: data.email,
			password: data.password,
			name: data.name
		} as UserRegister;
		try {
			console.log(userRegisterData);
			const statuss = await registerUser(userRegisterData, dispatch, navigate);
			console.log("status", statuss);
			if (statuss === 200) {
				navigate("/login");
			}
		} catch (error) {
			// loginFailed();
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Grid container className={classes.wrapper}>
			<Grid item xs={6}>
				<img src={AuthImg} alt="Auth" className={classes.authImg} />
			</Grid>
			<Grid container item xs={6} className={classes.loginForm}>
				<Grid item xs={10} className={classes.options}>
					<Grid item xs={3}>
						<h3
							className={`${classes.link} ${classes.linkActive}`}
							onClick={() => {
								navigate("/signup");
							}}
						>
							Sign Up
						</h3>
					</Grid>
					<Grid item xs={9}>
						<h3
							className={`${classes.link} ${classes.signup}`}
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
							Continue with Google
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
						<Grid item xs={12} className={classes.wrapperInput}>
							<TextField
								id="standard-basic"
								label="Enter your name"
								variant="standard"
								className={classes.inputField}
								error={!!errors.name}
								helperText={errors.name?.message}
								{...register("name")}
								placeholder="Name"
							/>
							<div className={classes.text}>Name</div>
						</Grid>
						<Grid item xs={12} className={classes.wrapperInput}>
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
						<Grid item xs={12} className={classes.wrapperInput}>
							<TextField
								id="standard-basic"
								label="Retype your password"
								variant="standard"
								error={!!errors.confirmPassword}
								helperText={errors.confirmPassword?.message}
								{...register("confirmPassword")}
								placeholder="Confirm Your Password"
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
							<div className={classes.text}>Confirm Your Password</div>
						</Grid>
						<Grid item xs={12}>
							<Button type="submit" variant="contained" className={classes.btnLogin}>
								{isSubmitting ? (
									<Box sx={{ display: "flex" }}>
										<CircularProgress color="inherit" />
									</Box>
								) : (
									"Sign Up"
								)}
							</Button>
						</Grid>
						<Grid item xs={12} className={classes.switchOption}>
							<div className={classes.text}>You already have account?</div>
							<div className={classes.forgotPassword} onClick={() => navigate("/login")}>
								Login
							</div>
						</Grid>
					</form>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default SignUpPage;
