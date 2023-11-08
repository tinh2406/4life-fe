import { Grid, Paper, Skeleton } from "@mui/material";
import classes from "./Rooms.module.scss";
import FilterSelect from "../../components/FilterSelect/FilterSelect";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import PeopleIcon from "@mui/icons-material/People";
import { useState } from "react";
import RoomsIntroduce from "../../assets/images/roomsIntroduce.png";
import ActionAreaCard from "../../components/Card/Card";
import useRooms from "../../hooks/user-rooms";
import { LoadingButton } from "@mui/lab";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";

const RoomsPage = (): React.JSX.Element => {
	const [value, setValue] = useState<Dayjs | null>(dayjs("2022-04-17"));
	const { isLoading, isError, isFetching, data, handleLocationChange, fetchNextPage } = useRooms();
	return (
		<Grid container>
			<Grid item xs={12} className={classes.wrapperFilter}>
				<Paper elevation={6} className={classes.filter}>
					<FilterSelect
						label="Location"
						icon={<LocationOnIcon />}
						value="Da Nang"
						onChange={(value: string) => console.log(value)}
					/>
					<FilterSelect
						label="Type"
						icon={<MapsHomeWorkIcon />}
						value="Da Nang"
						onChange={(value: string) => console.log(value)}
					/>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							className={classes.datePicker}
							label="Check in"
							value={value}
							onChange={newValue => setValue(newValue)}
						/>
					</LocalizationProvider>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							className={classes.datePicker}
							label="Check out"
							value={value}
							onChange={newValue => setValue(newValue)}
						/>
					</LocalizationProvider>
					<FilterSelect
						label="Guests"
						icon={<PeopleIcon />}
						value="Da Nang"
						onChange={(value: string) => console.log(value)}
					/>
				</Paper>
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
				{isFetching ??
					[1, 2, 3, 4, 5, 6].map((item, index) => {
						<Grid key={index} xs={6} sm={4} md={3} className={classes.roomItem}>
							<Skeleton variant="rectangular" width={210} height={118} />
							<Skeleton width="60%" />
						</Grid>;
					})}
				{data?.map(item =>
					item.data.map((room, i) => (
						<Grid key={i} xs={6} sm={4} md={3} className={classes.roomItem}>
							<ActionAreaCard
								title={room.name}
								content={room.address}
								image={room.imageUrls[0]}
								price={room.price.toString()}
								rating="4,9"
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
