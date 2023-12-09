import { Grid } from "@mui/material";
import classes from "./Comment.module.scss";

type CommentProps = {
	avatar: string;
	name: string;
	content: string;
	createdAt: string;
};

const Comment = ({ avatar, name, content, createdAt }: CommentProps): React.JSX.Element => {
	return (
		<Grid container className={classes.wrapper}>
			<div className={classes.wrapperAvatar}>
				<img src={avatar} alt="avatar" className={classes.avatar} />
			</div>
			<div className={classes.wrapperContent}>
				<div className={classes.wrapperTitle}>
					<div className={`${classes.text} ${classes.bold}`}>{name}</div>
					<div className={classes.text}>{createdAt}</div>
				</div>
				<div className={classes.text}>{content}</div>
				<div className={classes.line}></div>
			</div>
		</Grid>
	);
};

export default Comment;
