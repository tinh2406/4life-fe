import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import classes from "./ConfirmDialog.module.scss";

interface ConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message?: string;
	additionalContent?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	title,
	message,
	onClose,
	open,
	onConfirm,
	additionalContent
}) => {
	return (
		<>
			<Dialog open={open} onClose={onClose}>
				<DialogTitle>{title || "Confirm"}</DialogTitle>
				<DialogContent>
					<DialogContentText>{message || "Confirm do action?"}</DialogContentText>
					{additionalContent}
				</DialogContent>
				<DialogActions>
					<Button className={classes.no_button} variant="outlined" color="info" onClick={onClose}>
						No
					</Button>
					<Button className={classes.yes_button} variant="contained" color="primary" onClick={onConfirm}>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ConfirmDialog;
