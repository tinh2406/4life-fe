import { Button, Grid } from "@mui/material";
import classes from "./BookingDetail.module.scss";
import BookingCard from "../../components/Card/BookingCard";
import { useNavigate, useParams } from "react-router-dom";
import useBookingDetail from "../../hooks/use-booking-detail";
import { useEffect, useState } from "react";
import { calculateDaysDifference, formatDate } from "../../utils/get-date-month";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import dayjs from "dayjs";
import BookingSuccess from "../../assets/images/bookingIcon.png";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import PaymentDialog from "../../components/Dialog/PaymentDialog";

const BookingDetailPage = (): React.JSX.Element => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isLoading } = useBookingDetail(Number(id));
	const [days, setDays] = useState<number>(0);
	const [formatDateForm, setFormatDateForm] = useState({
		checkIn: "",
		checkOut: ""
	});
	const [isOpenAddPostDialog, setIsOpenAddPostDialog] = useState<boolean>(false);
	const handleOpenAddPostDialog = (): void => {
		setIsOpenAddPostDialog(true);
	};

	const handleCloseAddPostDialog = (): void => {
		setIsOpenAddPostDialog(false);
	};

	useEffect(() => {
		if (data?.checkInDate && data?.checkOutDate) {
			const checkIn = dayjs(data?.checkInDate);
			console.log(checkIn);
			const checkOut = dayjs(data?.checkOutDate);
			const diffDays = calculateDaysDifference(checkIn, checkOut);
			setDays(diffDays);
			setFormatDateForm({
				checkIn: formatDate(data?.checkInDate.split("T")[0] ?? ""),
				checkOut: formatDate(data?.checkOutDate.split("T")[0] ?? "")
			});
		}
	}, [data]);
	return (
		<Grid container className={classes.wrapper}>
			<Grid item xs={12} className={classes.icon}>
				<KeyboardBackspaceIcon onClick={() => navigate("/my-bookings")} className={classes.backIcon} />
			</Grid>
			<Grid xs={12} className={classes.wrapperInformation}>
				<Grid xs={5}>
					<BookingCard
						idBooking={Number(id)}
						name={data?.accommodation.name ?? ""}
						address={data?.accommodation.address ?? ""}
						image={data?.accommodation.imageUrls ?? []}
						price={data?.accommodation.price.toString() ?? ""}
						numberOfNights={days.toString()}
						fee={15}
					/>
				</Grid>
				<Grid xs={7} className={classes.wrapperTextNotification}>
					<Grid xs={12} className={classes.textNotification}>
						<img src={BookingSuccess} alt="booking success" className={classes.successIcon} />
					</Grid>
					<Grid xs={12} className={classes.textNotification}>
						Your booking is confirm!
					</Grid>
					<Grid xs={12} className={classes.textNotification}>
						Thank you for booking with us!
					</Grid>
				</Grid>
			</Grid>
			<Grid xs={12} className={classes.line}></Grid>
			<Grid xs={12} className={classes.wrapperInformationDate}>
				<Grid xs={12} className={classes.dateTime}>
					{`Your trip starts ${formatDateForm.checkIn}`}
				</Grid>
				<Grid xs={12} className={classes.dateTimeItem}>
					<DomainVerificationIcon className={classes.iconCheckDate} />
					Check-in {formatDateForm.checkIn}, from {data?.checkInAfter}
				</Grid>
				<Grid xs={12} className={classes.dateTimeItem}>
					<DomainVerificationIcon className={classes.iconCheckDate} />
					Check-out {formatDateForm.checkOut}, until {data?.checkOutBefore}
				</Grid>
			</Grid>
			<Grid xs={12} className={classes.line}></Grid>
			<Grid xs={12} className={classes.totalPrice}>
				<div className={classes.text}>Total price:</div>
				<div className={classes.text}>
					${data?.accommodation?.price ? data?.accommodation?.price * days + 15 : 0}
				</div>
				<div className={`${classes.payment} ${!data?.isPaid ? classes.unpay : classes.paid}`}>
					{data?.isPaid ? "paid" : "unpay"}
				</div>
				<Button variant="contained" className={classes.btnPayment} onClick={handleOpenAddPostDialog}>
					Pay now
				</Button>
			</Grid>
			<PaymentDialog
				id={Number(id)}
				total={data?.accommodation?.price ? data?.accommodation?.price * days + 15 : 0}
				open={isOpenAddPostDialog}
				handleClose={handleCloseAddPostDialog}
			/>
		</Grid>
	);
};

export default BookingDetailPage;
