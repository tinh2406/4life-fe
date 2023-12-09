import { Button, Grid, TextField } from "@mui/material";
import classes from "./ResquestToModForm.module.scss";
import RegisterMod from "../../../assets/images/registerMod.png";
import { ChangeEvent, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import { getAvatarURL, registerToMod, verifyEmail, verifyOTPConfirmEmail } from "./../../../api/auth.api";
import { toast } from "react-toastify";
import UploadImage from "../../UploadImage/UploadImage";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";

const ResquestToModForm = (): React.JSX.Element => {
	const user = useSelector((state: RootState) => state.auth.login.currentUser);
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isVerifyOTP, setIsVerifyOtp] = useState(false);
	const [OTP, setOTP] = useState("");
	const [OTPError, setOTPError] = useState("");
	const [isStartRegisterMod, setIsStartRegisterMod] = useState(false);
	const [photoURLs, setPhotoURLs] = useState<string[]>([]);
	const [loadingUpload, setLoadingUpload] = useState<number>(0);
	const [isModRole, setIsModRole] = useState<boolean>(false);

	useEffect(() => {
		if (user?.statusModRole === "Active") {
			setIsModRole(true);
		}
	}, [user]);

	const handleOTPChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setOTPError("");
		setOTP(value);
		if (!value) {
			setOTPError("OTP is required");
		}
	};

	const handleSendOTP = async () => {
		setIsSubmitting(true);
		setIsSubmitting(true);
		verifyEmail()
			.then(() => {
				setIsStartRegisterMod(true);
			})
			.catch(err => {
				toast.error(err.response.data.message);
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	const handleVerifyOTP = () => {
		setIsSubmitting(true);
		console.log(OTP);
		if (OTP === "") {
			setOTPError("OTP is required");
			setIsSubmitting(false);
		} else if (OTPError) {
			setIsSubmitting(false);
			console.log(OTPError);
		} else {
			const OTPVerify = {
				otp: OTP
			};
			console.log(OTPVerify);
			verifyOTPConfirmEmail(OTPVerify)
				.then(() => {
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

	const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const file = event.target?.files?.[0];
		setLoadingUpload(index);
		console.log(index);
		if (file) {
			// const errorMessage = validateFileImage(file);
			// if (errorMessage) {
			// 	toast.error(errorMessage);
			// 	event.target.value = "";
			// 	return;
			// }
			// setFile(file);
			const reader = new FileReader();
			reader.onload = async (e: ProgressEvent<FileReader>) => {
				console.log(e.target?.result);
				const formData = new FormData();
				formData.append("file", file);
				const res = await getAvatarURL(formData);
				setPhotoURLs([...photoURLs, res.data.url]);
				setLoadingUpload(0);
			};
			reader.readAsDataURL(file);
			event.target.value = "";
		}
	};

	const handleRegisterMod = () => {
		const data = {
			frontIdentityCard: photoURLs[0],
			backIdentityCard: photoURLs[1]
		};
		setIsSubmitting(true);
		registerToMod(data)
			.then(() => {
				toast.success("Register to mod successfully");
			})
			.catch(err => {
				console.log(err);
				toast.error("Register to mod failed");
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	return (
		<Grid container className={classes.wrapper}>
			{!isModRole ? (
				<>
					{!isStartRegisterMod ? (
						<>
							<Grid item xs={12} className={classes.title}>
								Are you ready to rent your home on 4LIFE?
							</Grid>
							<Grid item xs={12} className={classes.wrapperContent}>
								<Grid item xs={6} className={classes.content}>
									<p>Register as a mod to be able to post your home with 4LIFE</p>
									<p>Easily rent your house on 4LIFE and earn extra income</p>
									<LoadingButton
										size="small"
										className={classes.buttonSave}
										onClick={handleSendOTP}
										loading={isSubmitting}
										loadingPosition="start"
										startIcon={<SendIcon />}
										variant="contained"
										disabled={isSubmitting}
									>
										<span>Get Started</span>
									</LoadingButton>
								</Grid>
								<Grid item xs={6} className={classes.wapperImg}>
									<img src={RegisterMod} alt="Resgiter to mod" className={classes.img} />
								</Grid>
							</Grid>
							{/* <Grid item xs={12} className={classes.wrapperButton}>
						
					</Grid> */}
						</>
					) : !isVerifyOTP ? (
						<>
							<Grid item xs={12} className={classes.titleRegisterMod}>
								Register To Mod
							</Grid>
							<Grid item xs={12} className={classes.wrapperContent}>
								Enter the OTP we sent to your account email to confirm the email address
							</Grid>
							<>
								<Grid item xs={12} className={classes.wrapperRowInput}>
									<div className={classes.text}>OTP</div>
									<TextField
										variant="standard"
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
										onClick={handleVerifyOTP}
										loading={isSubmitting}
										loadingPosition="start"
										startIcon={<SendIcon />}
										variant="contained"
										disabled={isSubmitting}
									>
										<span>Verify OTP</span>
									</LoadingButton>
								</Grid>
							</>
						</>
					) : (
						<>
							<Grid item xs={12} className={classes.titleRegisterMod}>
								Verify Your Information
							</Grid>
							<Grid item xs={12} className={classes.text}>
								Choose your front and back identity card image
							</Grid>
							<Grid item xs={12} className={classes.wrapperContent}>
								<Tooltip title="Click to upload your front identity card image">
									<UploadImage
										loadingUpload={loadingUpload == 1 ? true : false}
										handleChangeImage={image => {
											handleChangeAvatar(image, 1);
											console.log(1);
										}}
										photoURL={photoURLs[0]}
									/>
								</Tooltip>
								<Tooltip title="Click to upload your front identity card image">
									<UploadImage
										loadingUpload={loadingUpload == 2 ? true : false}
										handleChangeImage={image => {
											handleChangeAvatar(image, 2);
											console.log(2);
										}}
										photoURL={photoURLs[1]}
									/>
								</Tooltip>
							</Grid>
							<Grid item xs={12} className={classes.wrapperButton}>
								<LoadingButton
									size="small"
									className={classes.buttonSave}
									onClick={handleRegisterMod}
									loading={isSubmitting}
									loadingPosition="start"
									startIcon={<SendIcon />}
									variant="contained"
									disabled={isSubmitting}
								>
									<span>Register To Mod</span>
								</LoadingButton>
							</Grid>
						</>
					)}
				</>
			) : (
				<>
					<Button className={classes.buttonSave} onClick={() => navigate("/manage-posts")}>
						Start Post Accomodation
					</Button>
					<Grid item xs={6} className={`${classes.wapperImg} ${classes.spacing}`}>
						<img src={RegisterMod} alt="Resgiter to mod" className={classes.img} />
					</Grid>
				</>
			)}
		</Grid>
	);
};

export default ResquestToModForm;
