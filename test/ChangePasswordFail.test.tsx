import { fireEvent, render, waitFor } from "@testing-library/react";
import ChangePasswordForm from "../src/components/Form/ChangePasswordForm/ChangePasswordForm";
import { changePassword } from "../src/api/auth.api";
import { toast } from "react-toastify";

jest.mock("../src/api/auth.api", () => ({
	changePassword: jest.fn().mockImplementation(() => {
		return Promise.reject({ response: { status: 400 } });
	})
}));

jest.mock("react-toastify", () => ({
	toast: {
		error: jest.fn()
	}
}));

describe("Change Password Failed", () => {
	it("should change password failed", async () => {
		const { getByPlaceholderText, getByText } = render(<ChangePasswordForm />);
		const currentPasswordInput = getByPlaceholderText("Enter your current password");
		const newPasswordInput = getByPlaceholderText("Enter your new password");
		const confirmNewPasswordInput = getByPlaceholderText("Confirm your new password");

		fireEvent.change(currentPasswordInput, { target: { value: "Dd@123" } });
		fireEvent.change(newPasswordInput, { target: { value: "Dd@12345" } });
		fireEvent.change(confirmNewPasswordInput, { target: { value: "Dd@12345" } });

		const saveButton = getByText("Save");
		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(changePassword).toHaveBeenCalledWith({
				currentPassword: "Dd@123",
				newPassword: "Dd@12345",
				confirmNewPassword: "Dd@12345"
			});
			expect(toast.error).toHaveBeenCalledWith("Invalid current password. Please try again!");
		});
	});
});
