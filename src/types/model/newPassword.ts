export interface NewPassword {
    email: string;
    otp: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface NewPasswordNonOTP {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}