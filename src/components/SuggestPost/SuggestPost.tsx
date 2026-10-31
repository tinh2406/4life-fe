import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { RoomResponse } from "../../types/axios/paging";
import ActionAreaCard from "../Card/Card";
import classes from "./SuggestPost.module.scss";

type SuggestPostProps = {
	posts: RoomResponse[];
	handleFavorite: (id: number) => void;
	handleUnFavorite: (id: number) => void;
};

/** Returns the current slidesToShow count matching the responsive breakpoints. */
const getSlidesToShow = (): number => {
	const w = window.innerWidth;
	if (w < 480) return 1;
	if (w < 768) return 2;
	if (w < 1024) return 3;
	return 4;
};

const SuggestPost = ({ posts, handleFavorite, handleUnFavorite }: SuggestPostProps): React.JSX.Element => {
	const sliderRef = useRef<Slider>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Custom drag tracking — disabled react-slick's built-in swipe so we can
	// compute how many slides to jump proportionally to drag distance.
	const dragStartX = useRef<number | null>(null);
	const currentSlide = useRef(0);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
		dragStartX.current = e.clientX;
	};

	const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
		if (dragStartX.current === null) return;
		const dx = e.clientX - dragStartX.current;
		dragStartX.current = null;

		// Threshold: ignore tiny moves so button/card clicks still work
		if (Math.abs(dx) < 10) return;

		const containerWidth = containerRef.current?.offsetWidth ?? window.innerWidth;
		const slidesToShow = getSlidesToShow();
		const cardWidth = containerWidth / slidesToShow;

		// Round drag distance to number of cards (minimum 1)
		const count = Math.max(1, Math.round(Math.abs(dx) / cardWidth));
		const target = dx < 0
			? currentSlide.current + count   // dragged left → forward
			: currentSlide.current - count;  // dragged right → backward

		sliderRef.current?.slickGoTo(target);
	};

	const settings = {
		dots: true,
		infinite: true,
		speed: 400,
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: false,
		// Disable slick's own drag so our pointer handler is the sole driver
		swipe: false,
		draggable: false,
		afterChange: (index: number): void => { currentSlide.current = index; },
		responsive: [
			{
				breakpoint: 1024,
				settings: { slidesToShow: 3 }
			},
			{
				breakpoint: 768,
				settings: { slidesToShow: 2 }
			},
			{
				breakpoint: 480,
				settings: { slidesToShow: 1 }
			}
		]
	};

	return (
		<div className={classes.sliderWrapper}>
			<button
				className={`${classes.sliderArrow} ${classes.sliderArrowPrev}`}
				onClick={() => sliderRef.current?.slickPrev()}
				aria-label="Previous"
			>
				<ChevronLeftRoundedIcon />
			</button>

			{/* Drag surface — pointer events give us raw clientX for distance calc */}
			<div
				ref={containerRef}
				onPointerDown={handlePointerDown}
				onPointerUp={handlePointerUp}
				style={{ cursor: "grab", userSelect: "none" }}
			>
				<Slider ref={sliderRef} {...settings}>
					{posts.map((post: RoomResponse) => (
						<ActionAreaCard
							key={post.id}
							idAccommodation={post.id}
							title={post.name}
							type={post.type}
							content={post.address}
							image={post.imageUrls}
							price={post.price.toString()}
							rating={post.avgRating.toString()}
							isFavorite={post.isFavorite}
							handleFavorite={() => handleFavorite(post.id)}
							handleUnFavorite={() => handleUnFavorite(post.id)}
						/>
					))}
				</Slider>
			</div>

			<button
				className={`${classes.sliderArrow} ${classes.sliderArrowNext}`}
				onClick={() => sliderRef.current?.slickNext()}
				aria-label="Next"
			>
				<ChevronRightRoundedIcon />
			</button>
		</div>
	);
};

export default SuggestPost;
