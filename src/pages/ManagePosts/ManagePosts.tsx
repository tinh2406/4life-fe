import { Button, Grid, Box, MenuItem, Select, SelectChangeEvent, Skeleton } from "@mui/material";
import classes from "./ManagePosts.module.scss";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useEffect, useRef, useState } from "react";
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
import ComplexStatisticsCard from "./StatisticsCard";
// import ReportsBarChart from "./ReportsBarChart";
import { Leaderboard, Store, Weekend } from "@mui/icons-material";
import Chart, { ChartConfiguration, DoughnutController, ArcElement, Title, Legend } from "chart.js/auto";
import { getTotalSales, getTotalSalesLifeGrow } from "../../api/statistics.api";
import ReportsLineChart from "./ReportsLineChart";

// const barchartData = {
// 	labels: ["M", "T", "W", "T", "F", "S", "S"],
// 	datasets: { label: "Sales", data: [50, 20, 10, 22, 50, 10, 40] }
// };

// const linechartData = {
// 	sales: {
// 		labels: ["7ws ago", "6ws ago", "5ws ago", "4ws ago", "3ws ago", "2ws ago", "Last week", "This week"],
// 		datasets: { label: "Mobile apps", data: [40, 300, 320, 500, 350, 200, 230, 500] }
// 	}
// };

const labels = ["7ws ago", "6ws ago", "5ws ago", "4ws ago", "3ws ago", "2ws ago", "Last week", "This week"];
const initSalesParams = {
	IsPaid: null,
	NumberCycles: 8,
	TypeCycles: "Week"
};

type ChartProps = {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
	};
};

const ManagePostsPage = (): React.JSX.Element => {
	const user = useSelector((state: RootState) => state.auth.login.currentUser);
	const [isOpenAddPostDialog, setIsOpenAddPostDialog] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [idAccommodation, setIdAccommodation] = useState<number>(0);
	const [selectedFilter, setSelectedFilter] = useState<number>(1);
	const [totalSales, setTotalSales] = useState<number>(0);
	const [dataTotalSalesLifeGrowth, setDataTotalSalesLifeGrowth] = useState<number[]>([]);
	const [chartData, setChartData] = useState<ChartProps>({} as ChartProps);

	const { isFetching, data } = useMyAccommodations();
	const { data: dataBookingOfMyAccommodations } = useBookingOfMyAccomodations();

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
		// setIdAccommodation(idAccommodation);
		setIsEdit(true);
		setAnchorEl(null);
	};

	const handleDelete = () => {
		setAnchorEl(null);
		deleteAccommodation.mutate(idAccommodation ?? 0);
	};

	useEffect(() => {
		getTotalSalesLifeGrow(initSalesParams).then(res => {
			res.valueCycles?.map(value => {
				setDataTotalSalesLifeGrowth(prev => [...prev, value.value]);
			});
		});
	}, []);

	useEffect(() => {
		getTotalSales().then(res => {
			setTotalSales(res.totalAmount);
		});
		setChartData({
			labels: labels,
			datasets: {
				label: "Sales",
				data: dataTotalSalesLifeGrowth
			}
		});
	}, [setChartData, dataTotalSalesLifeGrowth]);

	const chartContainer = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (chartContainer && chartContainer.current) {
			const data = {
				labels: ["\u2605", "2\u2605", "3\u2605", "4\u2605", "5\u2605"],
				datasets: [
					{
						label: "Rating",
						data: [10, 20, 20, 20, 30],
						backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#e53935", "#43a047"],
						borderWidth: 1
					}
				]
			};

			const config: ChartConfiguration<"doughnut"> = {
				type: "doughnut",
				data: data,
				options: {
					plugins: {
						title: {
							display: true,
							text: "Customer's Satisfaction"
						},
						legend: {
							display: true,
							position: "bottom"
						}
					}
				}
			};

			Chart.register(DoughnutController, ArcElement, Title, Legend);

			const myChart = new Chart(chartContainer.current, config);

			return () => {
				myChart.destroy();
			};
		}
	});

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
					<MenuItem value={2}>Booking Status</MenuItem>
					<MenuItem value={3}>Statistics</MenuItem>
				</Select>
			</Grid>
			<Grid
				container
				item
				xs={12}
				className={classes.wrapperRoooms}
				display="flex"
				// flexDirection="column"
				// justifyContent="center"
			>
				{isFetching &&
					data === undefined &&
					!isOpenAddPostDialog &&
					[1, 2, 3, 4].map((_item, index) => (
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
									setAnchorEl={setAnchorEl}
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
									avatar={room.userSummaryDto.avatar}
									userBooking={room.userSummaryDto.name}
								/>
							</Grid>
						))
					)}
				{selectedFilter === 3 && (
					<>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6} lg={4} xl={3}>
								<Box mb={1.5}>
									<ComplexStatisticsCard
										color="dark"
										icon={<Weekend fontSize="medium" />}
										title="Booking my accommodations"
										count={281}
										percentage={{
											color: "success",
											amount: "+55%",
											label: "than lask week"
										}}
									/>
								</Box>
							</Grid>
							<Grid item xs={12} md={6} lg={4} xl={3}>
								<Box mb={1.5}>
									<ComplexStatisticsCard
										color="info"
										icon={<Leaderboard fontSize="medium" />}
										title="Total Bookings"
										count="2,300$"
										percentage={{
											color: "success",
											amount: "+3%",
											label: "than last month"
										}}
									/>
								</Box>
							</Grid>
							<Grid item xs={12} md={6} lg={4} xl={3}>
								<Box mb={1.5}>
									<ComplexStatisticsCard
										color="success"
										icon={<Store fontSize="medium" />}
										title="Revenue"
										count="34$"
										percentage={{
											color: "success",
											amount: "+1%",
											label: "than yesterday"
										}}
									/>
								</Box>
							</Grid>
							<Grid item xs={12} md={6} lg={4} xl={3}>
								<Box mb={1.5}>
									<ComplexStatisticsCard
										color="info"
										icon={<Leaderboard fontSize="medium" />}
										title="Total Sales"
										count={`${totalSales}$`}
										percentage={{
											color: "success",
											amount: "+3%",
											label: "than last month"
										}}
									/>
								</Box>
							</Grid>
						</Grid>
						{/* <Box mt={4.5}> */}
						{/* <Grid container spacing={3}>
								<Grid item xs={12} md={12} xl={12}>
									<ReportsBarChart
										color="info"
										title="website views"
										description="Last Campaign Performance"
										date="campaign sent 2 days ago"
										chart={barchartData}
									/>
								</Grid>
							</Grid> */}
						<Grid
							container
							display="flex"
							justifyContent="center"
							alignItems="flex-end"
							marginTop={10}
							spacing={2}
						>
							<Grid item xs={12} md={4} xl={4}>
								<ReportsLineChart
									color="dark"
									title="Total bookings"
									description={
										<>
											(<strong>+15%</strong>) increase in today booking.
										</>
									}
									date="updated 4 min ago"
									chart={chartData}
								/>
							</Grid>
							<Grid item xs={12} md={4} xl={4}>
								<canvas ref={chartContainer} width={400} height={400}></canvas>
							</Grid>
							<Grid item xs={12} md={4} xl={4}>
								<ReportsLineChart
									color="success"
									title="daily sales"
									description={
										<>
											(<strong>+15%</strong>) increase in today sales.
										</>
									}
									date="updated 4 min ago"
									chart={chartData}
								/>
							</Grid>
						</Grid>
						{/* </Box> */}
					</>
				)}
			</Grid>
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
