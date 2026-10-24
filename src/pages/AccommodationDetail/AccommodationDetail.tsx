import { Button, Grid, IconButton, Rating, Skeleton, TextField, Typography } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import classes from "./AccomodationDetail.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import useAccommodationDetail from "../../hooks/use-accomodation-detail";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import useAmenitiesOfAccommodation from "../../hooks/use-amenities-of-accommodation";
import { styled } from "@mui/material/styles";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import BookingDialog from "../../components/Dialog/BookingDialog";
import Comment from "../../components/Comment/Comment";
import GoogleMapReact from "google-map-react";
import SendIcon from "@mui/icons-material/Send";
import useReviews from "../../hooks/use-reviews";
import { PostReview } from "../../types/model/postReview";
import usePostReview from "../../hooks/use-post-review";
import { formatDate } from "../../utils/get-date-month";
import { LoadingButton } from "@mui/lab";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import { canReview } from "../../api/review.api";

const mapApiKey = import.meta.env.GOOGLE_MAPS_API_KEY;

type AccommodationMarkerProps = {
	lat: number;
	lng: number;
	name: string;
};

const AccommodationMarker = ({ name }: AccommodationMarkerProps): React.JSX.Element => (
	<div className={classes.mapMarker} role="img" aria-label={`Map location for ${name}`}>
		<LocationOnIcon />
	</div>
);

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 6,
	width: 200,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800]
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: theme.palette.primary.main
	}
}));

interface Ratings {
	cleanliness: number;
	location: number;
	amenities: number;
	comfort: number;
}

