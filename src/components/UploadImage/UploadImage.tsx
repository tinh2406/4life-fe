import { Box, CircularProgress } from "@mui/material";
import classes from "./UploadImage.module.scss";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

interface UploadImageProps {
	loadingUpload: boolean;
	handleChangeImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
	photoURL?: string;
}

const UploadImage = ({ loadingUpload, handleChangeImage, photoURL }: UploadImageProps): React.JSX.Element => {
	return (
		<>
			<label htmlFor="file-input" className={classes.wrapperFileAvatar}>
				{loadingUpload ? (
					<Box className={classes.loading}>
						<CircularProgress sx={{ color: "#FF385C" }} />
					</Box>
				) : (
					<>
						{photoURL ? (
							<img className={classes.avatar} src={photoURL} alt="Image Identity" />
						) : (
							<AddOutlinedIcon className={classes.iconAdd} />
						)}
					</>
				)}
				<input
					type="file"
					id="file-input"
					accept="image/*"
					onChange={handleChangeImage}
					className={classes.file}
				/>
				{/* <AddCircleIcon className={classes.iconAdd} /> */}
			</label>
		</>
	);
};

export default UploadImage;
