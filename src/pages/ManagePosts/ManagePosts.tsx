import { Button, Grid, MenuItem, Select, SelectChangeEvent, Skeleton } from "@mui/material";
import classes from "./ManagePosts.module.scss";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useState } from "react";
import AddPostDialog from "../../components/Dialog/AddPostDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Tooltip from "@mui/material/Tooltip";
import useMyAccommodations from "../../hooks/use-my-accommodations";
import ActionAreaCard from "../../components/Card/Card";
import useDeleteAccommodation from "../../hooks/use-delete-acommodation";
import useBookingOfMyAccomodations from "../../hooks/use-booking-of-my-accomodation";
import BookingListCard from "../../components/Card/BookingListCard";
import { formatDate } from "../../utils/get-date-month";
// import { LoadingButton } from "@mui/lab";
// import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
// import MapContainer from "../../components/Map/Map";

const ManagePostsPage = (): React.JSX.Element => {
	const user = useSelector((state: RootState) => state.auth.login.currentUser);
	const [isOpenAddPostDialog, setIsOpenAddPostDialog] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [idAccommodation, setIdAccommodation] = useState<number>(0);
	const [selectedFilter, setSelectedFilter] = useState<number>(1);

	const { isFetching, data } = useMyAccommodations();
	const { data: dataBookingOfMyAccommodations } = useBookingOfMyAccomodations();
	console.log("dataBookingOfMyAccommodations", dataBookingOfMyAccommodations);

	const deleteAccommodation = useDeleteAccommodation();

	const handleFilterChange = (event: SelectChangeEvent<number>) => {
		console.log(event.target.value);
		setSelectedFilter(event.target.value as number);
	};

	const handleOpenAddPostDialog = (): void => {
		setIsOpenAddPostDialog(true);
	};

	const handleCloseAddPostDialog = (): void => {
		setIsOpenAddPostDialog(false);
		setIsEdit(false);
	};

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
		setAnchorEl(event.currentTarget);
		setIdAccommodation(id);
	};

	const handleClose = () => {
		setIsOpenAddPostDialog(true);
		setIsEdit(true);
		setAnchorEl(null);
	};

	const handleDelete = () => {
		setAnchorEl(null);
		deleteAccommodation.mutate(idAccommodation ?? 0);
	};

	return (
		<Grid container spacing={3} className={classes.wrapper}>
			<Grid item xs={12} className={selectedFilter === 1 ? classes.wrapperOption : classes.wrapperSelect}>
				<Tooltip
					title="Resgiter to mod to post your accomodation!"
					disableHoverListener={user?.statusModRole === "Active"}
					placement="right-start"
				>
					<span>
						<Button
							variant="contained"
							color="primary"
							startIcon={<AddCircleOutlineOutlinedIcon />}
							onClick={handleOpenAddPostDialog}
							className={selectedFilter === 1 ? classes.btnAdd : classes.hidden}
							disabled={user?.statusModRole !== "Active"}
						>
							Add Post
						</Button>
					</span>
				</Tooltip>
				<Select value={selectedFilter} onChange={handleFilterChange} className={classes.select}>
					<MenuItem value={1}>My Post</MenuItem>
					<MenuItem value={2}>State Booking</MenuItem>
				</Select>
			</Grid>
			<Grid container item xs={12} className={classes.wrapperRoooms}>
				{isFetching &&
					!isOpenAddPostDialog &&
					[1, 2, 3, 4].map((item, index) => (
						<Grid key={index} xs={6} sm={4} md={3} className={classes.roomItem}>
							<Skeleton variant="rectangular" width={300} height={158} />
							<Skeleton width="60%" />
						</Grid>
					))}
				{selectedFilter === 1 &&
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
									isMyPost={true}
									open={open}
									anchorEl={anchorEl}
									handleClick={e => handleClick(e, room.id)}
									handleClose={handleClose}
									handleDelete={handleDelete}
								/>
							</Grid>
						))
					)}
				{selectedFilter === 2 &&
					dataBookingOfMyAccommodations?.map(item =>
						item.data.map((room, i) => (
							<Grid key={i} xs={6} sm={4} md={3} className={classes.roomItem}>
								<BookingListCard
									idBooking={room.id}
									name={room.accommodation.name}
									address={room.accommodation.address}
									image={room.accommodation.imageUrls}
									price={room.accommodation.price.toString()}
									checkin={formatDate(room.checkInDate)}
									checkout={formatDate(room.checkOutDate)}
									isPaid={room.isPaid}
									isMyPost={true}
								/>
							</Grid>
						))
					)}
			</Grid>
			{/* {data[0]?.data.length > 1 && (
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
			)} */}
			{/* <MapContainer /> */}
			<AddPostDialog
				open={isOpenAddPostDialog}
				isEdit={isEdit}
				setIsEdit={setIsEdit}
				idAccommodation={idAccommodation}
				setIdAccommodation={setIdAccommodation}
				handleClose={handleCloseAddPostDialog}
			/>
		</Grid>
	);
};

export default ManagePostsPage;
