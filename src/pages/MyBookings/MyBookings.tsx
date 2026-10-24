import { Button, Grid, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import useMyBookings from "../../hooks/use-my-bookings";
import classes from "./MyBookings.module.scss";
import BookingListCard from "../../components/Card/BookingListCard";
import { formatDate } from "../../utils/get-date-month";

const MyBookingsPages = (): React.JSX.Element => {
	const { data, isLoading, isError } = useMyBookings();

	return (
		<main className={classes.page}>
			<header className={classes.heading}>
				<h1>My bookings</h1>
				<p>Review your stay dates and payment status.</p>
			</header>

			{isLoading && (
				<Grid container spacing={2} className={classes.bookingGrid} aria-label="Loading your bookings" aria-busy="true">
					{[1, 2, 3, 4].map(item => (
						<Grid key={item} item xs={12} sm={6} lg={4}>
							<div className={classes.skeletonCard}>
								<Skeleton variant="rounded" height={190} />
								<Skeleton width="65%" />
								<Skeleton width="90%" />
							</div>
						</Grid>
					))}
				</Grid>
			)}

			{isError && (
				<section className={classes.statePanel} role="alert">
					<h2>Bookings could not be loaded</h2>
					<p>Check your connection and try again in a moment.</p>
					<Button variant="outlined" onClick={() => window.location.reload()}>Try again</Button>
				</section>
			)}

			{!isLoading && !isError && !data?.length && (
				<section className={classes.statePanel}>
					<h2>No bookings yet</h2>
					<p>When you book a stay, its dates and payment status will appear here.</p>
					<Button component={Link} to="/rooms" variant="contained">Explore stays</Button>
				</section>
			)}

			{!isLoading && !isError && Boolean(data?.length) && (
				<Grid container spacing={2} className={classes.bookingGrid}>
					{data?.map(item => (
						<Grid key={item.id} item xs={12} sm={6} lg={4}>
							<BookingListCard
								idBooking={item.id}
								name={item.accommodation.name}
								address={item.accommodation.address}
								image={item.accommodation.imageUrls}
								price={item.accommodation.price.toString()}
								checkin={formatDate(item.checkInDate.split("T")[0] ?? "")}
								checkout={formatDate(item.checkOutDate.split("T")[0] ?? "")}
								isPaid={item.isPaid}
							/>
						</Grid>
					))}
				</Grid>
			)}
		</main>
	);
};

export default MyBookingsPages;
