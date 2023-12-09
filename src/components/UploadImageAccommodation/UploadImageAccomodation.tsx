import { Box, CircularProgress } from "@mui/material";
import classes from "./UploadImageAccomodation.module.scss";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

interface UploadImageProps {
	loadingUpload: boolean;
	handleChangeImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadImageAccomodation = ({ loadingUpload, handleChangeImage }: UploadImageProps): React.JSX.Element => {
	return (
		<>
			<label htmlFor="file-input" className={classes.wrapperFileAvatar}>
				{loadingUpload ? (
					<Box className={classes.loading}>
						<CircularProgress sx={{ color: "#FF385C" }} />
					</Box>
				) : (
					<>
						<AddOutlinedIcon className={classes.iconAdd} />
					</>
				)}
				<input
					type="file"
					id="file-input"
					accept="image/*"
					onChange={handleChangeImage}
					className={classes.file}
				/>
			</label>
		</>
	);
};

export default UploadImageAccomodation;
