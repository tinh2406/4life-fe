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
					<Box className={classes.loading}>
						<CircularProgress sx={{ color: "#FF385C" }} />
					</Box>
				) : (
					<img className={classes.avatar} src={photoURL ? photoURL : DefaultAvatar} alt="Avatar" />
				)}
				<input
					type="file"
					id="file-input"
					accept="image/*"
					onChange={handleChangeAvatar}
					className={classes.file}
				/>
				<AddCircleOutlineIcon className={classes.iconAdd} />
			</label>
		</>
	);
};

export default Avatar;
