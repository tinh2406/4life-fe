import { Grid, Skeleton } from "@mui/material";
import classes from "./MyFavorite.module.scss";
import ActionAreaCard from "../../components/Card/Card";
import { LoadingButton } from "@mui/lab";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import useFavoriteAccommodations from "../../hooks/use-favorite-acommodations";
import useCreateFavoriteAccommodation from "../../hooks/use-create-favorite-accommodation";
import { Favorite } from "../../types/model/favorite";

const MyFavoritePage = (): React.JSX.Element => {
	const addFavorite = useCreateFavoriteAccommodation();
	const { isLoading, isError, isFetching, data, fetchNextPage } = useFavoriteAccommodations();

	const handleFavorite = async (id: number) => {
		const favoriteAccommodation = {
			accommodationId: id,
			isFavorite: true
		} as Favorite;
		addFavorite.mutateAsync(favoriteAccommodation);
	};

	const handleUnFavorite = (id: number) => {
		const unFavoriteAccommodation = {
			accommodationId: id,
			isFavorite: false
		} as Favorite;
		addFavorite.mutateAsync(unFavoriteAccommodation);
	};

	return (
		<Grid container spacing={3} className={classes.wrapper}>
			<Grid container item xs={12} className={classes.wrapperRoooms}>
				{isFetching &&
					[1, 2, 3, 4].map((item, index) => (
						<Grid key={index} xs={6} sm={4} md={3} className={classes.roomItem}>
							<Skeleton variant="rectangular" width={300} height={158} />
							<Skeleton width="60%" />
						</Grid>
					))}
				{!isFetching &&
					data?.map(item =>
						item.data.map((room, i) => (
							<Grid key={i} xs={6} sm={4} md={3} className={classes.roomItem}>
								<ActionAreaCard
									idAccommodation={room.id}
									title={room.name}
									type={room.type}
									content={room.address}
									image={room.imageUrls}
									price={room.price.toString()}
									rating={room.avgRating.toString()}
									isFavorite={room.isFavorite}
									handleFavorite={() => handleFavorite(room.id)}
									handleUnFavorite={() => handleUnFavorite(room.id)}
								/>
							</Grid>
						))
					)}
			</Grid>
			<Grid item xs={12} className={classes.wrapperBtn}>
				<LoadingButton
					size="small"
					className={classes.buttonSeeMore}
					onClick={() => fetchNextPage()}
					loading={isFetching}
					loadingPosition="start"
					startIcon={<ArrowDropDownCircleOutlinedIcon />}
					variant="contained"
					disabled={isLoading || isError}
				>
					<span>See more</span>
				</LoadingButton>
			</Grid>
		</Grid>
	);
};

export default MyFavoritePage;
