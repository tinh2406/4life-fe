import {
	Autocomplete,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListSubheader,
	TextField
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import classes from "./PaymentDialog.module.scss";
import { allBanks } from "../../utils/get-all-bank";
import { useState } from "react";
import { Payment } from "../../types/model/payment";
import { payment } from "../../api/booking.api";

interface BookingModalProps {
	id: number;
	total: number;
	open: boolean;
	handleClose: () => void;
}

type Bank = (typeof allBanks)[number];

const BookingDialog = ({ id, total, open, handleClose }: BookingModalProps): React.JSX.Element => {
	const [bankCode, setBankCode] = useState<string>("");
	const [isPaying, setIsPaying] = useState(false);
	const [paymentError, setPaymentError] = useState("");
	const onCancelButtonClick = (): void => {
		if (isPaying) return;
		setBankCode("");
		setPaymentError("");
		handleClose();
	};
	const renderOption = (props: object, option: Bank) => (
		<ListItem {...props}>
			<ListItemAvatar>
				<img src={option.logo} alt={option.name} className={classes.logoBank} />
			</ListItemAvatar>
			<ListItemText primary={option.short_name} />
		</ListItem>
	);

	const handleChange = (_event: React.ChangeEvent<unknown>, value: Bank | null) => {
		setBankCode(value?.shortName ?? "");
		setPaymentError("");
	};

	const handlePay = async () => {
		if (bankCode === "") {
			setPaymentError("Choose a bank to continue.");
			return;
		}
		setIsPaying(true);
		setPaymentError("");
		const paymentWindow = window.open("about:blank", "_blank");
		const paymentData: Payment = {
			bookingId: id,
			bankCode: bankCode,
			amount: total,
			orderDesc: ""
		};
		try {
			const res = await payment(paymentData);
			if (res) {
				const paymentUrl = new URL(res);
				if (paymentUrl.protocol !== "https:" && paymentUrl.protocol !== "http:") {
					throw new Error("Unsupported payment URL protocol");
				}
				setBankCode("");
				handleClose();
				if (paymentWindow) {
					paymentWindow.opener = null;
					paymentWindow.location.href = paymentUrl.href;
				} else {
					window.location.assign(paymentUrl.href);
				}
			} else {
				paymentWindow?.close();
				setPaymentError("We could not start the payment. Please try again.");
			}
		} catch {
			paymentWindow?.close();
			setPaymentError("We could not start the payment. Please try again.");
		} finally {
			setIsPaying(false);
		}
	};

	return (
		<>
			<Dialog open={open} onClose={onCancelButtonClick} scroll="paper" fullWidth maxWidth="sm" aria-labelledby="payment-dialog-title">
				<DialogTitle id="payment-dialog-title" className={classes.dialogTitle}>Choose a payment bank</DialogTitle>
				<DialogContent dividers={true}>
					<p className={classes.amount}>Amount due <strong>${total}</strong></p>
					<Autocomplete
						options={allBanks}
						getOptionLabel={option => option.short_name}
						renderOption={renderOption}
						renderInput={params => (
							<TextField {...params} label="Bank" variant="outlined" error={Boolean(paymentError)} helperText={paymentError} />
						)}
						renderGroup={params => <ListSubheader component="div" id="grouped-banks" {...params} />}
						onChange={handleChange}
					/>
				</DialogContent>
				<DialogActions className={classes.dialogActions}>
					<LoadingButton variant="contained" className={classes.buttonSave} onClick={() => void handlePay()} loading={isPaying}>
						Continue to payment
					</LoadingButton>
					<Button variant="outlined" onClick={onCancelButtonClick} className={classes.buttonCancel} disabled={isPaying}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default BookingDialog;
