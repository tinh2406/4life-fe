import classes from "./ChangePasswordForm.module.scss";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	schemaChangePasswordForm,
	schemaChangePasswordFormWithNewPassword
} from "../../../utils/get-schema-login-form";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { changePassword, forgotPassword, newPassword, verifyOTP } from "../../../api/auth.api"; //forgotPassword nhớ bỏ dô lại
import { NewPasswordNonOTP } from "../../../types/model/newPassword";
import { toast } from "react-toastify";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SendIcon from "@mui/icons-material/Send";
import { ObjectSchema } from "yup";

const ChangePasswordForm = (): React.JSX.Element => {
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword(show => !show);
	const [isSaving, setIsSaving] = useState(false);
	const [isForgotPassword, setIsForgotPassword] = useState(false);
	const [OTP, setOTP] = useState("");
	const [OTPError, setOTPError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSentOTP, setIsSentOTP] = useState(false);
	const [isVerifyOTP, setIsVerifyOtp] = useState(false);
	const user = useSelector((state: RootState) => state.auth.login.currentUser);
	const [schema, setSchema] = useState<ObjectSchema<FieldValues>>(schemaChangePasswordForm);

	useEffect(() => {
		if (isForgotPassword) {
			setSchema(schemaChangePasswordFormWithNewPassword);
		}
	}, [isForgotPassword]);
	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm({
		resolver: yupResolver(schema as ObjectSchema<FieldValues>)
	});
	// schema as ObjectSchema<FieldValues>

	const handleForgotPassword = () => {
		setIsForgotPassword(isForgot => !isForgot);
	};

	const handleOTPChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setOTP(value);
		if (!value) {
			setOTPError("OTP is required");
		}
	};

	const handleSendOTP = async () => {
		setIsSubmitting(true);
		const emailForgotPassword = {
			email: user?.email ?? ""
		};
		await forgotPassword(emailForgotPassword);
		setIsSubmitting(false);
		setIsSentOTP(true);
	};

	const handleVerifyOTP = () => {
		setIsSubmitting(true);
		if (OTP === "") setOTPError("OTP is required");
		else if (OTPError) {
			return;
		} else {
			const OTPVerify = {
				email: user?.email ?? "",
				otp: OTP
			};
			verifyOTP(OTPVerify)
				.then(res => {
					console.log(res, "me");
					setIsVerifyOtp(true);
				})
				.catch(err => {
					setOTPError(err.response.data.message);
					toast.error("Invalid OTP. Please try again");
					setIsSubmitting(false);
				})
				.finally(() => {
					setIsSubmitting(false);
				});
		}
	};

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsSaving(true);
		if (!isForgotPassword) {
			changePassword(data as NewPasswordNonOTP)
				.then(res => {
					console.log(res);
					setIsSaving(false);
					toast.success("Change password successfully!");
				})
				.catch(err => {
					if (err.response.status === 400) {
						toast.error("Invalid current password. Please try again!");
					}
					setIsSaving(false);
				});
		} else {
			const newPasssword = {
				email: user?.email ?? "",
				otp: OTP,
				newPassword: data.newPassword,
				confirmNewPassword: data.confirmNewPassword
			};
			newPassword(newPasssword)
				.then(res => {
					console.log(res);
					toast.success("Change password successfully");
					setIsSaving(false);
				})
				.catch(err => {
					console.log(err);
					toast.error("Change password failed");
					setIsSaving(false);
				})
				.finally(() => {
					setIsSaving(false);
				});
		}
	};

	return (
		<Grid container className={classes.wrapperChangePasswordForm}>
			<Grid item xs={12} className={classes.title}>
				Password &amp; security
			</Grid>
			<Grid item xs={12} className={classes.wrapperForm}>
				<form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
					{!isForgotPassword ? (
						<Grid item xs={12} className={classes.wrapperRowInput}>
							<label className={classes.text} htmlFor="current-password">Current Password</label>
							<TextField
								id="current-password"
								variant="outlined"
								size="small"
								placeholder="Enter your current password"
								type={showPassword ? "text" : "password"}
								sx={{
									"& input::placeholder": {
										fontSize: "14px",
										fontFamily: "K2D"
									}
								}}
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
								error={!!errors.currentPassword}
								helperText={
									errors.currentPassword && typeof errors.currentPassword.message === "string"
										? errors.currentPassword.message
										: ""
								}
								{...register("currentPassword")}
								className={classes.inputField}
							/>
						</Grid>
					) : (
						<>
							<Grid item xs={12} className={classes.wrapperRowInput}>
								<label className={classes.text} htmlFor="password-reset-email">Email</label>
								<TextField
									id="password-reset-email"
									variant="outlined"
									size="small"
									sx={{
										"& input": {
											fontSize: "16px",
											fontFamily: "K2D"
										}
									}}
									className={classes.inputField}
									value={user?.email ?? ""}
									disabled={true}
								/>
							</Grid>
							{!isVerifyOTP && (
								<>
									<Grid item xs={12} className={classes.wrapperRowInput}>
									<label className={classes.text} htmlFor="password-reset-otp">OTP</label>
										<TextField
										id="password-reset-otp"
										variant="outlined"
										size="small"
											sx={{
												"& input::placeholder": {
													fontSize: "14px",
													fontFamily: "K2D"
												}
											}}
											className={classes.inputField}
											value={OTP}
											onChange={handleOTPChange}
											error={!!OTPError}
											helperText={OTPError}
											placeholder="Enter OTP"
										/>
									</Grid>
									<Grid item xs={12} className={classes.wrapperButton}>
										<LoadingButton
											size="small"
											className={classes.buttonSave}
											onClick={isSentOTP ? handleVerifyOTP : handleSendOTP}
											loading={isSubmitting}
											loadingPosition="start"
											startIcon={<SendIcon />}
											variant="contained"
											disabled={isSubmitting}
										>
											<span>{isSentOTP ? "Verify OTP" : "Send OTP"}</span>
										</LoadingButton>
									</Grid>
								</>
							)}
						</>
					)}
					{(isVerifyOTP || !isForgotPassword) && (
						<>
							<Grid item xs={12} className={classes.wrapperRowInput}>
							<label className={classes.text} htmlFor="new-password">New Password</label>
								<TextField
								id="new-password"
								variant="outlined"
								size="small"
									error={!!errors.newPassword}
									helperText={
										errors.newPassword && typeof errors.newPassword.message === "string"
											? errors.newPassword.message
											: ""
									}
									{...register("newPassword")}
									placeholder="Enter your new password"
									type={showPassword ? "text" : "password"}
									sx={{
										"& input::placeholder": {
											fontSize: "14px",
											fontFamily: "K2D"
										}
									}}
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
							</Grid>
							<Grid item xs={12} className={classes.wrapperRowInput}>
							<label className={classes.text} htmlFor="confirm-new-password">Confirm New Password</label>
								<TextField
								id="confirm-new-password"
								variant="outlined"
								size="small"
									error={!!errors.confirmNewPassword}
									helperText={
										errors.confirmNewPassword &&
										typeof errors.confirmNewPassword.message === "string"
											? errors.confirmNewPassword.message
											: ""
									}
									{...register("confirmNewPassword")}
									placeholder="Confirm your new password"
									type={showPassword ? "text" : "password"}
									sx={{
										"& input::placeholder": {
											fontSize: "14px",
											fontFamily: "K2D"
										}
									}}
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
							</Grid>
						</>
					)}
					{!isForgotPassword ? (
						<Grid item xs={12} className={classes.wrapperForgotPassword}>
			<Button type="button" className={classes.forgotPassword} onClick={handleForgotPassword}>
								Forgot password?
			</Button>
						</Grid>
					) : (
						<KeyboardBackspaceIcon onClick={handleForgotPassword} className={classes.backIcon} />
					)}
					{(isVerifyOTP || !isForgotPassword) && (
						<>
							<Grid item xs={12} className={classes.wrapperButton}>
								<LoadingButton
									type="submit"
									size="small"
									className={classes.buttonSave}
									loading={isSaving}
									loadingPosition="start"
									startIcon={<SaveIcon />}
									variant="contained"
									disabled={isSaving}
								>
									<span>Save</span>
								</LoadingButton>
							</Grid>
						</>
					)}
				</form>
			</Grid>
		</Grid>
	);
};

export default ChangePasswordForm;
