import { Grid, Skeleton } from "@mui/material";
import useMyBookings from "../../hooks/use-my-bookings";
import classes from "./MyBookings.module.scss";
import BookingListCard from "../../components/Card/BookingListCard";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/get-date-month";

const MyBookingsPages = (): React.JSX.Element => {
	const { data, isLoading } = useMyBookings();
	const [formatDateForm, setFormatDateForm] = useState([
		{
			checkIn: "",
			checkOut: ""
		}
	]);
	useEffect(() => {
		data?.map(item => {
			setFormatDateForm(date => {
				return [
					...date,
					{
						checkIn: formatDate(item.checkInDate.split("T")[0] ?? ""),
						checkOut: formatDate(item.checkOutDate.split("T")[0] ?? "")
					}
				];
			});
		});
	}, [data]);
	return (
		<Grid container>
			<Grid xs={12} className={classes.wrapperRooms}>
				{isLoading &&
					[1, 2, 3, 4].map((item, index) => (
						<Grid key={index} xs={6} sm={4} md={3} className={classes.roomItem}>
							<Skeleton variant="rectangular" width={300} height={150} />
							<Skeleton width="60%" />
						</Grid>
					))}
				{data?.map((item, index) => (
					<Grid xs={6} sm={4} md={3} className={classes.roomItem}>
						<BookingListCard
							idBooking={item.id}
							name={item.accommodation.name}
							address={item.accommodation.address}
							image={item.accommodation.imageUrls}
							price={item.accommodation.price.toString()}
							checkin={formatDateForm[index]?.checkIn}
							checkout={formatDateForm[index]?.checkOut}
						/>
					</Grid>
				))}
			</Grid>
		</Grid>
	);
};

export default MyBookingsPages;