const AccommodationDetailPage = (): React.JSX.Element => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { data, isLoading, isError } = useAccommodationDetail(Number(id));
	const [isBooked, setIsBooked] = useState<boolean>(false);
	const [isReviewed, setIsReviewed] = useState<boolean>(false);
	const [commentContent, setCommentContent] = useState("");

	const [ratings, setRatings] = useState<Ratings>({
		cleanliness: 0,
		location: 0,
		amenities: 0,
		comfort: 0
	});

	const handleRatingChange = (key: keyof Ratings, newValue: number | null) => {
		if (newValue !== null) {
			setRatings(prevRatings => ({
				...prevRatings,
				[key]: newValue
			}));
		}
	};

	const { data: dataAmentities } = useAmenitiesOfAccommodation(Number(id));
	const {
		data: dataReview,
		isLoading: isLoadingReviews,
		isFetching: isFetchingReviews,
		isError: isReviewsError,
		fetchNextPage
	} = useReviews(Number(id));
	const lastReviewPage = dataReview?.[dataReview.length - 1];
	const hasNextPage = Boolean(lastReviewPage && lastReviewPage.meta.pageIndex < lastReviewPage.meta.totalPages);
	const reviewCount = dataReview?.reduce((total, page) => total + page.data.length, 0) ?? 0;
	const postReview = usePostReview(Number(id));
	const [isOpenAddPostDialog, setIsOpenAddPostDialog] = useState<boolean>(false);

	useEffect(() => {
		canReview(Number(id))
			.then(res => {
				setIsBooked(res.isSuccess);
			})
			.catch(() => setIsBooked(false));
	}, [id]);

	const handleCommentSubmit = (): void => {
		if (commentContent.trim() !== "") {
			const newReview: PostReview = {
				accommodationId: Number(id),
				comment: commentContent,
				cleanlinessRating: ratings.cleanliness,
				locationRating: ratings.location,
				comfortRating: ratings.comfort,
				amenitiesRating: ratings.amenities
			};
			postReview.mutate(newReview);
			setIsReviewed(true);
			setCommentContent("");
		}
	};

	const handleOpenAddPostDialog = (): void => {
		setIsOpenAddPostDialog(true);
	};

	const handleCloseAddPostDialog = (): void => {
		setIsOpenAddPostDialog(false);
	};

	if (isError) {
		return (
			<main className={classes.wrapper}>
				<Button onClick={() => navigate("/rooms")} startIcon={<KeyboardBackspaceIcon />} className={classes.backButton}>
					Back to places
				</Button>
				<p className={classes.stateMessage} role="alert">We could not load this place. Return to the results and try again.</p>
			</main>
		);
	}

	return (
		<Grid container className={classes.wrapper}>
			<Grid item xs={12} className={classes.icon}>
				<Button onClick={() => navigate("/rooms")} startIcon={<KeyboardBackspaceIcon />} className={classes.backButton}>
					Back to places
				</Button>
			</Grid>
			<Grid item container xs={12} spacing={2} className={classes.gallery}>
				{isLoading ? (
					<>
						<Grid item xs={6}>
							<Skeleton variant="rectangular" width="100%" height={350} />
						</Grid>
						<Grid item xs={6}>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<Skeleton variant="rectangular" width="100%" height={175} />
								</Grid>
								<Grid item xs={6}>
									<Skeleton variant="rectangular" width="100%" height={175} />
								</Grid>
							</Grid>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<Skeleton variant="rectangular" width="100%" height={175} />
								</Grid>
								<Grid item xs={6}>
									<Skeleton variant="rectangular" width="100%" height={175} />
								</Grid>
							</Grid>
						</Grid>
					</>
				) : (
					<>
						<Grid item xs={6}>
							<img src={data?.imageUrls[0]} alt={`${data?.name ?? "Accommodation"}, photo 1`} className={classes.imgOne} />
						</Grid>
						<Grid item xs={6}>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<img
										src={data?.imageUrls[1]}
										alt={`${data?.name ?? "Accommodation"}, photo 2`}
										className={classes.imgTwo}
									/>
								</Grid>
								<Grid item xs={6}>
									<img
										src={data?.imageUrls[2]}
										alt={`${data?.name ?? "Accommodation"}, photo 3`}
										className={classes.imgTwo}
									/>
								</Grid>
							</Grid>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<img
										src={data?.imageUrls[3]}
										alt={`${data?.name ?? "Accommodation"}, photo 4`}
										className={classes.imgTwo}
									/>
								</Grid>
								<Grid item xs={6}>
									<img
										src={data?.imageUrls[4]}
										alt={`${data?.name ?? "Accommodation"}, photo 5`}
										className={classes.imgTwo}
									/>
								</Grid>
							</Grid>
						</Grid>
					</>
				)}
			</Grid>
			<Grid item xs={12} className={classes.wrapperInformation}>
				<Grid item xs={12} md={8} component="h1" className={classes.name}>
					{data?.name}
				</Grid>
				<Grid item xs={12} md={4} className={classes.wrapperRating}>
					<StarIcon className={classes.startIcon} />
					{data?.avgRating.toFixed(1)}
				</Grid>
			</Grid>
			<Grid item xs={12} className={classes.wrapperSubInformation}>
				<Grid item xs={12} md={8} className={classes.text}>
					{data?.address}
				</Grid>
				<Grid item xs={12} md={4} className={`${classes.wrapperRating} ${classes.text}`}>
					{`${data?.totalReview} reviews`}
				</Grid>
			</Grid>
			<Grid item xs={12} className={classes.detailFacts}>
				<span>{data?.type}</span>
				<span>{data?.maxGuests} guests</span>
				<span>{data?.numberOfBedrooms} bedrooms</span>
				<span>{data?.numberOfBeds} beds</span>
				<span>{data?.numberOfBathrooms} bathrooms</span>
			</Grid>
			{data?.description && (
				<Grid item xs={12} className={classes.description}>
					<Typography component="h2" className={classes.sectionTitle}>About this place</Typography>
					<p>{data.description}</p>
				</Grid>
			)}
			<Grid item xs={12} className={`${classes.wrapperSubInformation} ${classes.bookingSummary}`}>
				<Grid item xs={12} sm={6} className={classes.price}>
					{`$${data?.price}/1night`}
				</Grid>
				<Grid item xs={12} sm={6} className={`${classes.wrapperRating} ${classes.text}`}>
					<Button
						variant="contained"
						color="primary"
						onClick={handleOpenAddPostDialog}
						className={classes.btnBook}
					>
						Book now
					</Button>
				</Grid>
			</Grid>
			<Grid item xs={12} className={classes.line}></Grid>
			<Grid item xs={12} className={classes.wrapperAmenities}>
				<Grid item xs={12} component="h2" className={classes.name}>
					Amenities Overview
				</Grid>
				<Grid item xs={12} className={classes.wrapperAmenitiesDetail}>
					{dataAmentities !== undefined &&
						dataAmentities[0]?.data.map(amenities => (
							<Grid item key={amenities.amenity.id} xs={12} sm={6} md={4} className={classes.amenityItem}>
								<img src={amenities.amenity.icon} alt="" className={classes.iconAmenity} />
								{amenities.amenity.name}
							</Grid>
						))}
				</Grid>
			</Grid>
			<Grid item xs={12} className={classes.line}></Grid>
			<Grid item xs={12} className={classes.wrapperAmenities}>
				<Grid item xs={12} component="h2" className={classes.name}>
					Reviews
				</Grid>
				<Grid item xs={12} className={classes.wrapperRatingDetail}>
					<StarIcon className={classes.startIcon} />
					{data?.avgRating.toFixed(1)}
					<span className={classes.totalReview}>{data?.totalReview} reviews</span>
				</Grid>
				<Grid item xs={12} className={classes.wrapperPoint}>
					<Grid item xs={12} md={6} className={classes.point}>
						<span>Cleanliness</span>
						<BorderLinearProgress
							variant="determinate"
							value={data?.avgCleanlinessRating ? (data.avgCleanlinessRating / 5) * 100 : 0}
						/>
						<span>{`${data?.avgCleanlinessRating}/5`}</span>
					</Grid>
					<Grid item xs={12} md={6} className={classes.point}>
						<span>Location</span>
						<BorderLinearProgress
							variant="determinate"
							value={data?.avgLocationRating ? (data?.avgLocationRating / 5) * 100 : 0}
						/>
						<span>{`${data?.avgLocationRating}/5`}</span>
					</Grid>
				</Grid>
				<Grid item xs={12} className={classes.wrapperPoint}>
					<Grid item xs={12} md={6} className={classes.point}>
						<span>Amenities</span>
						<BorderLinearProgress
							variant="determinate"
							value={data?.avgAmenitiesRating ? (data?.avgAmenitiesRating / 5) * 100 : 0}
						/>
						<span>{`${data?.avgAmenitiesRating}/5`}</span>
					</Grid>
					<Grid item xs={12} md={6} className={classes.point}>
						<span>Comfort</span>
						<BorderLinearProgress
							variant="determinate"
							value={data?.avgComfortRating ? (data?.avgComfortRating / 5) * 100 : 0}
						/>
						<span>{`${data?.avgComfortRating}/5`}</span>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} className={classes.line}></Grid>
			<Grid item xs={12} className={classes.wrapperComment}>
				{isReviewsError && <p className={classes.stateMessage} role="alert">Reviews could not be loaded.</p>}
				{isLoadingReviews && <Skeleton variant="rounded" width="100%" height={96} />}
				{dataReview?.map(item =>
					item.data.map(review => (
						<Comment
							key={review.useId}
							avatar={
								review.user.avatar === null
									? "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png"
									: review.user.avatar
							}
							name={review.user.name}
							content={review.comment}
							createdAt={formatDate(review.createdDate)}
						/>
					))
				)}
				{!isLoadingReviews && !isReviewsError && reviewCount === 0 && (
					<p className={classes.emptyReviews}>No reviews yet.</p>
				)}

				{reviewCount > 0 && hasNextPage && (
					<Grid item xs={12} className={classes.wrapperBtn}>
						<LoadingButton
							size="small"
							className={classes.buttonSeeMore}
							onClick={() => {
								void fetchNextPage();
							}}
							loading={isFetchingReviews}
							loadingPosition="start"
							startIcon={<ArrowDropDownCircleOutlinedIcon />}
							variant="contained"
							disabled={isLoadingReviews}
						>
							<span>See more</span>
						</LoadingButton>
					</Grid>
				)}
				{isBooked && !isReviewed && (
					<>
						<Grid item xs={12} className={`${classes.wrapperYourRating}`}>
							<Typography component="legend">Cleanliness</Typography>
							<Rating
								name="cleanliness-rating"
								value={ratings.cleanliness}
								onChange={(_event, newValue) => handleRatingChange("cleanliness", newValue)}
							/>

							<Typography component="legend">Location</Typography>
							<Rating
								name="location-rating"
								value={ratings.location}
								onChange={(_event, newValue) => handleRatingChange("location", newValue)}
							/>

							<Typography component="legend">Amenities</Typography>
							<Rating
								name="amenities-rating"
								value={ratings.amenities}
								onChange={(_event, newValue) => handleRatingChange("amenities", newValue)}
							/>

							<Typography component="legend">Comfort</Typography>
							<Rating
								name="comfort-rating"
								value={ratings.comfort}
								onChange={(_event, newValue) => handleRatingChange("comfort", newValue)}
							/>
						</Grid>
						<TextField
							value={commentContent}
							onChange={e => setCommentContent(e.target.value)}
							className={classes.inputComment}
							placeholder="Type your comment..."
							variant="standard"
							// onKeyPress={handleKeyPress}
							fullWidth
							InputProps={{
								endAdornment: (
									<IconButton onClick={handleCommentSubmit} aria-label="Submit review">
										<SendIcon />
									</IconButton>
								)
							}}
						/>
					</>
				)}
			</Grid>
			<Grid item xs={12} className={classes.line}></Grid>
			<Grid item xs={12} className={classes.wrapperAmenities}>
				<Grid item xs={12} component="h2" className={classes.name}>
					Map
				</Grid>
				<Grid item xs={12} className={classes.wrapperMap}>
					{mapApiKey && data ? (
						<div className={classes.mapCanvas}>
							<GoogleMapReact
								bootstrapURLKeys={{ key: mapApiKey }}
								center={{ lat: data.latitude, lng: data.longitude }}
								defaultZoom={14}
								options={{ fullscreenControl: false, mapTypeControl: false, streetViewControl: false }}
							>
								<AccommodationMarker lat={data.latitude} lng={data.longitude} name={data.name} />
							</GoogleMapReact>
						</div>
					) : (
						<div className={classes.mapUnavailable} role="status">
							<LocationOnIcon />
							<span>The map preview is unavailable right now.</span>
						</div>
					)}
				</Grid>
			</Grid>
			<BookingDialog
				id={Number(id)}
				nameAccommodation={data?.name}
				open={isOpenAddPostDialog}
				handleClose={handleCloseAddPostDialog}
				price={data?.price}
			/>
		</Grid>
	);
};

export default AccommodationDetailPage;
