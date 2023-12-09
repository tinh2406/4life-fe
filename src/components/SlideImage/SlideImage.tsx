import classes from "./SlideImage.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const SlideImage = ({ image }: { image: string[] }): React.JSX.Element => {
	//   const [swiper, setSwiper] = useState<Swiper | null>(null);

	return (
		<Swiper
			// spaceBetween={50}
			// slidesPerView={1}
			pagination={{
				dynamicBullets: true
			}}
			modules={[Pagination]}
			//   onSwiper={(swiper) => setSwiper(swiper)}
			// pagination={{ clickable: true }}
		>
			{image.map((imageUrl, index) => (
				<SwiperSlide key={index}>
					<img src={imageUrl} alt={`Slide ${index}`} className={classes.imgAccommodations} />
				</SwiperSlide>
			))}
		</Swiper>
	);
};

export default SlideImage;
