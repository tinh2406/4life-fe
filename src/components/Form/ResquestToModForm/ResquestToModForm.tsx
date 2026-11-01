import { ChangeEvent, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { LoadingButton } from "@mui/lab";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// Cropped from the existing registerMod image to remove its decorative magenta frame.
import RegisterMod from "../../../assets/images/host-intro.webp";
import { getAvatarURL, registerToMod, verifyEmail, verifyOTPConfirmEmail } from "../../../api/auth.api";
import { RootState } from "../../../store";
import { useNotify } from "../../../context/notify";
import UploadImage from "../../UploadImage/UploadImage";
import classes from "./ResquestToModForm.module.scss";

type HostRequestStep = "intro" | "otp" | "documents" | "submitted";

const ResquestToModForm = (): React.JSX.Element => {
	const user = useSelector((state: RootState) => state.auth.login.currentUser);
	const navigate = useNavigate();
	const notify = useNotify();
	const [step, setStep] = useState<HostRequestStep>("intro");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [otp, setOtp] = useState("");
	const [otpError, setOtpError] = useState("");
	const [photoURLs, setPhotoURLs] = useState<string[]>(["", ""]);
	const [loadingUpload, setLoadingUpload] = useState<number | null>(null);
	const [isHost, setIsHost] = useState(
		() => user?.statusModRole === "Active" || localStorage.getItem("isMod") === "true"
	);

	useEffect(() => {
		if (user?.statusModRole === "Active" || notify?.isModRole) {
			setIsHost(true);
			localStorage.setItem("isMod", "true");
		}
	}, [user?.statusModRole, notify?.isModRole]);

	const handleSendOTP = async () => {
		setIsSubmitting(true);
		try {
			await verifyEmail();
			setStep("otp");
		} catch {
			toast.error("We could not send the verification code. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleVerifyOTP = async () => {
		const value = otp.trim();
		if (!value) {
			setOtpError("Enter the code sent to your email.");
			return;
		}

		setIsSubmitting(true);
		setOtpError("");
		try {
			await verifyOTPConfirmEmail({ otp: value });
			setStep("documents");
		} catch {
			setOtpError("That code could not be verified. Check it and try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChangeDocument = (event: ChangeEvent<HTMLInputElement>, index: number) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setLoadingUpload(index);
		const formData = new FormData();
		formData.append("file", file);
		getAvatarURL(formData)
			.then(response => {
				setPhotoURLs(current => {
					const next = [...current];
					next[index] = response.data.url;
					return next;
				});
			})
			.catch(() => toast.error("We could not upload that image. Please try again."))
			.finally(() => setLoadingUpload(null));
		event.target.value = "";
	};

	const handleRegister = async () => {
		if (!photoURLs[0] || !photoURLs[1]) return;

		setIsSubmitting(true);
		try {
			await registerToMod({ frontIdentityCard: photoURLs[0], backIdentityCard: photoURLs[1] });
			setStep("submitted");
			toast.success("Your host request has been submitted.");
		} catch {
			toast.error("We could not submit your request. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isHost) {
		return (
			<section className={classes.hostContent} aria-labelledby="host-heading">
				<div className={classes.hostHeader}>
					<div className={classes.hostIcon}><CheckCircleOutlineIcon /></div>
					<div>
						<h2 id="host-heading">Your host account is active</h2>
						<p>You can manage your accommodation listings and bookings from your host dashboard.</p>
					</div>
				</div>
				<Button variant="contained" className={classes.primaryButton} onClick={() => navigate("/manage-posts")} endIcon={<ArrowForwardIcon />}>
					Open host dashboard
				</Button>
			</section>
		);
	}

	return (
		<section className={classes.hostContent} aria-labelledby="host-heading">
			<div className={classes.stepper}>
				<Stepper activeStep={step === "documents" ? 1 : step === "submitted" ? 3 : 0} alternativeLabel>
					{["Confirm email", "Verify identity", "Submit request"].map(label => (
						<Step key={label}><StepLabel>{label}</StepLabel></Step>
					))}
				</Stepper>
			</div>
			{step === "intro" && (
				<div className={classes.introLayout}>
					<div className={classes.introCopy}>
						<h2 id="host-heading">Share your place with travelers</h2>
						<p>Start a host request to unlock accommodation listings on 4LIFE. First, confirm your email, then upload both sides of your identity document.</p>
						<Button variant="contained" className={classes.primaryButton} onClick={handleSendOTP} disabled={isSubmitting} endIcon={<ArrowForwardIcon />}>
							{isSubmitting ? "Sending code…" : "Start host request"}
						</Button>
					</div>
					<div className={classes.introImage}>
						<img src={RegisterMod} alt="A bright accommodation interior" />
					</div>
				</div>
			)}

			{step === "otp" && (
				<div className={classes.stepContent}>
					<h2 id="host-heading">Confirm your email</h2>
					<p>Enter the verification code sent to <strong>{user?.email || "your account email"}</strong>.</p>
					<label className={classes.fieldLabel} htmlFor="host-otp">Verification code</label>
					<TextField
						id="host-otp"
						className={classes.otpField}
						value={otp}
						onChange={event => { setOtp(event.target.value); setOtpError(""); }}
						error={Boolean(otpError)}
						helperText={otpError}
						autoComplete="one-time-code"
						inputProps={{ inputMode: "numeric", "aria-label": "Verification code" }}
						fullWidth
						size="small"
					/>
					<div className={classes.actions}>
						<Button className={classes.secondaryButton} onClick={() => setStep("intro")}>Back</Button>
						<LoadingButton loading={isSubmitting} variant="contained" className={classes.primaryButton} onClick={handleVerifyOTP} endIcon={<ArrowForwardIcon />}>Verify email</LoadingButton>
					</div>
				</div>
			)}

			{step === "documents" && (
				<div className={classes.stepContent}>
					<h2 id="host-heading">Verify your identity</h2>
					<p>Upload a clear image of the front and back of your identity document to continue.</p>
					<div className={classes.documentGrid}>
						{["Front of document", "Back of document"].map((label, index) => (
							<div className={classes.documentField} key={label}>
								<span className={classes.fieldLabel}>{label}</span>
								<UploadImage
									inputId={`host-document-${index}`}
									label={label}
									loadingUpload={loadingUpload === index}
									handleChangeImage={event => handleChangeDocument(event, index)}
									photoURL={photoURLs[index]}
								/>
							</div>
						))}
					</div>
					<p className={classes.uploadHint}><CloudUploadOutlinedIcon fontSize="small" /> Select an image for each side. You can replace an image by selecting it again.</p>
					<div className={classes.actions}>
						<Button className={classes.secondaryButton} onClick={() => setStep("otp")}>Back</Button>
						<LoadingButton loading={isSubmitting} variant="contained" className={classes.primaryButton} onClick={handleRegister} disabled={!photoURLs[0] || !photoURLs[1] || loadingUpload !== null} endIcon={<ArrowForwardIcon />}>Submit request</LoadingButton>
					</div>
				</div>
			)}

			{step === "submitted" && (
				<div className={classes.successState} role="status">
					<div className={classes.successIcon}><CheckCircleOutlineIcon /></div>
					<h2 id="host-heading">Request submitted</h2>
					<p>Your host request was submitted successfully. You can return to your account settings.</p>
					<Button className={classes.secondaryButton} onClick={() => setStep("intro")}>Back to account settings</Button>
				</div>
			)}
		</section>
	);
};

export default ResquestToModForm;
