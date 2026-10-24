import {
	Autocomplete,
	Button,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListSubheader,
	Skeleton,
	TextField
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useMemo, useState } from "react";
import classes from "./Rooms.module.scss";
import ActionAreaCard from "../../components/Card/Card";
import useRooms from "../../hooks/user-rooms";
import { LoadingButton } from "@mui/lab";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import { LocationResponse } from "../../types/axios/paging";
import useLocations from "../../hooks/use-locations";
import { format } from "date-fns";
import { Favorite } from "../../types/model/favorite";
import useCreateFavoriteAccommodation from "../../hooks/use-create-favorite-accommodation";
import SuggestPost from "../../components/SuggestPost/SuggestPost";
import useRoomsByLocation from "../../hooks/use-rooms-by-location";
import AccommodationMap from "../../components/AccommodationMap/AccommodationMap";

const accommodationTypes = ["Homestay", "Villa", "Other"];

const RoomsPage = (): React.JSX.Element => {
	const [selectedCheckInDate, setSelectedCheckInDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const [selectedCheckoutDate, setSelectedCheckoutDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const [selectedAccommodationId, setSelectedAccommodationId] = useState<number | null>(null);
	const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);

	const {
		isLoading,
		isFetching,
		isError,
		data,
		handleLocationChange,
		handleTypeChange,
		handleCheckInChange,
		handleCheckOutChange,
		fetchNextPage
	} = useRooms();
	const { data: dataSuggestRooms } = useRoomsByLocation();
	const { data: locationData } = useLocations();
	const addFavorite = useCreateFavoriteAccommodation();

	const rooms = useMemo(() => data?.flatMap(page => page.data) ?? [], [data]);
	const suggestedRooms = useMemo(() => dataSuggestRooms?.flatMap(page => page.data) ?? [], [dataSuggestRooms]);
	const locations = useMemo(() => locationData?.flatMap(page => page.data) ?? [], [locationData]);
	const resultCount = data?.[0]?.meta.totalCount;
	const lastPage = data?.[data.length - 1];
	const hasNextPage = Boolean(lastPage && lastPage.meta.pageIndex < lastPage.meta.totalPages);

	const renderOptionLocation = (props: object, option: LocationResponse) => (
		<ListItem {...props}>
			<ListItemAvatar>
				<LocationOnIcon className={classes.icon} />
			</ListItemAvatar>
			<ListItemText primary={`${option.city}, ${option.district}`} />
		</ListItem>
	);

	const renderOptionType = (props: object, option: string) => (
		<ListItem {...props}>
			<ListItemAvatar>
				<MapsHomeWorkIcon className={classes.icon} />
			</ListItemAvatar>
			<ListItemText primary={option} />
		</ListItem>
	);

	const handleLocationSelection = (_event: React.SyntheticEvent, value: LocationResponse | null): void => {
		handleLocationChange(value?.id ?? 0);
	};

	const handleTypeSelection = (_event: React.SyntheticEvent, value: string | null): void => {
		handleTypeChange(value ?? "");
	};

	const handleCheckInSelection = (date: Dayjs | null): void => {
		const value = date?.format("YYYY-MM-DD") ?? "";
		handleCheckInChange(value);
		setSelectedCheckInDate(value);
	};

	const handleCheckOutSelection = (date: Dayjs | null): void => {
		const value = date?.format("YYYY-MM-DD") ?? "";
		handleCheckOutChange(value);
		setSelectedCheckoutDate(value);
	};

	const handleFavorite = (id: number): void => {
		const favoriteAccommodation: Favorite = { accommodationId: id, isFavorite: true };
		void addFavorite.mutateAsync(favoriteAccommodation);
	};

	const handleUnFavorite = (id: number): void => {
		const favoriteAccommodation: Favorite = { accommodationId: id, isFavorite: false };
		void addFavorite.mutateAsync(favoriteAccommodation);
	};

	return (
		<main className={classes.page}>
			<div className={classes.pageInner}>
				<header className={classes.pageHeading}>
					<div>
						<h1>Find your place</h1>
						<p className={classes.intro}>Filter by neighborhood, dates and stay type to find the right place for your trip.</p>
					</div>
				</header>

				<section className={classes.searchPanel} aria-label="Find accommodation">
					<div className={classes.searchFieldLocation}>
						<Autocomplete
							options={locations}
							getOptionLabel={option => `${option.city}, ${option.district}`}
							renderOption={renderOptionLocation}
							renderInput={params => <TextField {...params} label="Where are you going?" variant="outlined" />}
							renderGroup={params => <ListSubheader component="div" {...params} />}
							onChange={handleLocationSelection}
						/>
					</div>
					<div className={classes.searchFieldType}>
						<Autocomplete
							options={accommodationTypes}
							getOptionLabel={option => option}
							renderOption={renderOptionType}
							renderInput={params => <TextField {...params} label="Stay type" variant="outlined" />}
							renderGroup={params => <ListSubheader component="div" {...params} />}
							onChange={handleTypeSelection}
						/>
					</div>
					<div className={classes.searchFieldDate}>
						<DatePicker
							label="Check in"
							format="DD MMM YYYY"
							value={dayjs(selectedCheckInDate)}
							onChange={handleCheckInSelection}
							slotProps={{ textField: { fullWidth: true, variant: "outlined" } }}
						/>
					</div>
					<div className={classes.searchFieldDate}>
						<DatePicker
							label="Check out"
							format="DD MMM YYYY"
							value={dayjs(selectedCheckoutDate)}
							onChange={handleCheckOutSelection}
							slotProps={{ textField: { fullWidth: true, variant: "outlined" } }}
						/>
					</div>
				</section>

				{suggestedRooms.length > 0 && (
					<section className={classes.suggestions} aria-labelledby="nearby-heading">
						<div className={classes.sectionHeading}>
							<div>
								<h2 id="nearby-heading">Stay near you</h2>
								<p>Places to stay around your current location.</p>
							</div>
							<span className={classes.sectionIndex}>CURRENT LOCATION</span>
						</div>
						<SuggestPost posts={suggestedRooms} handleFavorite={handleFavorite} handleUnFavorite={handleUnFavorite} />
					</section>
				)}

				<section className={classes.resultsSection} aria-labelledby="results-heading">
					<div className={classes.resultsHeader}>
						<div>
							<h2 id="results-heading">Places to stay</h2>
							<p>{resultCount === undefined ? "Finding places for you" : `${resultCount} places in this area`}</p>
						</div>
						<Button
							className={classes.mapToggle}
							startIcon={<MapOutlinedIcon />}
							aria-expanded={isMobileMapOpen}
							aria-controls="accommodation-map"
							onClick={() => setIsMobileMapOpen(open => !open)}
						>
							{isMobileMapOpen ? "Hide map" : "Show map"}
						</Button>
					</div>

					<div className={`${classes.resultsLayout} ${isMobileMapOpen ? classes.mobileMapOpen : ""}`}>
						<div className={classes.resultsList}>
							{isLoading &&
								[1, 2, 3].map(item => (
									<div key={item} className={classes.skeleton}>
										<Skeleton variant="rounded" width="100%" height={190} />
										<Skeleton width="72%" />
										<Skeleton width="48%" />
									</div>
								))}
							{isError && <p className={classes.stateMessage} role="alert">We could not load places to stay. Please try again.</p>}
							{!isLoading && !isError && rooms.length === 0 && (
								<div className={classes.emptyState}>
									<span>No places found</span>
									<p>Try another area or adjust your check-in date.</p>
								</div>
							)}
							<div className={classes.roomGrid}>
								{rooms.map(room => (
									<div
										key={room.id}
										className={room.id === selectedAccommodationId ? classes.roomSelected : undefined}
										onMouseEnter={() => setSelectedAccommodationId(room.id)}
										onMouseLeave={() => setSelectedAccommodationId(null)}
										onFocusCapture={() => setSelectedAccommodationId(room.id)}
									>
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
									</div>
								))}
							</div>
							{hasNextPage && (
								<LoadingButton
									className={classes.buttonSeeMore}
									onClick={() => {
										void fetchNextPage();
									}}
									loading={isFetching}
									loadingPosition="start"
									startIcon={<ArrowDropDownCircleOutlinedIcon />}
									variant="contained"
									disabled={isLoading || isError}
								>
									See more places
								</LoadingButton>
							)}
						</div>
						<AccommodationMap
							rooms={rooms}
							selectedAccommodationId={selectedAccommodationId}
							isMobileMapOpen={isMobileMapOpen}
							onSelect={setSelectedAccommodationId}
						/>
					</div>
				</section>
			</div>
		</main>
	);
};

export default RoomsPage;
