import * as yup from "yup";
export const schemaLoginForm = yup.object({
    email: yup
        .string()
        .required("Username is required"),
    password: yup
        .string()
        .required("Password is required")
});

export const schemaRegisterForm = yup.object({
  email: yup
    .string()
    .required("Username is required"),
  name: yup
    .string()
    .required("Name is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    .min(6, "Password must be at least 6 characters long"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const schemaValidNewPassword = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    .min(6, "Password must be at least 6 characters long"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});


