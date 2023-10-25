import { Button, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classes from "./ForgotPassword.module.scss";
import ForgotPassword from "../../assets/images/forgotPassword.png";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { ChangeEvent, useState } from "react";
import { forgotPassword, newPassword } from "../../api/auth.api";
import { verifyOTP } from "../../api/auth.api";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaValidNewPassword } from "../../utils/get-schema-login-form";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ForgotPasswordPage = (): React.JSX.Element => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [OTP, setOTP] = useState("");
	const [OTPError, setOTPError] = useState("");
	const [isSendOtp, setIsSendOtp] = useState(false);
	const [isVerifyOtp, setIsVerifyOtp] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword(show => !show);

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);

		if (!value) {
			setEmailError("Email is required");
		} else if (!isValidEmail(value)) {
			setEmailError("Invalid email format");
		} else {
			setEmailError("");
		}
	};

	const handleOTPChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setOTP(value);
		if (!value) {
			setOTPError("OTP is required");
		} else {
			setEmailError("");
		}
	};

	const handleVerifyOTP = () => {
		setIsSubmitting(true);
		if (OTP === "") setOTPError("OTP is required");
		else if (OTPError) {
			return;
		} else {
			const OTPVerify = {
				email: email,
				otp: OTP
			};
			verifyOTP(OTPVerify)
				.then(res => {
					console.log(res);
					setIsVerifyOtp(true);
				})
				.catch(err => {
					console.log(err);
				})
				.finally(() => {
					setIsSubmitting(false);
				});
		}
	};

	const handleSendOTP = () => {
		setIsSubmitting(true);
		if (email === "") setEmailError("Email is required");
		else if (emailError) {
			return;
		} else {
			const emailForgotPassword = {
				email: email
			};
			forgotPassword(emailForgotPassword)
				.then(res => {
					console.log(res);
					setIsSendOtp(true);
				})
				.catch(err => {
					console.log(err);
				})
				.finally(() => {
					setIsSubmitting(false);
				});
		}
	};

	const isValidEmail = (value: string) => {
		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
		return emailRegex.test(value);
	};

	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm({ resolver: yupResolver(schemaValidNewPassword) });

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsSubmitting(true);
		const newPasssword = {
			email: email,
			otp: OTP,
			newPassword: data.password,
			confirmNewPassword: data.confirmPassword
		};
		newPassword(newPasssword)
			.then(res => {
				console.log(res);
				navigate("/login");
			})
			.catch(err => {
				console.log(err);
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	return (
		<Grid container>
			<Grid item xs={6}>
				<img src={ForgotPassword} alt="Auth" className={classes.authImg} />
			</Grid>
			<Grid container item xs={6} className={classes.forgotPasswordForm}>
				<Grid item xs={8} className={classes.options}>
					<div className={classes.title}>Forgot Password?</div>
					<div className={classes.content}>
						Enter the email address you used when you joined and we will send you OTP to reset your
						password.
					</div>
					<Grid item xs={12} className={classes.wrapperInput}>
						{!isSendOtp ? (
							<>
								<TextField
									label="Enter your email"
									variant="standard"
									className={classes.inputField}
									value={email}
									onChange={handleEmailChange}
									error={!!emailError}
									helperText={emailError}
									placeholder="Email"
								/>
								<div className={classes.text}>Email</div>
							</>
						) : !isVerifyOtp ? (
							<>
								<TextField
									label="Enter OTP"
									variant="standard"
									className={classes.inputField}
									value={OTP}
									onChange={handleOTPChange}
									error={!!OTPError}
									helperText={OTPError}
									placeholder="OTP"
								/>
								<div className={classes.text}>OTP</div>
							</>
						) : (
							<>
								<form onSubmit={handleSubmit(onSubmit)}>
									<TextField
										label="Enter your new password"
										variant="standard"
										className={classes.inputField}
										error={!!errors.password}
										helperText={errors.password?.message}
										{...register("password")}
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
										placeholder="New Password"
									/>
									<div className={classes.text}>New Password</div>
									<TextField
										label="Confirm your new password"
										variant="standard"
										className={classes.inputField}
										error={!!errors.confirmPassword}
										helperText={errors.confirmPassword?.message}
										{...register("confirmPassword")}
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
										placeholder="Confirm Password"
									/>
									<div className={classes.text}>Confirm Password</div>
									<Grid item xs={12} className={classes.wrapperBtn}>
										<Button type="submit" variant="contained" className={classes.btnSend}>
											{!isSubmitting ? (
												"Change Password"
											) : (
												<Box sx={{ display: "flex" }}>
													<CircularProgress color="inherit" />
												</Box>
											)}
										</Button>
									</Grid>
								</form>
							</>
						)}
					</Grid>
					{!isVerifyOtp && (
						<Grid item xs={12} className={classes.wrapperBtn}>
							<Button
								// type="submit"
								variant="contained"
								className={classes.btnSend}
								onClick={!isSendOtp ? handleSendOTP : handleVerifyOTP}
							>
								{!isSubmitting ? (
									!isSendOtp ? (
										"Send OTP"
									) : (
										"Continue"
									)
								) : (
									<Box sx={{ display: "flex" }}>
										<CircularProgress color="inherit" />
									</Box>
								)}
							</Button>
						</Grid>
					)}
					<Grid item xs={12} className={classes.wrapperBtnBack}>
						<div className={classes.btnBack} onClick={() => navigate("/login")}>
							<KeyboardBackspaceIcon className={classes.backIcon} />
							<div className={classes.backText}>Back to Login</div>
						</div>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default ForgotPasswordPage;
