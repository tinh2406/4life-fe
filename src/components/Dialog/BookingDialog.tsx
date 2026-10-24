import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import classes from "./BookingDialog.module.scss";
import { schemaBookingFrom } from "../../utils/get-schema-login-form";
import { calculateDaysDifference } from "../../utils/get-date-month";
import useBooking from "../../hooks/use-booking";
import { Booking } from "../../types/model/booking";

interface BookingDialogProps {
	id: number;
	open: boolean;
	handleClose: () => void;
	nameAccommodation: string | undefined;
	price: number | undefined;
}

type BookingFormValues = {
	checkin: string;
	checkout: string;
};

const BOOKING_FEE = 15;

const BookingDialog = ({ id, nameAccommodation, price, open, handleClose }: BookingDialogProps): React.JSX.Element => {
	const bookingAccommodation = useBooking();
	const { reset, handleSubmit, setValue, formState: { errors }, control } = useForm<BookingFormValues>({
		resolver: yupResolver(schemaBookingFrom),
		defaultValues: { checkin: "", checkout: "" }
	});
	const checkinValue = useWatch({ control, name: "checkin" });
	const checkoutValue = useWatch({ control, name: "checkout" });
	const checkin = checkinValue ? dayjs(checkinValue) : null;
	const checkout = checkoutValue ? dayjs(checkoutValue) : null;
	const nights = calculateDaysDifference(checkin, checkout);
	const subtotal = Math.max(0, nights * (price ?? 0));

	const handleCancel = (): void => {
		if (bookingAccommodation.isLoading) return;
		reset();
		handleClose();
	};

	const submitBooking: SubmitHandler<BookingFormValues> = async values => {
		const booking: Booking = {
			accommodationId: id,
			checkInDate: values.checkin,
			checkOutDate: values.checkout,
			note: ""
		};

		try {
			await bookingAccommodation.mutateAsync(booking);
			reset();
			handleClose();
		} catch {
			// useBooking already shows the booking error to the user.
		}
	};

	return (
		<Dialog open={open} onClose={handleCancel} scroll="paper" fullWidth maxWidth="sm" aria-labelledby="booking-dialog-title">
			<form className={classes.form} onSubmit={handleSubmit(submitBooking)}>
				<DialogTitle id="booking-dialog-title" className={classes.dialogTitle}>
					<div>Confirm your stay</div>
					<Typography component="p" className={classes.accommodationName}>{nameAccommodation}</Typography>
				</DialogTitle>
				<DialogContent dividers>
					<div className={classes.price}>{`$${price}/1 night`}</div>
					<div className={classes.wrapperDate}>
						<div className={classes.date}>
							<Controller
								name="checkin"
								control={control}
								render={({ field }) => (
									<DatePicker
										label="Check-in"
										format="DD MMM YYYY"
										value={field.value ? dayjs(field.value) : null}
										onChange={date => {
											field.onChange(date?.format("YYYY-MM-DD") ?? "");
											if (date && checkout && !checkout.isAfter(date, "day")) {
												setValue("checkout", "", { shouldDirty: true, shouldValidate: true });
											}
										}}
										slotProps={{
											textField: {
												fullWidth: true,
												onBlur: field.onBlur,
												inputRef: field.ref,
												error: Boolean(errors.checkin),
												helperText: errors.checkin?.message
											}
										}}
									/>
								)}
							/>
						</div>
						<div className={classes.date}>
							<Controller
								name="checkout"
								control={control}
								render={({ field }) => {
									return (
										<DatePicker
											label="Check-out"
											format="DD MMM YYYY"
											value={field.value ? dayjs(field.value) : null}
											minDate={checkin?.add(1, "day")}
											onChange={date => field.onChange(date?.format("YYYY-MM-DD") ?? "")}
											slotProps={{
												textField: {
													fullWidth: true,
													onBlur: field.onBlur,
													inputRef: field.ref,
													error: Boolean(errors.checkout),
													helperText: errors.checkout?.message
												}
											}}
										/>
									);
								}}
							/>
						</div>
					</div>
					<div className={classes.line} />
					{price !== undefined && (
						<div className={classes.money}>
							<div className={classes.text}>{`$${price} × ${nights} ${nights === 1 ? "night" : "nights"}`}</div>
							<div className={classes.totalPrice}>{`$${subtotal}`}</div>
						</div>
					)}
					<div className={classes.money}>
						<div className={classes.text}>Fee</div>
						<div className={classes.totalPrice}>${BOOKING_FEE}</div>
					</div>
					<div className={classes.line} />
					{nights > 0 ? (
						<div className={`${classes.money} ${classes.totalRow}`}>
							<div className={classes.total}>Total</div>
							<div className={classes.total}>${BOOKING_FEE + subtotal}</div>
						</div>
					) : (
						<p className={classes.dateHint}>Choose your dates to see the total.</p>
					)}
				</DialogContent>
				<DialogActions className={classes.dialogActions}>
					<LoadingButton type="submit" variant="contained" className={classes.buttonSave} loading={bookingAccommodation.isLoading}>
						Create booking
					</LoadingButton>
					<Button type="button" variant="outlined" onClick={handleCancel} className={classes.buttonCancel} disabled={bookingAccommodation.isLoading}>
						Cancel
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default BookingDialog;
