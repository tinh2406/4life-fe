import { Box, CircularProgress } from "@mui/material";
import classes from "./Avatar.module.scss";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DefaultAvatar from "../../assets/images/defaultAvatar.jpg";

interface AvatarProps {
	loadingUploadAvatar: boolean;
	handleChangeAvatar: (event: React.ChangeEvent<HTMLInputElement>) => void;
	photoURL?: string;
}

const Avatar = ({ loadingUploadAvatar, handleChangeAvatar, photoURL }: AvatarProps): React.JSX.Element => {
	return (
		<>
			<label htmlFor="file-input" className={classes.wrapperFileAvatar}>
				{loadingUploadAvatar ? (
					<Box className={classes.loading} role="status" aria-label="Uploading profile photo">
						<CircularProgress size={28} sx={{ color: "#2f7668" }} />
					</Box>
				) : (
					<img className={classes.avatar} src={photoURL ? photoURL : DefaultAvatar} alt="Profile" />
				)}
				<input
					type="file"
					id="file-input"
					accept="image/*"
					aria-label="Change profile photo"
					onChange={handleChangeAvatar}
					className={classes.file}
				/>
				<AddCircleOutlineIcon className={classes.iconAdd} />
			</label>
		</>
	);
};

export default Avatar;
