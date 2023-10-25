import { EmailForgotPassword } from "../types/model/emailForgotPassword";
import { OtpVerifyForgotPassword } from "../types/model/otpVerifyForgotPassword";
import { NewPassword } from "../types/model/newPassword";
import axiosInstance from "./instance";

// import { AxiosResponse } from "axios";

export const forgotPassword = async (email: EmailForgotPassword) => {
	return await axiosInstance.post("/auths/forgot-password",email);
};

export const verifyOTP = async (OTPVerify: OtpVerifyForgotPassword) => {
    return await axiosInstance.post("/auths/verify-otp-forgot-password",OTPVerify);
}

export const newPassword = async (newPassword: NewPassword) => {
    console.log(newPassword);
    return await axiosInstance.post("/auths/reset-password",newPassword);
}