import { Box, Button, Grid, IconButton, Rating, Skeleton, TextField, Typography } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import classes from "./AccomodationDetail.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import useAccommodationDetail from "../../hooks/use-accomodation-detail";
import StarIcon from "@mui/icons-material/Star";
import useAmenitiesOfAccommodation from "../../hooks/use-amenities-of-accommodation";
import { styled } from "@mui/material/styles";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import BookingDialog from "../../components/Dialog/BookingDialog";
import Comment from "../../components/Comment/Comment";
import GoogleMapReact from "google-map-react";
import { Review } from "../../types/axios/accommodation-detail";
import SendIcon from "@mui/icons-material/Send";
import useReviews from "../../hooks/use-reviews";
import { PostReview } from "../../types/model/postReview";
import usePostReview from "../../hooks/use-post-review";
import { formatDate } from "../../utils/get-date-month";
import { LoadingButton } from "@mui/lab";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import { canReview } from "../../api/review.api";
import MapContainer from "../../components/Map/Map";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 6,
	width: 200,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800]
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: theme.palette.mode === "light" ? "#FF385C" : "#FF385C"
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
	const { data, isLoading } = useAccommodationDetail(Number(id));
	const [defaultLocation, setDefaultLocation] = useState<{ lat: number; lng: number }>({ lat: 16.07, lng: 108.15 });
	const [isBooked, setIsBooked] = useState<boolean>(true);
	const [isReviewed, setIsReviewed] = useState<boolean>(false);
	const [commentContent, setCommentContent] = useState("");
	const [reviews, setReviews] = useState<Review[]>([]);

	const [ratings, setRatings] = useState<Ratings>({
		cleanliness: 0,
		location: 0,
		amenities: 0,
		comfort: 0
	});

	const [selectedPlace, setSelectedPlace] = useState<{
		geometry: {
			location: {
				lat: number;
				lng: number;
			};
		};
		name: string;
	} | null>(null);

	const handleRatingChange = (key: keyof Ratings, newValue: number | null) => {
		if (newValue !== null) {
			setRatings(prevRatings => ({
				...prevRatings,
				[key]: newValue
			}));
		}
	};

	const { data: dataAmentities } = useAmenitiesOfAccommodation(Number(id));
	const { data: dataReview, isLoading: isLoadingReviews, fetchNextPage } = useReviews(Number(id));
	const postReview = usePostReview();
	const [isOpenAddPostDialog, setIsOpenAddPostDialog] = useState<boolean>(false);

	useEffect(() => {
		setDefaultLocation({
			lat: data?.latitue ?? 16.07,
			lng: data?.longtitue ?? 108.15
		});
		setReviews(dataReview ? dataReview[0]?.data : []);
		canReview(Number(id))
			.then(res => {
				setIsBooked(res.isSuccess);
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
		const selectedPlaceTemp = {
			geometry: {
				location: {
					lat: data?.latitue || 16.07,
					lng: data?.longtitue || 108.15
				}
			},
			name: data?.address || ""
		};
		setSelectedPlace(selectedPlaceTemp);
	}, [data?.latitue, data?.longtitue, dataReview, id, data?.address, setSelectedPlace]);

	const handleCommentSubmit = () => {
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
			// setReviews([...reviews, newReview]);
			setCommentContent("");
		}
	};
	console.log(reviews);

	const handleOpenAddPostDialog = (): void => {
		setIsOpenAddPostDialog(true);
	};

	const handleCloseAddPostDialog = (): void => {
		setIsOpenAddPostDialog(false);
	};

	const renderMarkers = (map, maps) => {
		const marker = new maps.Marker({
			position: { lat: defaultLocation.lat, lng: defaultLocation.lng },
			map,
			title: "Hello World!"
		});
		return marker;
	};

	return (
		<Grid container className={classes.wrapper}>
			<Grid item xs={12} className={classes.icon}>
				<KeyboardBackspaceIcon onClick={() => navigate("/rooms")} className={classes.backIcon} />
			</Grid>
			<Grid container spacing={2}>
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
							<img src={data?.imageUrls[0]} alt="Accommodation Image" className={classes.imgOne} />
						</Grid>
						<Grid item xs={6}>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<img
										src={data?.imageUrls[1]}
										alt="Accommodation Image"
										className={classes.imgTwo}
									/>
								</Grid>
								<Grid item xs={6}>
									<img
										src={data?.imageUrls[2]}
										alt="Accommodation Image"
										className={classes.imgTwo}
									/>
								</Grid>
							</Grid>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<img
										src={data?.imageUrls[3]}
										alt="Accommodation Image"
										className={classes.imgTwo}
									/>
								</Grid>
								<Grid item xs={6}>
									<img
										src={data?.imageUrls[4]}
										alt="Accommodation Image"
										className={classes.imgTwo}
									/>
								</Grid>
							</Grid>
						</Grid>
					</>
				)}
			</Grid>
			<Grid xs={12} className={classes.wrapperInformation}>
				<Grid xs={6} className={classes.name}>
					{data?.name}
				</Grid>
				<Grid xs={6} className={classes.wrapperRating}>
					<StarIcon className={classes.startIcon} />
					{data?.avgRating}
				</Grid>
			</Grid>
			<Grid xs={12} className={classes.wrapperSubInformation}>
				<Grid xs={6} className={classes.text}>
					{data?.address}
				</Grid>
				<Grid xs={6} className={`${classes.wrapperRating} ${classes.text}`}>
					{`${data?.totalReview} reviews`}
				</Grid>
			</Grid>
			<Grid xs={12} className={classes.wrapperSubInformation}>
				<Grid xs={6} className={classes.price}>
					{`$${data?.price}/1night`}
				</Grid>
				<Grid xs={6} className={`${classes.wrapperRating} ${classes.text}`}>
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
			<Grid xs={12} className={classes.line}></Grid>
			<Grid xs={12} className={classes.wrapperAmenities}>
				<Grid xs={12} className={classes.name}>
					Amenities Overview
				</Grid>
				<Grid xs={12} className={classes.wrapperAmenitiesDetail}>
					{dataAmentities?.map(item =>
						item.data.map((amenity, i) => (
							<Grid key={i} xs={6} sm={4} md={6} className={classes.amenityItem}>
								<img src={amenity.amenity.icon} alt="Amenity Icon" className={classes.iconAmenity} />
								{amenity.amenity.name}
							</Grid>
						))
					)}
				</Grid>
			</Grid>
			{/* {dataAmentities && (
				<Grid item xs={12} className={classes.wrapperBtn}>
					<LoadingButton
						size="small"
						className={classes.buttonSeeMore}
						onClick={() => fetchNextPage()}
						loading={isFetchingAmenities}
						loadingPosition="start"
						startIcon={<ArrowDropDownCircleOutlinedIcon />}
						variant="contained"
						disabled={isLoadingAmenities}
					>
						<span>See more</span>
					</LoadingButton>
				</Grid>
			)} */}
			<Grid xs={12} className={classes.line}></Grid>
			<Grid xs={12} className={classes.wrapperAmenities}>
				<Grid xs={12} className={classes.name}>
					Reviews
				</Grid>
				<Grid xs={12} className={classes.wrapperRatingDetail}>
					<StarIcon className={classes.startIcon} />
					{data?.avgRating}
					<span className={classes.totalReview}>{data?.totalReview} reviews</span>
				</Grid>
				<Grid xs={12} className={classes.wrapperPoint}>
					<Grid xs={6} className={classes.point}>
						<span>Cleanliness</span>
						<BorderLinearProgress variant="determinate" value={(4 / 5) * 100} />
						<span>{`${data?.avgCleanlinessRating}/5`}</span>
					</Grid>
					<Grid xs={6} className={classes.point}>
						<span>Location</span>
						<BorderLinearProgress variant="determinate" value={(4 / 5) * 100} />
						<span>{`${data?.avgLocationRating}/5`}</span>
					</Grid>
				</Grid>
				<Grid xs={12} className={classes.wrapperPoint}>
					<Grid xs={6} className={classes.point}>
						<span>Amenities</span>
						<BorderLinearProgress variant="determinate" value={(4 / 5) * 100} />
						<span>{`${data?.avgAmenitiesRating}/5`}</span>
					</Grid>
					<Grid xs={6} className={classes.point}>
						<span>Comfort</span>
						<BorderLinearProgress variant="determinate" value={(4 / 5) * 100} />
						<span>{`${data?.avgComfortRating}/5`}</span>
					</Grid>
				</Grid>
			</Grid>
			<Grid xs={12} className={classes.line}></Grid>
			<Grid xs={12} className={classes.wrapperComment}>
				{dataReview?.map(item =>
					item.data.map(review => (
						<Comment
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

				{reviews.length > 0 && isBooked && (
					<Grid item xs={12} className={classes.wrapperBtn}>
						<LoadingButton
							size="small"
							className={classes.buttonSeeMore}
							onClick={() => fetchNextPage()}
							loading={isLoadingReviews}
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
								onChange={(event, newValue) => handleRatingChange("cleanliness", newValue)}
							/>

							<Typography component="legend">Location</Typography>
							<Rating
								name="location-rating"
								value={ratings.location}
								onChange={(event, newValue) => handleRatingChange("location", newValue)}
							/>

							<Typography component="legend">Amenities</Typography>
							<Rating
								name="amenities-rating"
								value={ratings.amenities}
								onChange={(event, newValue) => handleRatingChange("amenities", newValue)}
							/>

							<Typography component="legend">Comfort</Typography>
							<Rating
								name="comfort-rating"
								value={ratings.comfort}
								onChange={(event, newValue) => handleRatingChange("comfort", newValue)}
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
									<IconButton onClick={handleCommentSubmit}>
										<SendIcon />
									</IconButton>
								)
							}}
						/>
					</>
				)}
			</Grid>
			<Grid xs={12} className={classes.line}></Grid>
			<Grid xs={12} className={classes.wrapperAmenities}>
				<Grid xs={12} className={classes.name}>
					Map
				</Grid>
				<Grid xs={12} className={classes.wrapperMap}>
					{/* <div style={{ height: "500px", width: "90%", borderRadius: "50px" }}>
						<GoogleMapReact
							bootstrapURLKeys={{ key: "AIzaSyAHUq7rXW6gtVCss6HHxDGK9Su14uwkdU0" }}
							defaultCenter={defaultLocation}
							defaultZoom={14}
							yesIWantToUseGoogleMapApiInternals
							onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
						></GoogleMapReact>
					</div> */}
					<MapContainer selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} />
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
