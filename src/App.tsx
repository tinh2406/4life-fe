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
import ManagePostsPage from "./pages/ManagePosts/ManagePosts";
import AccommodationDetailPage from "./pages/AccommodationDetail/AccommodationDetail";
import MyBookingsPages from "./pages/MyBookings/MyBookings";
import BookingDetailPage from "./pages/BookingDetail/BookingDetail";
import MyFavoritePage from "./pages/MyFavorite/MyFavorite";
import AboutPage from "./pages/About/About";

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
				path: "about",
				element: <AboutPage />
			},
			{
				path: "rooms",
				children: [
					{
						index: true,
						element: <RoomsPage />
					},
					{
						path: ":id",
						element: <AccommodationDetailPage />
					}
				]
			},
			{
				path: "profile",
				element: (
					<ProtectedRoute>
						<MyProfilePage />
					</ProtectedRoute>
				)
			},
			{
				path: "manage-posts",
				element: (
					<ProtectedRoute>
						<ManagePostsPage />
					</ProtectedRoute>
				)
			},
			{
				path: "my-bookings",
				children: [
					{
						index: true,
						element: (
							<ProtectedRoute>
								<MyBookingsPages />
							</ProtectedRoute>
						)
					},
					{
						path: ":id",
						element: <BookingDetailPage />
					}
				]
			},
			{
				path: "my-favorites",
				children: [
					{
						index: true,
						element: (
							<ProtectedRoute>
								<MyFavoritePage />
							</ProtectedRoute>
						)
					},
					{
						path: ":id",
						element: <AccommodationDetailPage />
					}
				]
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
