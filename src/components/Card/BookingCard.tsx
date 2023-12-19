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
	idBooking: number;
	name: string;
	address: string;
	image: string[];
	price: string;
	numberOfNights: string;
	fee: number;
};

const BookingCard = ({
	idBooking,
	name,
	address,
	image,
	price,
	numberOfNights,
	fee
}: BookingCardProps): React.JSX.Element => {
	const swiperRef = useRef<SwiperType>();
	console.log(idBooking);
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
			<CardContent>
				<Typography gutterBottom variant="h5" component="div" className={`${classes.text} ${classes.name}`}>
					{name}
				</Typography>
				<Typography variant="body2" color="text.secondary" className={classes.text}>
					{address}
				</Typography>
				<div className={classes.line}></div>
				{/* <div className={classes.wrapperPrice}>
					<img
						src="https://hoaminhngoc.vn/wp-content/uploads/2023/01/cute-1-300x300.png"
						style={{ width: 40, height: 40, borderRadius: "50%" }}
					/>
					<div className={classes.text}>Aaaa</div>
				</div> */}
				<div className={classes.wrapperPrice}>
					<div className={classes.text}>Price per night</div>
					<div className={classes.text}>{`$${price}`}</div>
				</div>
				<div className={classes.wrapperPrice}>
					<div className={classes.text}>{`$${numberOfNights} nights`}</div>
					<div className={classes.text}>{`$${Number(price) * Number(numberOfNights)}`}</div>
				</div>
				<div className={classes.wrapperPrice}>
					<div className={classes.text}>Fee</div>
					<div className={classes.text}>${fee}</div>
				</div>
				<div className={classes.line}></div>
				<div className={classes.wrapperPrice}>
					<div className={`${classes.text} ${classes.total}`}>TOTAL</div>
					<div className={`${classes.text} ${classes.total}`}>{`$${
						Number(price) * Number(numberOfNights) + fee
					}`}</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default BookingCard;
