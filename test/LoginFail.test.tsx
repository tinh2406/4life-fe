import { render, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../src/pages/Login/Login";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../src/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { loginUser } from "../src/store/acthAction";

jest.mock("../src/store/acthAction", () => ({
	loginUser: jest.fn().mockResolvedValue(404)
}));

const Login = () => {
	return (
		<GoogleOAuthProvider clientId="">
			<Provider store={store}>
				<Router>
					<LoginPage />
				</Router>
			</Provider>
		</GoogleOAuthProvider>
	);
};

describe("Login failed", () => {
	it("should display error message for incorrect login details", async () => {
		const { getByTestId, getByLabelText, getByText } = render(<Login />);
		const loginButton = getByTestId("login-button");
		const emailInput = getByLabelText("Enter your email") as HTMLInputElement;
		const passwordInput = getByLabelText("Enter your password") as HTMLInputElement;
		fireEvent.change(emailInput, { target: { value: "diem@gmail.com" } });
		fireEvent.change(passwordInput, { target: { value: "Dd@1234" } });
		fireEvent.click(loginButton);

		await waitFor(() => {
			expect(loginUser).toHaveBeenCalledWith(
				{
					email: "diem@gmail.com",
					password: "Dd@1234"
				},
				expect.any(Function),
				expect.any(Function)
			);
			expect(
				expect(getByText("The login details you provided are incorrect. Please try again!")).toBeInTheDocument()
			);
		});
	});
});
