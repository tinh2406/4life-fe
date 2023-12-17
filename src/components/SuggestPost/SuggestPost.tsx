import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RoomResponse } from "../../types/axios/paging";
import ActionAreaCard from "../Card/Card";

type SuggestPostProps = {
	posts: RoomResponse[];
	handleFavorite: (id: number) => void;
	handleUnFavorite: (id: number) => void;
};

const SuggestPost = ({ posts, handleFavorite, handleUnFavorite }: SuggestPostProps): React.JSX.Element => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4, // Số lượng hiển thị card cùng một lúc
		slidesToScroll: 1, // Số lượng card chuyển đổi khi lướt
		autoplay: true,
		autoplaySpeed: 5000,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1
				}
			}
		]
	};
	return (
		<Slider {...settings}>
			{posts.map((post: RoomResponse) => (
				<ActionAreaCard
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
	);
};

export default SuggestPost;
