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
import classes from "./PaymentDialog.module.scss";
import { allBanks } from "../../utils/get-all-bank";
import { useState } from "react";
import { Payment } from "../../types/model/payment";
import { payment } from "../../api/booking.api";
import { toast } from "react-toastify";

interface BookingModalProps {
	id: number;
	total: number;
	open: boolean;
	handleClose: () => void;
}

interface Bank {
	id: number;
	name: string;
	code: string;
	bin: string;
	shortName: string;
	logo: string;
	transferSupported: number;
	lookupSupported: number;
	short_name: string;
	support: number;
	isTransfer: number;
	swift_code: string;
}

const BookingDialog = ({ id, total, open, handleClose }: BookingModalProps): React.JSX.Element => {
	const [bankCode, setBankCode] = useState<string>("");
	const onCancelButtonClick = (): void => {
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
		if (value) {
			setBankCode(value.shortName);
		}
	};

	const handlePay = async () => {
		if (bankCode === "") {
			toast.error("Please select a bank");
			return;
		}
		const paymentData = {
			bookingId: id,
			bankCode: bankCode,
			amount: total,
			orderDesc: ""
		} as Payment;
		const res = await payment(paymentData);
		if (res) {
			handleClose();
			window.open(res, "_blank");
		}
	};

	return (
		<>
			<Dialog open={open} scroll="paper" fullWidth maxWidth="sm">
				<DialogTitle className={classes.dialog_title_wrapper}>Payment</DialogTitle>
				<DialogContent dividers={true}>
					<Autocomplete
						options={allBanks as Bank[]}
						getOptionLabel={option => option.short_name}
						renderOption={renderOption}
						renderInput={params => <TextField {...params} label="Select Bank" variant="outlined" />}
						renderGroup={params => <ListSubheader component="div" id="grouped-banks" {...params} />}
						onChange={handleChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" className={classes.buttonSave} onClick={handlePay}>
						Pay
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
