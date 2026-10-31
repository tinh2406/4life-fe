import React, { FormEvent, useMemo, useState } from "react";
import { Autocomplete, Button, MenuItem, Skeleton, TextField } from "@mui/material";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import HomeImage from "../../assets/images/home.png";
import { getRooms } from "../../api/rooms.api";
import { getLocations } from "../../api/location.api";
import { RoomResponse, LocationResponse } from "../../types/axios/paging";
import { GetRoomsParams } from "../../types/axios/get-room-params";
import classes from "./Home.module.scss";

const searchParams: GetRoomsParams = { PageIndex: 1, PageSize: 4, IsDescending: false, SortBy: "Name" };
const locationParams: GetRoomsParams = { PageIndex: 1, PageSize: 100, IsDescending: false, SortBy: "City" };

const HomePage = (): React.JSX.Element => {
	const navigate = useNavigate();
	const [location, setLocation] = useState<LocationResponse | null>(null);
	const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
	const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
	const [guests, setGuests] = useState(2);
	const [searchError, setSearchError] = useState("");

	const { data: roomResponse, isLoading: roomsLoading, isError: roomsError } = useQuery(
		["home-featured-stays"],
		() => getRooms(searchParams)
	);
	const { data: locationResponse, isError: locationsError } = useQuery(
		["home-locations"],
		() => getLocations(locationParams)
	);
	const rooms = useMemo(() => roomResponse?.data ?? [], [roomResponse]);
	const locations = useMemo(() => locationResponse?.data ?? [], [locationResponse]);

	const handleSearch = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (checkIn && checkOut && !checkOut.isAfter(checkIn, "day")) {
			setSearchError("Check-out must be after check-in.");
			return;
		}
		setSearchError("");
		const params = new URLSearchParams();
		if (location) params.set("locationId", String(location.id));
		if (checkIn && checkIn.isValid()) params.set("checkIn", checkIn.format("YYYY-MM-DD"));
		if (checkOut && checkOut.isValid()) params.set("checkOut", checkOut.format("YYYY-MM-DD"));
		params.set("MaxGuests", String(guests));
		navigate(`/rooms?${params.toString()}`);
	};

	return (
		<main className={classes.page}>
			<section className={classes.hero} aria-labelledby="home-heading">
				<img src={HomeImage} alt="A calm, sunlit bedroom with a wide window" className={classes.heroImage} />
				<div className={classes.heroContent}>
					<h1 id="home-heading">Find a stay that feels like yours.</h1>
					<p>Explore places to stay and find the right fit for your next trip.</p>
					<Button
						variant="contained"
						endIcon={<ArrowRightAltOutlinedIcon />}
						className={classes.exploreButton}
						onClick={() => navigate("/rooms")}
					>
						Explore stays
					</Button>
				</div>
			</section>

			<form className={classes.searchBar} onSubmit={handleSearch} aria-label="Search for a stay">
				<div className={classes.searchLocation}>
					<Autocomplete<LocationResponse>
						options={locations}
						value={location}
						getOptionLabel={option => `${option.city}, ${option.district}`}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						onChange={(_event, value) => setLocation(value)}
						disabled={locationsError}
						loading={!locationResponse && !locationsError}
						renderInput={params => <TextField {...params} label="Destination" placeholder="Choose an area" />}
					/>
				</div>
				<DatePicker
					label="Check in"
					format="DD MMM YYYY"
					value={checkIn}
					minDate={dayjs()}
					onChange={value => {
						setCheckIn(value);
						if (value && checkOut && !checkOut.isAfter(value, "day")) {
							setCheckOut(null);
						}
					}}
					slotProps={{
						textField: {
							fullWidth: true,
							placeholder: ""
						}
					}}
				/>
				<DatePicker
					label="Check out"
					format="DD MMM YYYY"
					value={checkOut}
					minDate={checkIn ? checkIn.add(1, "day") : dayjs().add(1, "day")}
					onChange={value => setCheckOut(value)}
					slotProps={{
						textField: {
							fullWidth: true,
							placeholder: ""
						}
					}}
				/>
				<TextField select label="Guests" value={guests} onChange={event => setGuests(Number(event.target.value))}>
					{[1, 2, 3, 4, 5, 6, 7, 8].map(count => (
						<MenuItem key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</MenuItem>
					))}
				</TextField>
				<Button type="submit" variant="contained" className={classes.searchButton} startIcon={<SearchRoundedIcon />}>
					Search stays
				</Button>
				{searchError && <p className={classes.searchError} role="alert">{searchError}</p>}
				{locationsError && <p className={classes.searchError} role="status">Area options could not be loaded.</p>}
			</form>

			<section className={classes.featured} aria-labelledby="featured-heading">
				<div className={classes.sectionHeading}>
					<div>
						<h2 id="featured-heading">Places to explore</h2>
						<p>A few places currently listed on 4LIFE.</p>
					</div>
					<Link to="/rooms" className={classes.viewAll}>View all stays <ArrowRightAltOutlinedIcon /></Link>
				</div>
				{roomsLoading && <div className={classes.stayGrid}>{[1, 2, 3, 4].map(item => <Skeleton key={item} variant="rounded" height={300} />)}</div>}
				{roomsError && <p className={classes.stateMessage} role="alert">We could not load featured stays right now.</p>}
				{!roomsLoading && !roomsError && rooms.length === 0 && <p className={classes.stateMessage}>No stays are available right now.</p>}
				{!roomsLoading && !roomsError && rooms.length > 0 && (
					<div className={classes.stayGrid}>
						{rooms.slice(0, 4).map((room: RoomResponse) => <FeaturedStay key={room.id} room={room} />)}
					</div>
				)}
			</section>

			<section className={classes.introduction} aria-labelledby="intro-heading">
				<div className={classes.introHeading}>
					<h2 id="intro-heading">Why choose 4LIFE</h2>
					<p>Thoughtful options for finding a place that fits your trip.</p>
				</div>
				<div className={classes.reasons}>
					<article className={classes.reason}>
						<div className={classes.reasonTitle}><LocationOnOutlinedIcon /><h3>Search by neighborhood</h3></div>
						<p>Focus your search on an area you want to visit.</p>
					</article>
					<article className={classes.reason}>
						<div className={classes.reasonTitle}><FavoriteBorderOutlinedIcon /><h3>Save places for later</h3></div>
						<p>Keep accommodations you like together in your favorites.</p>
					</article>
					<article className={classes.reason}>
						<div className={classes.reasonTitle}><FactCheckOutlinedIcon /><h3>Compare before booking</h3></div>
						<p>Review photos, nightly prices and guest reviews before choosing.</p>
					</article>
				</div>
			</section>
		</main>
	);
};

const FeaturedStay = ({ room }: { room: RoomResponse }) => (
	<Link to={`/rooms/${room.id}`} className={classes.stayCard}>
		<div className={classes.stayImageWrap}>
			<img
				src={room.imageUrls[0] || HomeImage}
				alt={room.imageUrls[0] ? room.name : ""}
				className={classes.stayImage}
				loading="lazy"
			/>
		</div>
		<div className={classes.stayDetails}>
			<div className={classes.stayTitleRow}>
				<h3>{room.name}</h3>
				{room.totalReviews > 0 && room.avgRating > 0 && <span className={classes.rating}><StarRoundedIcon />{room.avgRating.toFixed(1)}</span>}
			</div>
			<p className={classes.stayLocation}><LocationOnOutlinedIcon />{room.location.city}, {room.location.district}</p>
			<p className={classes.stayPrice}><strong>${room.price}</strong> / night <span>· {room.totalReviews} reviews</span></p>
		</div>
	</Link>
);

export default HomePage;
