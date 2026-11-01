import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, IconButton } from "@mui/material";
import classes from "./Card.module.scss";
import StarIcon from "@mui/icons-material/Star";
import { useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { useRef, useState } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ConfirmDialog from "../Dialog/ConfirmDialog";

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
	onEdit?: (id: number) => void;
	handleDelete?: () => void;
	setAnchorEl?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
	cardClassName?: string;
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
	onEdit,
	handleDelete,
	setAnchorEl,
	cardClassName
}: CardProps): React.JSX.Element => {
	const navigate = useNavigate();
	const location = useLocation();
	const swiperRef = useRef<SwiperType>();
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

	// Unified drag detection via Pointer Events — works for both mouse and touch,
	// across Swiper (image area) and CardActionArea (text area).
	const pointerStartX = useRef(0);
	const pointerStartY = useRef(0);
	const wasDragged = useRef(false);

	const handlePointerDown = (e: React.PointerEvent): void => {
		pointerStartX.current = e.clientX;
		pointerStartY.current = e.clientY;
		wasDragged.current = false;
	};

	const handlePointerMove = (e: React.PointerEvent): void => {
		const dx = Math.abs(e.clientX - pointerStartX.current);
		const dy = Math.abs(e.clientY - pointerStartY.current);
		if (dx > 6 || dy > 6) wasDragged.current = true;
	};

	const handleNavigate = (): void => {
		if (!wasDragged.current) navigate(`/rooms/${idAccommodation}`, { state: { from: `${location.pathname}${location.search}${location.hash}` } });
	};

	const onCloseConfirmDialog = (): void => {
		setIsConfirmDialogOpen(false);
		setAnchorEl && setAnchorEl(null);
	};

	const onConfirmDelete = (): void => {
		setIsConfirmDialogOpen(false);
		handleDelete && handleDelete();
	};
	return (
		<>
			<Card
				className={cardClassName}
				sx={{ margin: "10px", minWidth: 200 }}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				>
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
						onClick={handleNavigate}
					>
						{image.map((imageUrl, index) => (
							<SwiperSlide key={index}>
							<img src={imageUrl} alt={`${title}, photo ${index + 1}`} className={classes.imgAccommodations} />
							</SwiperSlide>
						))}
					</Swiper>
					<div
						onClick={e => { e.stopPropagation(); swiperRef.current?.slidePrev(); }}
						className={classes.navigateBtnLeft}
					>
						<ChevronLeftRoundedIcon className={classes.arrowIcon} />
					</div>
					<div
						onClick={e => { e.stopPropagation(); swiperRef.current?.slideNext(); }}
						className={classes.navigateBtnRight}
					>
						<ChevronRightRoundedIcon className={classes.arrowIcon} />
					</div>
					{!isMyPost ? (
						<IconButton
							type="button"
							aria-label={isFavorite ? `Remove ${title} from saved places` : `Save ${title}`}
							className={`${classes.wrapperFavorite} ${isFavorite ? classes.wrapperFavoriteActive : ""}`}
							onClick={event => {
								event.stopPropagation();
								if (isFavorite) handleUnFavorite?.(idAccommodation);
								else handleFavorite?.(idAccommodation);
							}}
							onPointerDown={event => event.stopPropagation()}
						>
							{isFavorite ? <FavoriteOutlinedIcon className={classes.favoritedIcon} /> : <FavoriteBorderOutlinedIcon className={classes.favoriteIcon} />}
						</IconButton>
					) : (
						<>
							<IconButton
								type="button"
								aria-label={`Actions for ${title}`}
								className={classes.wrapperFavorite}
								onClick={e => handleClick && handleClick(e, idAccommodation)}
							>
								<MoreVertIcon className={classes.favoriteIcon} />
							</IconButton>
							<Menu
								id="basic-menu"
								anchorEl={anchorEl}
								open={open || false}
								onClose={handleClose}
								MenuListProps={{
									"aria-labelledby": "basic-button"
								}}
							>
								<MenuItem onClick={() => onEdit ? onEdit(idAccommodation) : handleClose && handleClose(idAccommodation)}>Edit</MenuItem>
								<MenuItem
									onClick={() => {
										setIsConfirmDialogOpen(true);
									}}
								>
									Delete
								</MenuItem>
							</Menu>
						</>
					)}
				</div>
				<CardActionArea onClick={handleNavigate}>
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
									{rating.slice(0, 3)}
								</Typography>
							</div>
						</div>
					</CardContent>
				</CardActionArea>
			</Card>
			<ConfirmDialog
				open={isConfirmDialogOpen}
				onClose={onCloseConfirmDialog}
				title="Confirm Deletion"
				message={"Do you want to delete this accommodation?"}
				onConfirm={onConfirmDelete}
			/>
		</>
	);
};

export default ActionAreaCard;
