import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { schemaLoginForm } from "../../utils/get-schema-login-form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUser } from "../../store/acthAction";
import { UserLogin } from "../../types/model/userLogin";
import { useGoogleLogin } from "@react-oauth/google";
import { axiosInstance } from "../../api/instance";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getUserProfile } from "../../api/auth.api";
import { loginSuccess } from "../../store/authSlice";
import AuthLayout from "../../components/Auth/AuthLayout";
import authForm from "../../components/Auth/AuthForm.module.scss";
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
				const apiResponse = await axiosInstance.post("/auths/google-login", {
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
		<AuthLayout mode="login" onGoogleLogin={() => login()}>
			<form className={authForm.form} onSubmit={handleSubmit(onSubmit)}>
				<TextField id="email" label="Email" type="email" autoComplete="email" variant="outlined" className={authForm.field} error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
				<div>
					<TextField id="password" label="Password" type={showPassword ? "text" : "password"} autoComplete="current-password" variant="outlined" className={authForm.field} error={!!errors.password} helperText={errors.password?.message} {...register("password")} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton aria-label={showPassword ? "Hide password" : "Show password"} onClick={handleClickShowPassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
					<div className={authForm.formOptions}><Link className={authForm.textLink} to="/forgot-password">Forgot password?</Link></div>
				</div>
				{errorLogin && <p className={authForm.error} role="alert">{errorLogin}</p>}
				<Button type="submit" variant="contained" data-testid="login-button" className={authForm.submitButton} disabled={isSubmitting}>{isSubmitting ? "Logging in…" : "Log in"}</Button>
			</form>
		</AuthLayout>
	);
};

export default LoginPage;
