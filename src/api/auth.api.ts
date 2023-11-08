import { EmailForgotPassword } from "../types/model/emailForgotPassword";
import { OtpVerifyConfirmEmail, OtpVerifyForgotPassword } from "../types/model/otpVerifyForgotPassword";
import { NewPassword, NewPasswordNonOTP } from "../types/model/newPassword";
import {axiosInstance, axiosInstanceFormData} from "./instance";
import { UserUpdate } from "../types/model/userUpdate";
import { RegisterMod } from "../types/model/registerMod";

export const forgotPassword = async (email: EmailForgotPassword) => {
	return await axiosInstance.post("/auths/forgot-password",email);
};

export const verifyOTP = async (OTPVerify: OtpVerifyForgotPassword) => {
    return await axiosInstance.post("/auths/verify-otp-forgot-password", OTPVerify);
}

export const verifyEmail = async () => {
    return await axiosInstance.post("/users/verify-email");
}

export const verifyOTPConfirmEmail = async (OTPVerify: OtpVerifyConfirmEmail ) => {
    return await axiosInstance.post("/users/verify-otp-confirm-email", OTPVerify);
}

export const registerToMod = async (registerMod : RegisterMod) => {
    console.log("registerMod",registerMod);
    return await axiosInstance.put("/users/register-mod", registerMod);
}

export const newPassword = async (newPassword: NewPassword) => {
    return await axiosInstance.post("/auths/reset-password",newPassword);
}

export const getAvatarURL = async (data: FormData) => {
    console.log("data",data);
    return await axiosInstanceFormData.post("/upload-images/images",data);
}

export const getUserProfile = async () => {
    return await axiosInstance.get("/users/profile");
}

export const updateUserProfile = async (data: UserUpdate) => {
    const response = await axiosInstance.put("/users/update-profile",data);
    return response.data;
}

export const changePassword = async (data: NewPasswordNonOTP) => {
    const response = await axiosInstance.put("/users/change-password",data);
    return response.data;
}