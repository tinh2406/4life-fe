import React, { useState } from "react";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { schemaRegisterForm } from "../../utils/get-schema-login-form";
import { registerUser } from "../../store/acthAction";
import { axiosInstance } from "../../api/instance";
import { UserRegister } from "../../types/model/userRegister";
import AuthLayout from "../../components/Auth/AuthLayout";
import authForm from "../../components/Auth/AuthForm.module.scss";

const SignUpPage = (): React.JSX.Element => {
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const login = useGoogleLogin({
		onSuccess: async tokenResponse => {
			try {
				await axiosInstance.post("/auths/google-login", { accessToken: tokenResponse.access_token });
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
	} = useForm({ resolver: yupResolver(schemaRegisterForm) });

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsSubmitting(true);
		const userRegisterData = {
			email: data.email,
			password: data.password,
			name: data.name
		} as UserRegister;
		try {
			await registerUser(userRegisterData, dispatch, navigate);
		} finally {
			setIsSubmitting(false);
		}
	};

	const togglePasswordVisibility = () => setShowPassword(value => !value);
	const passwordAdornment = (
		<InputAdornment position="end">
			<IconButton aria-label={showPassword ? "Hide password" : "Show password"} onClick={togglePasswordVisibility} edge="end">
				{showPassword ? <VisibilityOff /> : <Visibility />}
			</IconButton>
		</InputAdornment>
	);

	return (
		<AuthLayout mode="signup" onGoogleLogin={() => login()}>
			<form className={authForm.form} onSubmit={handleSubmit(onSubmit)}>
				<TextField id="signup-email" label="Email" type="email" autoComplete="email" variant="outlined" className={authForm.field} error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
				<TextField id="signup-name" label="Full name" autoComplete="name" variant="outlined" className={authForm.field} error={!!errors.name} helperText={errors.name?.message} {...register("name")} />
				<TextField id="signup-password" label="Password" type={showPassword ? "text" : "password"} autoComplete="new-password" variant="outlined" className={authForm.field} error={!!errors.password} helperText={errors.password?.message} {...register("password")} InputProps={{ endAdornment: passwordAdornment }} />
				<TextField id="signup-confirm-password" label="Confirm password" type={showPassword ? "text" : "password"} autoComplete="new-password" variant="outlined" className={authForm.field} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} {...register("confirmPassword")} InputProps={{ endAdornment: passwordAdornment }} />
				<Button type="submit" variant="contained" className={authForm.submitButton} disabled={isSubmitting}>{isSubmitting ? "Creating account…" : "Create account"}</Button>
			</form>
		</AuthLayout>
	);
};

export default SignUpPage;
