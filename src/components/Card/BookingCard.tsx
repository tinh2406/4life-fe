import { Card, CardContent, Typography } from "@mui/material";
import classes from "./BookingCard.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

type BookingCardProps = {
	name: string;
	address: string;
	image: string[];
	price: string;
	numberOfNights: string;
	additionalAmount: number;
	totalPrice: number;
};

const BookingCard = ({
	name,
	address,
	image,
	price,
	numberOfNights,
	additionalAmount,
	totalPrice
}: BookingCardProps): React.JSX.Element => {
	const swiperRef = useRef<SwiperType>();
	return (
		<Card sx={{ margin: "10px", minWidth: 200 }}>
			<div className={classes.wrapperSwiper}>
				<Swiper
					className={classes.swiperCustom}
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
						<img src={imageUrl} alt={`${name}, photo ${index + 1}`} className={classes.imgAccommodations} />
						</SwiperSlide>
					))}
				</Swiper>
				<button type="button" aria-label="Previous accommodation photo" onClick={() => swiperRef.current?.slidePrev()} className={classes.navigateBtnLeft}>
					<ArrowLeftIcon className={classes.arrowIcon} />
				</button>
				<button type="button" aria-label="Next accommodation photo" onClick={() => swiperRef.current?.slideNext()} className={classes.navigateBtnRight}>
					<ArrowRightIcon className={classes.arrowIcon} />
				</button>
			</div>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div" className={`${classes.text} ${classes.name}`}>
					{name}
				</Typography>
				<Typography variant="body2" color="text.secondary" className={classes.text}>
					{address}
				</Typography>
				<div className={classes.line}></div>
				<div className={classes.wrapperPrice}>
					<div className={classes.text}>Price per night</div>
					<div className={classes.text}>{`$${price}`}</div>
				</div>
				<div className={classes.wrapperPrice}>
					<div className={classes.text}>{`${numberOfNights} ${Number(numberOfNights) === 1 ? "night" : "nights"}`}</div>
					<div className={classes.text}>{`$${Number(price) * Number(numberOfNights)}`}</div>
				</div>
				<div className={classes.wrapperPrice}>
					<div className={classes.text}>Fees &amp; adjustments</div>
					<div className={classes.text}>{`${additionalAmount < 0 ? "-$" : "$"}${Math.abs(additionalAmount)}`}</div>
				</div>
				<div className={classes.line}></div>
				<div className={classes.wrapperPrice}>
					<div className={`${classes.text} ${classes.total}`}>TOTAL</div>
					<div className={`${classes.text} ${classes.total}`}>{`$${totalPrice}`}</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default BookingCard;
