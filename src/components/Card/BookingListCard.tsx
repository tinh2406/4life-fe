import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import classes from "./BookingListCard.module.scss";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

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
	isPaid
}: BookingListCardProps): React.JSX.Element => {
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
			</div>
			<CardActionArea onClick={() => navigate(`${idBooking}`)}>
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
						{isMyPost && (
							<div className={`${classes.status} ${isPaid ? classes.paid : classes.unpay}`}>
								{isPaid ? "paid" : "un pay"}
							</div>
						)}
					</div>
					<Typography variant="body2" color="text.secondary" className={classes.text}>
						{address}
					</Typography>
					<div className={classes.line}></div>
					<div className={classes.wrapperPrice}>
						<div className={classes.text}>Price per night</div>
						<div className={classes.text}>{`$${price}`}</div>
					</div>
					<div className={classes.wrapperCheckTime}>
						<div className={classes.text}>Check-in </div>
						<Typography variant="body2" color="text.secondary" className={classes.text}>
							{checkin}
						</Typography>
					</div>
					<div className={classes.wrapperCheckTime}>
						<div className={classes.text}>Check-out</div>
						<Typography variant="body2" color="text.secondary" className={classes.text}>
							{checkout}
						</Typography>
					</div>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default BookingListCard;
