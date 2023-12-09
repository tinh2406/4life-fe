import { render, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../src/pages/Login/Login";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../src/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { loginUser } from "../src/store/acthAction";
import { toast } from "react-toastify";

jest.mock("../src/store/acthAction", () => ({
	loginUser: jest.fn().mockResolvedValue(200)
}));

jest.mock("react-toastify", () => ({
	toast: {
		success: jest.fn()
	}
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

describe("LoginPage component", () => {
	it("renders login form correctly", () => {
		const { getByLabelText, getByTestId } = render(<Login />);
		expect(getByLabelText("Enter your email")).toBeInTheDocument();
		expect(getByLabelText("Enter your password")).toBeInTheDocument();
		expect(getByTestId("login-button")).toBeInTheDocument();
	});

	it("allows user input in email and password fields", async () => {
		const { getByLabelText } = render(<Login />);
		const emailInput = getByLabelText("Enter your email") as HTMLInputElement;
		const passwordInput = getByLabelText("Enter your password") as HTMLInputElement;

		fireEvent.change(emailInput, { target: { value: "ttdiem2806@gmail.com" } });
		fireEvent.change(passwordInput, { target: { value: "Dd@1234" } });

		await waitFor(() => {
			// Check if values are updated
			expect(emailInput.value).toBe("ttdiem2806@gmail.com");
			expect(passwordInput.value).toBe("Dd@1234");
		});
	});

	it("displays error messages for required fields", async () => {
		const { getByLabelText, getByTestId, getByText } = render(<Login />);
		const loginButton = getByTestId("login-button");

		fireEvent.click(loginButton);

		await waitFor(() => {
			expect(getByText("Username is required")).toBeInTheDocument();
			expect(getByText("Password is required")).toBeInTheDocument();
		});

		const emailInput = getByLabelText("Enter your email") as HTMLInputElement;
		fireEvent.change(emailInput, { target: { value: "ttdiem2806@gmail.com" } });
		fireEvent.click(loginButton);

		await waitFor(() => {
			expect(getByText("Password is required")).toBeInTheDocument();
		});

		const passwordInput = getByLabelText("Enter your password") as HTMLInputElement;
		fireEvent.change(passwordInput, { target: { value: "Dd@1234" } });
		fireEvent.change(emailInput, { target: { value: "" } });
		fireEvent.click(loginButton);

		// Wait for error message to appear
		await waitFor(() => {
			expect(getByText("Username is required")).toBeInTheDocument();
		});
	});

	it("Login successfully", async () => {
		const { getByLabelText, getByTestId } = render(<Login />);
		const loginButton = getByTestId("login-button");

		// Simulate user input in email and password fields
		const emailInput = getByLabelText("Enter your email") as HTMLInputElement;
		const passwordInput = getByLabelText("Enter your password") as HTMLInputElement;
		fireEvent.change(emailInput, { target: { value: "ttdiem2806@gmail.com" } });
		fireEvent.change(passwordInput, { target: { value: "Dd@1234" } });

		fireEvent.click(loginButton); // Trigger the login process

		// Wait for the login process to complete (simulating a successful login)
		await waitFor(() => {
			expect(loginUser).toHaveBeenCalledWith(
				{ email: "ttdiem2806@gmail.com", password: "Dd@1234" },
				expect.any(Function),
				expect.any(Function)
			);
			expect(toast.success).toHaveBeenCalledWith("Login successfully!");
		});
	});
});
