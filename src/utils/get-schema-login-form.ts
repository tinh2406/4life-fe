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

export const schemaChangePasswordFormWithNewPassword = yup.object({
  newPassword: yup
    .string()
    .required("New Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    .min(6, "New Password must be at least 6 characters long"),
    confirmNewPassword: yup
    .string()
    .required("Confirm New Password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export const schemaChangePasswordForm = yup.object({
  currentPassword: yup
    .string()
    .required("Current Password is required"),
  newPassword: yup
    .string()
    .required("New Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character"
    )
    .min(6, "Password must be at least 6 characters long"),
  confirmNewPassword: yup
    .string()
    .required("Confirm New Password is required")
    .oneOf([yup.ref("newPassword")], "Confirm New Password must match"),
});

const convertTimeStringToNumber = (timeString:string) => {
  const [hour, minute] = timeString.split(":").map(Number);
  console.log(hour, minute);
  return hour * 3600 + minute * 60;
};

export const schemaAddPostFrom = yup.object({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  type: yup.number().required("Type Of Accomodation is requied"),
  location: yup.number().required("Location is required"),
  amentities: yup.array().required("Amentities is required"),
  timeCheckinAfter: yup.string().required("Time checkin after is required"),
  timeCheckinBefore: yup.string().required("Time checkin before is required")
  .when("timeCheckinAfter", (timeCheckinAfter, schema) => {
    return schema.test({
      test: function (timeCheckinBefore) {
        if (!timeCheckinBefore || !timeCheckinAfter) return true;
        console.log(timeCheckinAfter.toString());
        console.log(timeCheckinBefore);
        const timeAfter = convertTimeStringToNumber(timeCheckinAfter.toString());
        const timeBefore = convertTimeStringToNumber(timeCheckinBefore);
        console.log(timeBefore);
        return timeBefore > timeAfter;
      },
      message: "Time checkin before must be greater than time checkin after",
    });
  }),
  timeCheckoutBefore: yup.string().required("Time checkout before is required"),
  quiteTimeAfter: yup.string().required("Quite time after is required"),
  quiteTimeBefore: yup.string().required("Quite time before is required"),
})

export const schemaBookingFrom = yup.object({
  checkin: yup.string().required("Checkin date is required")
  .test({
    name: 'date-check',
    exclusive: false,
    message: 'Check-out date must be after check-in date',
    test: function () {
      const { checkin, checkout } = this.parent;
      if (!checkin || !checkout) return true;

      // Chuyển đổi chuỗi thành đối tượng ngày tháng
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);

      // Kiểm tra điều kiện check-out sau check-in
      return checkoutDate > checkinDate;
    },
  }),
  checkout: yup.string().required("Checkout date is required"),
})

