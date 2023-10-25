import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root";
import LoginPage from "./pages/Login/Login";
import HomePage from "./pages/Home/Home";
import SignUpPage from "./pages/SignUp/SignUp";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPassword";
import MyProfilePage from "./pages/MyProfile/MyProfile";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{ index: true, element: <Navigate to="/home" replace /> },
			{
				path: "home",
				element: <HomePage />
			},
			{
				path: "my-profile",
				element: <MyProfilePage />
			}
		]
	},
	{
		path: "/login",
		element: <LoginPage />
	},
	{
		path: "/signup",
		element: <SignUpPage />
	},
	{
		path: "/forgot-password",
		element: <ForgotPasswordPage />
	}
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
