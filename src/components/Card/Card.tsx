import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import classes from "./Card.module.scss";
import HotelImg from "../../assets/images/hotel.png";
import StarIcon from "@mui/icons-material/Star";

type CardProps = {
	title: string;
	content: string;
	image: string;
	price: string;
	rating: string;
};

const ActionAreaCard = ({ title, content, image, price, rating }: CardProps): React.JSX.Element => {
	return (
		<Card sx={{ margin: "10px", minWidth: 200 }}>
			<CardActionArea>
				<CardMedia
					component="img"
					image={image ? image : HotelImg}
					alt="accomadtion image"
					className={classes.imgAccommodations}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div" className={`${classes.text} ${classes.name}`}>
						{title}
					</Typography>
					<Typography variant="body2" color="text.secondary" className={classes.text}>
						{content}
					</Typography>
					<div className={classes.wraperRating}>
						<Typography
							variant="body2"
							color="text.secondary"
							className={`${classes.text} ${classes.footer}`}
						>
							{`$${price}/1 night`}
						</Typography>
						<div className={classes.wrapperRating}>
							<StarIcon className={classes.startIcon} />
							<Typography
								variant="body2"
								color="text.secondary"
								className={`${classes.text} ${classes.footer}`}
							>
								{rating}
							</Typography>
						</div>
					</div>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default ActionAreaCard;
