import { Box, CircularProgress } from "@mui/material";
import classes from "./UploadImage.module.scss";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

interface UploadImageProps {
	loadingUpload: boolean;
	handleChangeImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
	photoURL?: string;
	inputId?: string;
	label?: string;
}

const UploadImage = ({ loadingUpload, handleChangeImage, photoURL, inputId = "file-input", label = "Identity document" }: UploadImageProps): React.JSX.Element => {
	return (
		<>
			<label htmlFor={inputId} className={classes.wrapperFileAvatar}>
				{loadingUpload ? (
					<Box className={classes.loading} role="status" aria-label={`Uploading ${label.toLowerCase()}`}>
						<CircularProgress size={28} sx={{ color: "#2f7668" }} />
					</Box>
				) : (
					<>
						{photoURL ? (
							<img className={classes.avatar} src={photoURL} alt={`${label} preview`} />
						) : (
							<div className={classes.uploadPrompt}>
								<AddOutlinedIcon className={classes.iconAdd} />
								<span>Choose image</span>
							</div>
						)}
					</>
				)}
				<input
					type="file"
					id={inputId}
					accept="image/*"
					aria-label={`Upload ${label.toLowerCase()}`}
					onChange={handleChangeImage}
					className={classes.file}
				/>
			</label>
		</>
	);
};

export default UploadImage;
