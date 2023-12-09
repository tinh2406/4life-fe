import { fireEvent, render, waitFor } from "@testing-library/react";
import ChangePasswordForm from "../src/components/Form/ChangePasswordForm/ChangePasswordForm";
import { changePassword } from "../src/api/auth.api";
import { toast } from "react-toastify";

jest.mock("../src/api/auth.api", () => ({
	changePassword: jest.fn().mockResolvedValue(200)
}));

jest.mock("react-toastify", () => ({
	toast: {
		success: jest.fn()
	}
}));

describe("Change Password Form", () => {
	it("should display current password, new password, confirm new password, and save button", () => {
		const { getByPlaceholderText, getByText } = render(<ChangePasswordForm />);

		const currentPasswordInput = getByPlaceholderText("Enter your current password");
		const newPasswordInput = getByPlaceholderText("Enter your new password");
		const confirmNewPasswordInput = getByPlaceholderText("Confirm your new password");
		const saveButton = getByText("Save");

		expect(currentPasswordInput).toBeInTheDocument();
		expect(newPasswordInput).toBeInTheDocument();
		expect(confirmNewPasswordInput).toBeInTheDocument();
		expect(saveButton).toBeInTheDocument();
	});

	it("displays error messages for required fields", async () => {
		const { getByText } = render(<ChangePasswordForm />);

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		const currentPasswordError = await waitFor(() => getByText("Current Password is required"));
		const newPasswordError = await waitFor(() => getByText("New Password is required"));
		const confirmNewPasswordError = await waitFor(() => getByText("Confirm New Password is required"));

		expect(currentPasswordError).toBeInTheDocument();
		expect(newPasswordError).toBeInTheDocument();
		expect(confirmNewPasswordError).toBeInTheDocument();
	});

	it("should display invalid new password error (at least 6 character)", async () => {
		const { getByPlaceholderText, getByText } = render(<ChangePasswordForm />);

		const newPasswordInput = getByPlaceholderText("Enter your new password");
		const currentPasswordInput = getByPlaceholderText("Enter your current password");
		const confirmNewPasswordInput = getByPlaceholderText("Confirm your new password");

		fireEvent.change(currentPasswordInput, { target: { value: "Dd@123" } });
		fireEvent.change(newPasswordInput, { target: { value: "Dd@12" } });
		fireEvent.change(confirmNewPasswordInput, { target: { value: "Dd@12" } });

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		const newPasswordError = await waitFor(() => getByText("Password must be at least 6 characters long"));

		expect(newPasswordError).toBeInTheDocument();
	});

	it("should display invalid new password error (has enough rule of password)", async () => {
		const { getByPlaceholderText, getByText } = render(<ChangePasswordForm />);

		const newPasswordInput = getByPlaceholderText("Enter your new password");
		const currentPasswordInput = getByPlaceholderText("Enter your current password");
		const confirmNewPasswordInput = getByPlaceholderText("Confirm your new password");

		fireEvent.change(currentPasswordInput, { target: { value: "Dd@123" } });
		fireEvent.change(newPasswordInput, { target: { value: "Dd112" } });
		fireEvent.change(confirmNewPasswordInput, { target: { value: "Dd112" } });

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		const newPasswordError = await waitFor(() =>
			getByText(
				"Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character"
			)
		);

		expect(newPasswordError).toBeInTheDocument();
	});

	it("should display password not matching error when new password and confirm password do not match", async () => {
		const { getByPlaceholderText, getByText } = render(<ChangePasswordForm />);

		const currentPasswordInput = getByPlaceholderText("Enter your current password");
		const newPasswordInput = getByPlaceholderText("Enter your new password");
		const confirmNewPasswordInput = getByPlaceholderText("Confirm your new password");

		fireEvent.change(currentPasswordInput, { target: { value: "Dd@123" } });
		fireEvent.change(newPasswordInput, { target: { value: "Dd@1234" } });
		fireEvent.change(confirmNewPasswordInput, { target: { value: "Dd@12345" } });

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		const confirmPasswordError = await waitFor(() => getByText("Confirm New Password must match"));

		expect(confirmPasswordError).toBeInTheDocument();
	});

	it("should change password successfully", async () => {
		const { getByPlaceholderText, getByText } = render(<ChangePasswordForm />);
		const currentPasswordInput = getByPlaceholderText("Enter your current password");
		const newPasswordInput = getByPlaceholderText("Enter your new password");
		const confirmNewPasswordInput = getByPlaceholderText("Confirm your new password");

		fireEvent.change(currentPasswordInput, { target: { value: "Dd@1234" } });
		fireEvent.change(newPasswordInput, { target: { value: "Dd@12345" } });
		fireEvent.change(confirmNewPasswordInput, { target: { value: "Dd@12345" } });

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(changePassword).toHaveBeenCalledWith({
				currentPassword: "Dd@1234",
				newPassword: "Dd@12345",
				confirmNewPassword: "Dd@12345"
			});
			expect(toast.success).toHaveBeenCalledWith("Change password successfully!");
		});
	});
});
