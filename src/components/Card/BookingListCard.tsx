import { Card, CardActionArea, CardContent, IconButton, Typography } from "@mui/material";
import classes from "./BookingListCard.module.scss";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type BookingListCardProps = {
	idBooking: number;
	name: string;
	address: string;
	image: string[];
	price: string;
	checkin: string;
	checkout: string;
	isMyPost?: boolean;
	isPaid?: boolean;
	avatar?: string;
	userBooking?: string;
};

const BookingListCard = ({
	idBooking,
	name,
	address,
	image,
	price,
	checkin,
	checkout,
	isMyPost,
	isPaid,
	avatar,
	userBooking
}: BookingListCardProps): React.JSX.Element => {
	const navigate = useNavigate();
	const swiperRef = useRef<SwiperType>();
	return (
		<Card className={!isMyPost ? classes.bookingCard : undefined} sx={{ margin: "10px", minWidth: 200 }}>
			<div className={classes.wrapperSwiper}>
				<CardActionArea onClick={!isMyPost ? () => navigate(`/my-bookings/${idBooking}`) : undefined}>
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
								<img src={imageUrl} alt={`Slide ${index + 1}`} className={classes.imgAccommodations} />
							</SwiperSlide>
						))}
					</Swiper>
				</CardActionArea>
				<IconButton
					aria-label="Previous accommodation photo"
					onClick={event => { event.stopPropagation(); swiperRef.current?.slidePrev(); }}
					className={classes.navigateBtnLeft}
				>
					<ArrowBackIcon className={classes.arrowIcon} />
				</IconButton>
				<IconButton
					aria-label="Next accommodation photo"
					onClick={event => { event.stopPropagation(); swiperRef.current?.slideNext(); }}
					className={classes.navigateBtnRight}
				>
					<ArrowForwardIcon className={classes.arrowIcon} />
				</IconButton>
			</div>
			<CardActionArea onClick={!isMyPost ? () => navigate(`/my-bookings/${idBooking}`) : undefined}>
				<CardContent>
					<div className={classes.wrapperTitle}>
						<Typography
							gutterBottom
							variant="h5"
							component="div"
							className={`${classes.text} ${classes.name}`}
						>
							{name}
						</Typography>
						{isPaid !== undefined && (
							<div className={`${classes.status} ${isPaid ? classes.paid : classes.unpay}`}>
								{isPaid ? "Paid" : "Payment due"}
							</div>
						)}
					</div>
					<Typography variant="body2" color="text.secondary" className={classes.text}>
						{address}
					</Typography>
					<div className={classes.stayDates}>
						<EventAvailableOutlinedIcon aria-hidden="true" />
						<div>
							<span>Stay dates</span>
							<strong>{checkin} to {checkout}</strong>
						</div>
					</div>
					<div className={classes.line}></div>
					{isMyPost && (
						<div className={classes.wrapperUserBook}>
							<img src={avatar} style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }} />
							<div className={classes.text}>{userBooking} is booked</div>
						</div>
					)}
					<div className={classes.wrapperPrice}>
						<div className={classes.text}>Price per night</div>
						<strong className={classes.price}>{`$${price}`}</strong>
					</div>
					{!isMyPost && <div className={classes.detailsHint}>View booking details <ArrowForwardIcon aria-hidden="true" /></div>}
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default BookingListCard;
