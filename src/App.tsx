import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root";
import LoginPage from "./pages/Login/Login";
import HomePage from "./pages/Home/Home";
import SignUpPage from "./pages/SignUp/SignUp";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPassword";
import MyProfilePage from "./pages/MyProfile/MyProfile";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ProtectedAuthen, ProtectedRoute } from "./components/Auth/ProtectedRoute";
import RoomsPage from "./pages/Rooms/Rooms";

const router = createBrowserRouter([
	{
		path: "/login",
		element: (
			<ProtectedAuthen>
				<LoginPage />
			</ProtectedAuthen>
		)
	},
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
				path: "rooms",
				element: <RoomsPage />
			},
			{
				path: "profile",
				element: (
					<ProtectedRoute>
						<MyProfilePage />
					</ProtectedRoute>
				)
			}
		]
	},
	{
		path: "/signup",
		element: (
			<ProtectedAuthen>
				<SignUpPage />
			</ProtectedAuthen>
		)
	},
	{
		path: "/forgot-password",
		element: (
			<ProtectedAuthen>
				<ForgotPasswordPage />
			</ProtectedAuthen>
		)
	}
]);

function App() {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<RouterProvider router={router} />
		</LocalizationProvider>
	);
}

export default App;
