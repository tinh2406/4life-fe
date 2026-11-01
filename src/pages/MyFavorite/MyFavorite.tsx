import { Button, Skeleton } from "@mui/material";
import classes from "./MyFavorite.module.scss";
import ActionAreaCard from "../../components/Card/Card";
import { LoadingButton } from "@mui/lab";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { Link } from "react-router-dom";
import useFavoriteAccommodations from "../../hooks/use-favorite-acommodations";
import useCreateFavoriteAccommodation from "../../hooks/use-create-favorite-accommodation";
import { Favorite } from "../../types/model/favorite";

const MyFavoritePage = (): React.JSX.Element => {
	const addFavorite = useCreateFavoriteAccommodation();
	const { isLoading, isError, isFetching, data, fetchNextPage, refetch } = useFavoriteAccommodations();
	const lastPage = data?.[data.length - 1];
	const hasNextPage = Boolean(lastPage && lastPage.meta.pageIndex < lastPage.meta.totalPages);
	const totalCount = data?.[0]?.meta.totalCount ?? 0;

	const handleFavorite = (id: number): void => {
		const favoriteAccommodation = {
			accommodationId: id,
			isFavorite: true
		} satisfies Favorite;
		addFavorite.mutate(favoriteAccommodation);
	};

	const handleUnFavorite = (id: number) => {
		const unFavoriteAccommodation = {
			accommodationId: id,
			isFavorite: false
		} satisfies Favorite;
		addFavorite.mutate(unFavoriteAccommodation);
	};

	return (
		<main className={classes.page}>
			<div className={classes.content}>
				<header className={classes.pageHeader}>
					<div>
						<h1>Saved places</h1>
						<p>Keep the stays you like close at hand.</p>
					</div>
					{totalCount > 0 && !isLoading && !isError && (
						<Button component={Link} to="/rooms" variant="outlined" className={classes.browseButton} endIcon={<ArrowForwardIcon />}>
							Browse stays
						</Button>
					)}
				</header>

				{!isLoading && !isError && totalCount > 0 && (
					<div className={classes.resultsHeading}>
						<h2>Your saved stays</h2>
						<span>{totalCount} {totalCount === 1 ? "place" : "places"}</span>
					</div>
				)}

				{isLoading && (
					<div className={classes.favoriteGrid} aria-label="Loading saved places" aria-busy="true">
						{[1, 2, 3, 4, 5, 6].map(item => (
							<div key={item} className={classes.skeletonCard}>
								<Skeleton variant="rounded" height={190} />
								<Skeleton width="68%" />
								<Skeleton width="92%" />
								<Skeleton width="42%" />
							</div>
						))}
					</div>
				)}

				{isError && (
					<section className={classes.statePanel} role="alert">
						<h2>Saved places could not be loaded</h2>
						<p>Check your connection and try again.</p>
						<Button variant="outlined" onClick={() => void refetch()} className={classes.browseButton}>Try again</Button>
					</section>
				)}

				{!isLoading && !isError && totalCount === 0 && (
					<section className={classes.emptyState}>
						<div className={classes.emptyIcon}><FavoriteBorderOutlinedIcon aria-hidden="true" /></div>
						<h2>No saved places yet</h2>
						<p>Save a stay you like and it will be easy to find here.</p>
						<Button component={Link} to="/rooms" variant="contained" className={classes.exploreButton} endIcon={<ArrowForwardIcon />}>
							Explore stays
						</Button>
					</section>
				)}

				{!isLoading && !isError && totalCount > 0 && (
					<div className={classes.favoriteGrid}>
						{data?.flatMap(page => page.data.map(room => (
							<ActionAreaCard
								key={room.id}
								idAccommodation={room.id}
								title={room.name}
								type={room.type}
								content={room.address}
								image={room.imageUrls}
								price={room.price.toString()}
								rating={room.avgRating.toString()}
								isFavorite={room.isFavorite}
								handleFavorite={handleFavorite}
								handleUnFavorite={handleUnFavorite}
								cardClassName={classes.favoriteCard}
							/>
						)))}
					</div>
				)}

				{hasNextPage && (
					<div className={classes.loadMoreRow}>
						<LoadingButton
							className={classes.loadMoreButton}
							onClick={() => void fetchNextPage()}
							loading={isFetching}
							variant="outlined"
							disabled={isLoading || isError}
						>
							Load more saved places
						</LoadingButton>
					</div>
				)}
			</div>
		</main>
	);
};

export default MyFavoritePage;
