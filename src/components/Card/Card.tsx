import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import classes from "./Card.module.scss";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

type CardProps = {
	idAccommodation: number;
	title: string;
	type: string;
	content: string;
	image: string[];
	price: string;
	rating: string;
	isFavorite: boolean;
	handleFavorite?: (id: number) => void;
	handleUnFavorite?: (id: number) => void;
	isMyPost?: boolean;
	open?: boolean;
	anchorEl?: HTMLElement | null;
	handleClick?: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void;
	handleClose?: (id: number) => void;
	handleDelete?: () => void;
};

const ActionAreaCard = ({
	idAccommodation,
	title,
	type,
	content,
	image,
	price,
	rating,
	isFavorite,
	handleFavorite,
	handleUnFavorite,
	isMyPost,
	open,
	anchorEl,
	handleClick,
	handleClose,
	handleDelete
}: CardProps): React.JSX.Element => {
	const navigate = useNavigate();
	const swiperRef = useRef<SwiperType>();
	return (
		<Card sx={{ margin: "10px", minWidth: 200 }}>
			<div className={classes.wrapperSwiper}>
				<Swiper
					pagination={{
						dynamicBullets: true,
						clickable: true
					}}
					modules={[Pagination, Navigation]}
					onBeforeInit={swiper => {
						swiperRef.current = swiper;
					}}
				>
					{image.map((imageUrl, index) => (
						<SwiperSlide key={index}>
							<img src={imageUrl} alt={`Slide ${index}`} className={classes.imgAccommodations} />
						</SwiperSlide>
					))}
				</Swiper>
				<div onClick={() => swiperRef.current?.slidePrev()} className={classes.navigateBtnLeft}>
					<ArrowLeftIcon className={classes.arrowIcon} />
				</div>
				<div onClick={() => swiperRef.current?.slideNext()} className={classes.navigateBtnRight}>
					<ArrowRightIcon className={classes.arrowIcon} />
				</div>
				{!isFavorite && !isMyPost ? (
					<div
						className={classes.wrapperFavorite}
						onClick={() => handleFavorite && handleFavorite(idAccommodation)}
					>
						<FavoriteBorderOutlinedIcon className={classes.favoriteIcon} />
					</div>
				) : isFavorite && !isMyPost ? (
					<div
						className={classes.wrapperFavorite}
						onClick={() => handleUnFavorite && handleUnFavorite(idAccommodation)}
					>
						<FavoriteOutlinedIcon className={classes.favoritedIcon} />
					</div>
				) : (
					<>
						<button
							className={classes.wrapperFavorite}
							onClick={e => handleClick && handleClick(e, idAccommodation)}
						>
							<MoreVertIcon className={classes.favoriteIcon} />
						</button>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open || false}
							onClose={handleClose}
							MenuListProps={{
								"aria-labelledby": "basic-button"
							}}
						>
							<MenuItem onClick={() => handleClose && handleClose(idAccommodation)}>Edit</MenuItem>
							<MenuItem onClick={handleDelete}>Delete</MenuItem>
						</Menu>
					</>
				)}
			</div>
			<CardActionArea onClick={() => navigate(`/rooms/${idAccommodation}`)}>
				<CardContent>
					<div className={classes.wrapperTitle}>
						<Typography
							gutterBottom
							variant="h5"
							component="div"
							className={`${classes.text} ${classes.name}`}
						>
							{title}
						</Typography>
						<Typography gutterBottom component="div" className={`${classes.text} ${classes.footer}`}>
							{type}
						</Typography>
					</div>
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
