export interface OtpVerifyForgotPassword {
    email: string;
    otp: string;
}

export interface OtpVerifyConfirmEmail {
    otp: string;
}