import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import classes from "./BookingDialog.module.scss";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaBookingFrom } from "../../utils/get-schema-login-form";
import { calculateDaysDifference } from "../../utils/get-date-month";
import useBooking from "../../hooks/use-booking";
import { Booking } from "../../types/model/booking";
import CircularProgress from "@mui/material/CircularProgress";

interface BookingModalProps {
	id: number;
	open: boolean;
	handleClose: () => void;
	nameAccommodation: string | undefined;
	price: number | undefined;
}

const BookingDialog = ({ id, nameAccommodation, price, open, handleClose }: BookingModalProps): React.JSX.Element => {
	const [checkin, setCheckin] = useState<Dayjs | null>(null);
	const [checkout, setCheckout] = useState<Dayjs | null>(null);
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [isBooking, setIsBooking] = useState<boolean>(false);

	const bookingAccommodation = useBooking();

	const calculateTotalPrice = useCallback(
		(checkin: Dayjs | null, checkout: Dayjs | null): number | undefined => {
			if (price) {
				const days = calculateDaysDifference(checkin, checkout);
				return days * price;
			}
		},
		[price]
	);

	useEffect(() => {
		setTotalPrice(calculateTotalPrice(checkin, checkout) ?? 0);
	}, [checkin, checkout, calculateTotalPrice]);

	const {
		reset,
		handleSubmit,
		formState: { errors },
		control,
		setValue
	} = useForm({
		resolver: yupResolver(schemaBookingFrom)
	});

	const onCancelButtonClick = (): void => {
		reset();
		handleClose();
	};

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		const dataBooking = {
			accommodationId: id,
			checkInDate: data?.checkin,
			checkOutDate: data?.checkout,
			note: ""
		} as Booking;
		setIsBooking(true);
		bookingAccommodation
			.mutateAsync(dataBooking)
			.then(() => {
				handleClose();
				setIsBooking(false);
			})
			.catch(() => {
				setIsBooking(false);
			});
	};

	return (
		<>
			<Dialog open={open} scroll="paper" fullWidth maxWidth="sm">
				<DialogTitle className={classes.dialog_title_wrapper}>{nameAccommodation}</DialogTitle>
				<DialogContent dividers={true}>
					<div className={classes.price}>{`$${price}/1 night`}</div>
					<div className={classes.wrapperDate}>
						<div className={classes.date}>
							<div className={classes.text}>Checkin Date</div>
							<Controller
								name="checkin"
								control={control}
								render={({ field }) => (
									<DatePicker
										slotProps={{
											textField: {
												size: "small",
												variant: "outlined"
											}
										}}
										sx={{
											"& .MuiOutlinedInput-root": {
												fontSize: "16px",
												fontFamily: "K2D",
												height: "50px"
											}
										}}
										format="YYYY-MM-DD"
										value={checkin}
										onChange={date => {
											setCheckin(dayjs(date));
											if (date) {
												const dateStr = date.format("YYYY-MM-DD");
												field.onChange(dateStr);
												setValue("checkin", dateStr);
											}
										}}
										className={classes.datePicker}
									/>
								)}
							/>
							<div className={classes.error}>{errors?.checkin?.message}</div>
						</div>
						<div className={classes.date}>
							<div className={classes.text}>Checkout Date</div>
							<Controller
								name="checkout"
								control={control}
								render={({ field }) => (
									<DatePicker
										slotProps={{
											textField: {
												size: "small",
												variant: "outlined"
											}
										}}
										sx={{
											"& .MuiOutlinedInput-root": {
												fontSize: "16px",
												fontFamily: "K2D",
												height: "50px"
											}
										}}
										format="YYYY-MM-DD"
										value={checkout}
										onChange={date => {
											setCheckout(dayjs(date));
											if (date) {
												const dateStr = date.format("YYYY-MM-DD");
												field.onChange(dateStr);
												setValue("checkout", dateStr);
											}
										}}
										className={classes.datePicker}
									/>
								)}
							/>
							<div className={classes.error}>{errors?.checkout?.message}</div>
						</div>
					</div>
					<div className={classes.line}></div>
					<div className={classes.money}>
						<div className={classes.text}>{`$${price} x ${calculateDaysDifference(
							checkin,
							checkout
						)} nights`}</div>
						<div className={classes.totalPrice}>{`$${totalPrice}`}</div>
					</div>
					<div className={classes.money}>
						<div className={classes.text}>Fee</div>
						<div className={classes.totalPrice}>$15</div>
					</div>
					<div className={classes.line}></div>
					<div className={classes.money}>
						<div className={classes.total}>Total</div>
						<div className={classes.total}>${15 + totalPrice}</div>
					</div>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={e => handleSubmit(onSubmit)(e)} className={classes.buttonSave}>
						{isBooking ? <CircularProgress color="inherit" size={24} /> : "Booking"}
					</Button>
					<Button variant="outlined" onClick={onCancelButtonClick} className={classes.buttonCancel}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default BookingDialog;
