import { Button, Skeleton } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import classes from "./BookingDetail.module.scss";
import BookingCard from "../../components/Card/BookingCard";
import { useNavigate, useParams } from "react-router-dom";
import useBookingDetail from "../../hooks/use-booking-detail";
import dayjs from "dayjs";
import PaymentDialog from "../../components/Dialog/PaymentDialog";
import { convertTo12HourFormat } from "../../utils/mapper";
import { useNotify } from "../../context/notify";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useEffect } from "react";

const BookingDetailPage = (): React.JSX.Element => {
	const { id } = useParams();
	const bookingId = Number(id);
	const navigate = useNavigate();
	const { data, isLoading, isError } = useBookingDetail(bookingId);
	const { isPaid: hasPaymentNotification, setIsPaid: clearPaymentNotification } = useNotify();
	const queryClient = useQueryClient();
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
	const days = data ? dayjs(data.checkOutDate).diff(dayjs(data.checkInDate), "day") : 0;
	const isPaid = Boolean(data?.isPaid);

	useEffect(() => {
		if (hasPaymentNotification) {
			void queryClient.invalidateQueries(["booking-detail", bookingId]);
			clearPaymentNotification(false);
		}
	}, [bookingId, clearPaymentNotification, hasPaymentNotification, queryClient]);

	if (isError) {
		return (
			<main className={classes.wrapper}>
				<Button onClick={() => navigate("/my-bookings")} startIcon={<KeyboardBackspaceIcon />} className={classes.backButton}>
					My bookings
				</Button>
				<p className={classes.stateMessage} role="alert">We could not load this booking. Return to your bookings and try again.</p>
			</main>
		);
	}

	if (isLoading || !data) {
		return (
			<main className={classes.wrapper}>
				<Skeleton variant="rounded" height={280} />
				<Skeleton width="60%" />
			</main>
		);
	}

	const handleOpenPayment = (): void => setIsPaymentDialogOpen(true);
	const handleClosePayment = (): void => setIsPaymentDialogOpen(false);

	return (
		<main className={classes.wrapper}>
			<Button onClick={() => navigate("/my-bookings")} startIcon={<KeyboardBackspaceIcon />} className={classes.backButton}>
				My bookings
			</Button>
			<header className={classes.pageHeading}>
				<div>
					<h1>Booking details</h1>
					<p>{data.accommodation.name}</p>
				</div>
				<span className={`${classes.paymentStatus} ${isPaid ? classes.paid : classes.unpaid}`} role="status">
					{isPaid ? "Paid" : "Payment due"}
				</span>
			</header>

			<div className={classes.bookingLayout}>
				<section className={classes.bookingCard} aria-label="Booking cost summary">
					<BookingCard
						name={data.accommodation.name}
						address={data.accommodation.address}
						image={data.accommodation.imageUrls}
						price={data.accommodation.price.toString()}
						numberOfNights={days.toString()}
						additionalAmount={data.totalPrice - data.accommodation.price * days}
						totalPrice={data.totalPrice}
					/>
				</section>
				<section className={classes.tripDetails} aria-labelledby="trip-details-heading">
					<h2 id="trip-details-heading">Your trip</h2>
					<p className={classes.tripRange}>
						{dayjs(data.checkInDate).format("ddd, DD MMM YYYY")} – {dayjs(data.checkOutDate).format("ddd, DD MMM YYYY")}
					</p>
					<div className={classes.dateTimeItem}>
						<DomainVerificationIcon className={classes.iconCheckDate} />
						<span>Check-in <strong>{dayjs(data.checkInDate).format("DD MMM YYYY")}</strong>, from {convertTo12HourFormat(data.accommodation.checkInAfter)}</span>
					</div>
					<div className={classes.dateTimeItem}>
						<DomainVerificationIcon className={classes.iconCheckDate} />
						<span>Check-out <strong>{dayjs(data.checkOutDate).format("DD MMM YYYY")}</strong>, until {convertTo12HourFormat(data.accommodation.checkOutBefore)}</span>
					</div>
					<div className={classes.totalPrice}>
						<div>
							<span className={classes.totalLabel}>Total price</span>
							<strong>${data.totalPrice}</strong>
						</div>
						{isPaid ? (
							<span className={classes.paidNotice}>Payment complete</span>
						) : (
							<Button variant="contained" className={classes.btnPayment} onClick={handleOpenPayment}>Pay now</Button>
						)}
					</div>
				</section>
			</div>
			<PaymentDialog
				id={bookingId}
				total={data.totalPrice}
				open={isPaymentDialogOpen}
				handleClose={handleClosePayment}
			/>
		</main>
	);
};

export default BookingDetailPage;
