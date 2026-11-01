import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import classes from "./BookingDetail.module.scss";
import BookingCard from "../../components/Card/BookingCard";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useBookingDetail from "../../hooks/use-booking-detail";
import dayjs from "dayjs";
import PaymentDialog from "../../components/Dialog/PaymentDialog";
import { convertTo12HourFormat } from "../../utils/mapper";
import { useNotify } from "../../context/notify";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useEffect } from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { LoadingButton } from "@mui/lab";
import useCancelBooking from "../../hooks/use-cancel-booking";

const BookingDetailPage = (): React.JSX.Element => {
	const { id } = useParams();
	const bookingId = Number(id);
	const location = useLocation();
	const navigate = useNavigate();
	const { data, isLoading, isError } = useBookingDetail(bookingId);
	const { isPaid: hasPaymentNotification, setIsPaid: clearPaymentNotification } = useNotify();
	const queryClient = useQueryClient();
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const cancelBookingMutation = useCancelBooking();
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
	const handleCancelBooking = (): void => cancelBookingMutation.mutate(bookingId);

	return (
		<main className={classes.wrapper}>
			<Button onClick={() => navigate("/my-bookings")} startIcon={<KeyboardBackspaceIcon />} className={classes.backButton}>
				My bookings
			</Button>
			<header className={classes.pageHeading}>
				<div>
					<h1>{data.accommodation.name}</h1>
					<p>{data.accommodation.address}</p>
					<Button
						component={Link}
						to={`/rooms/${data.accommodation.id}`}
						state={{ from: `${location.pathname}${location.search}${location.hash}` }}
						className={classes.viewAccommodationButton}
						endIcon={<ArrowForwardIcon />}
					>
						View place details
					</Button>
				</div>
				<span className={`${classes.paymentStatus} ${isPaid ? classes.paid : classes.unpaid}`} role="status">
					{isPaid ? "Paid" : "Payment due"}
				</span>
			</header>
			<section className={classes.staySummary} aria-label="Stay dates">
				<div className={classes.stayDate}>
					<CalendarMonthOutlinedIcon aria-hidden="true" />
					<div>
						<span>Check-in</span>
						<strong>{dayjs(data.checkInDate).format("ddd, DD MMM YYYY")}</strong>
					</div>
				</div>
				<div className={classes.stayDivider} aria-hidden="true" />
				<div className={classes.stayDate}>
					<CalendarMonthOutlinedIcon aria-hidden="true" />
					<div>
						<span>Check-out</span>
						<strong>{dayjs(data.checkOutDate).format("ddd, DD MMM YYYY")}</strong>
					</div>
				</div>
				<div className={classes.nightsSummary}>
					<NightsStayOutlinedIcon aria-hidden="true" />
					<strong>{days} {days === 1 ? "night" : "nights"}</strong>
				</div>
			</section>

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
						isPaid={isPaid}
						onPay={handleOpenPayment}
					/>
				</section>
				<section className={classes.tripDetails} aria-labelledby="trip-details-heading">
					<h2 id="trip-details-heading">Arrival and departure</h2>
					<div className={classes.dateTimeItem}>
						<DomainVerificationIcon className={classes.iconCheckDate} />
						<span>Check-in from <strong>{convertTo12HourFormat(data.accommodation.checkInAfter)}</strong></span>
					</div>
					<div className={classes.dateTimeItem}>
						<DomainVerificationIcon className={classes.iconCheckDate} />
						<span>Check-out by <strong>{convertTo12HourFormat(data.accommodation.checkOutBefore)}</strong></span>
					</div>
					<Button
						variant="outlined"
						className={classes.cancelButton}
						onClick={() => setIsCancelDialogOpen(true)}
					>
						Cancel booking
					</Button>
				</section>
			</div>
			<Dialog
				open={isCancelDialogOpen}
				onClose={() => { if (!cancelBookingMutation.isLoading) setIsCancelDialogOpen(false); }}
				aria-labelledby="cancel-booking-title"
				aria-describedby="cancel-booking-description"
			>
				<DialogTitle id="cancel-booking-title">Cancel this booking?</DialogTitle>
				<DialogContent>
					<DialogContentText id="cancel-booking-description">
						This booking will be removed from your bookings. Do you want to continue?
					</DialogContentText>
				</DialogContent>
				<DialogActions className={classes.cancelDialogActions}>
					<Button onClick={() => setIsCancelDialogOpen(false)} disabled={cancelBookingMutation.isLoading}>Keep booking</Button>
					<LoadingButton loading={cancelBookingMutation.isLoading} onClick={handleCancelBooking} className={classes.confirmCancelButton}>
						Cancel booking
					</LoadingButton>
				</DialogActions>
			</Dialog>
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
