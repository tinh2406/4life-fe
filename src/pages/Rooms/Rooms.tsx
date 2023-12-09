import {
	Autocomplete,
	Grid,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListSubheader,
	Skeleton,
	TextField
} from "@mui/material";
import classes from "./Rooms.module.scss";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
// import PeopleIcon from "@mui/icons-material/People";
import { useState } from "react";
import RoomsIntroduce from "../../assets/images/roomsIntroduce.png";
import ActionAreaCard from "../../components/Card/Card";
import useRooms from "../../hooks/user-rooms";
import { LoadingButton } from "@mui/lab";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import { LocationResponse } from "../../types/axios/paging";
import useLocations from "../../hooks/use-locations";
import { format } from "date-fns";
import { Favorite } from "../../types/model/favorite";
import useCreateFavoriteAccommodation from "../../hooks/use-create-favorite-accommodation";

const RoomsPage = (): React.JSX.Element => {
	const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const {
		isLoading,
		isError,
		isFetching,
		data,
		handleLocationChange,
		handleTypeChange,
		handleCheckInChange,
		fetchNextPage
	} = useRooms();
	const { data: locationData } = useLocations();
	const addFavorite = useCreateFavoriteAccommodation();
	const extractedLocations = locationData ? locationData.map(page => page.data).flat() : [];

	const Types = ["Homestay", "Villa", "Other"];

	const renderOptionLocation = (props: object, option: LocationResponse) => (
		<ListItem {...props}>
			<ListItemAvatar>
				<LocationOnIcon className={classes.icon} />
			</ListItemAvatar>
			<ListItemText primary={option.city + ", " + option.district} />
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

	const onLocationChange = (event: React.ChangeEvent<unknown>, value: LocationResponse | null): void => {
		handleLocationChange(value?.id ?? 0);
	};

	const onTypeChange = (event: React.ChangeEvent<unknown>, value: string | null): void => {
		handleTypeChange(value ?? "");
	};

	const onCheckInChange = (date: Dayjs | null): void => {
		handleCheckInChange(date?.format("YYYY-MM-DD") ?? "");
		setSelectedDate(date?.format("YYYY-MM-DD") ?? "");
	};

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
		<Grid container>
			<Grid item xs={12} className={classes.wrapperFilter}>
				{/* <Paper elevation={6} className={classes.filter}> */}
				<div className={classes.filter}>
					<Autocomplete
						options={extractedLocations as LocationResponse[]}
						getOptionLabel={option => option.city + ", " + option.district}
						renderOption={renderOptionLocation}
						renderInput={params => <TextField {...params} label="Location" variant="outlined" />}
						renderGroup={params => <ListSubheader component="div" id="grouped-banks" {...params} />}
						onChange={onLocationChange}
						className={classes.filterLocation}
					/>
					<Autocomplete
						options={Types}
						getOptionLabel={option => option}
						renderOption={renderOptionType}
						renderInput={params => <TextField {...params} label="Type" variant="outlined" />}
						renderGroup={params => <ListSubheader component="div" id="grouped-banks" {...params} />}
						onChange={onTypeChange}
						className={classes.filterType}
					/>
					<DatePicker
						slotProps={{
							textField: {
								size: "small",
								variant: "outlined"
							}
						}}
						sx={{
							"& .MuiOutlinedInput-root": {
								fontSize: "16px",
								fontFamily: "K2D",
								height: "50px"
							}
						}}
						format="YYYY-MM-DD"
						value={dayjs(selectedDate)}
						onChange={onCheckInChange}
						className={classes.datePicker}
					/>
					<DatePicker
						slotProps={{
							textField: {
								size: "small",
								variant: "outlined"
							}
						}}
						sx={{
							"& .MuiOutlinedInput-root": {
								fontSize: "16px",
								fontFamily: "K2D",
								height: "50px"
							}
						}}
						format="YYYY-MM-DD"
						value={dayjs(selectedDate)}
						onChange={onCheckInChange}
						className={classes.datePicker}
					/>
				</div>
			</Grid>
			<Grid item xs={12} className={classes.wrapperImg}>
				<img src={RoomsIntroduce} className={classes.roomsImg} />
				<div className={classes.text}>
					<div className={classes.title}>Rooms And Suites</div>
					<div className={classes.content}>
						View pictures, information and find your perfect room design and suitable for you.
					</div>
				</div>
			</Grid>
			<Grid container item xs={12} className={classes.wrapperRoooms}>
				{isFetching &&
					[1, 2, 3, 4].map((item, index) => (
						<Grid key={index} xs={6} sm={4} md={3} className={classes.roomItem}>
							<Skeleton variant="rectangular" width={300} height={150} />
							<Skeleton width="60%" />
						</Grid>
					))}
				{data?.map(item =>
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

export default RoomsPage;
