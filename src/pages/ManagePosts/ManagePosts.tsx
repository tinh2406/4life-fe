import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import {
	Button,
	Card,
	CardContent,
	Skeleton,
	Tab,
	Tabs,
	Typography
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AddPostDialog from "../../components/Dialog/AddPostDialog";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useMyAccommodations from "../../hooks/use-my-accommodations";
import ActionAreaCard from "../../components/Card/Card";
import useDeleteAccommodation from "../../hooks/use-delete-acommodation";
import useBookingOfMyAccomodations from "../../hooks/use-booking-of-my-accomodation";
import BookingListCard from "../../components/Card/BookingListCard";
import { formatDate } from "../../utils/get-date-month";
import { getTotalSales, getTotalSalesLifeGrow } from "../../api/statistics.api";
import ReportsLineChart from "./ReportsLineChart";
import classes from "./ManagePosts.module.scss";

const salesParams = { IsPaid: null, NumberCycles: 8, TypeCycles: "Week" };

type ChartData = {
	labels: string[];
	datasets: { label: string; data: number[] };
};

const tabProps = (index: number) => ({ id: `manage-posts-tab-${index}`, "aria-controls": `manage-posts-panel-${index}` });

const ManagePostsPage = (): React.JSX.Element => {
	const user = useSelector((state: RootState) => state.auth.login.currentUser);
	const navigate = useNavigate();
	const location = useLocation();
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState(0);
	const [isOpenAddPostDialog, setIsOpenAddPostDialog] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [idAccommodation, setIdAccommodation] = useState(0);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [totalSales, setTotalSales] = useState<number | null>(null);
	const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: { label: "Sales", data: [] } });
	const [statisticsError, setStatisticsError] = useState(false);
	const [isLoadingStatistics, setIsLoadingStatistics] = useState(true);

	const accommodations = useMyAccommodations();
	const bookings = useBookingOfMyAccomodations();
	const deleteAccommodation = useDeleteAccommodation();
	const isHost = user?.statusModRole === "Active";
	const accommodationItems = accommodations.data?.flatMap(page => page.data) ?? [];
	const bookingItems = bookings.data?.flatMap(page => page.data) ?? [];

	useEffect(() => {
		let isMounted = true;
		setIsLoadingStatistics(true);
		setStatisticsError(false);

		Promise.all([getTotalSales(), getTotalSalesLifeGrow(salesParams)])
			.then(([sales, growth]) => {
				if (!isMounted) return;
				setTotalSales(Number(sales.totalAmount));
				const cycles = growth.valueCycles ?? [];
				setChartData({
					labels: cycles.map(cycle => {
						const date = new Date(cycle.dateFrom);
						return Number.isNaN(date.getTime()) ? cycle.dateFrom : new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
					}),
					datasets: { label: "Sales", data: cycles.map(cycle => cycle.value) }
				});
			})
			.catch(() => {
				if (isMounted) setStatisticsError(true);
			})
			.finally(() => {
				if (isMounted) setIsLoadingStatistics(false);
			});

		return () => { isMounted = false; };
	}, []);

	const handleOpenAddPostDialog = () => setIsOpenAddPostDialog(true);
	const handleBecomeHost = () => navigate("/profile", {
		state: { tab: 2, from: `${location.pathname}${location.search}${location.hash}` }
	});
	const handleCloseAddPostDialog = () => {
		setIsOpenAddPostDialog(false);
		setIsEdit(false);
	};
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
		setAnchorEl(event.currentTarget);
		setIdAccommodation(id);
	};
	const handleCloseMenu = () => setAnchorEl(null);
	const handleEdit = (id: number) => {
		setIdAccommodation(id);
		setIsOpenAddPostDialog(true);
		setIsEdit(true);
		setAnchorEl(null);
	};
	const handleDelete = () => {
		setAnchorEl(null);
		deleteAccommodation.mutate(idAccommodation);
	};
	const handleRetry = () => {
		if (activeTab === 2) {
			setIsLoadingStatistics(true);
			setStatisticsError(false);
			Promise.all([getTotalSales(), getTotalSalesLifeGrow(salesParams)])
				.then(([sales, growth]) => {
					setTotalSales(Number(sales.totalAmount));
					const cycles = growth.valueCycles ?? [];
					setChartData({ labels: cycles.map(cycle => {
						const date = new Date(cycle.dateFrom);
						return Number.isNaN(date.getTime()) ? cycle.dateFrom : new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
					}), datasets: { label: "Sales", data: cycles.map(cycle => cycle.value) } });
				})
				.catch(() => setStatisticsError(true))
				.finally(() => setIsLoadingStatistics(false));
			return;
		}
		void queryClient.invalidateQueries(activeTab === 0 ? ["all-my-accomodations"] : ["all-booking-of-my-accomodations"]);
	};

	const currentLoading = activeTab === 0 ? accommodations.isLoading : bookings.isLoading;
	const currentError = activeTab === 0 ? accommodations.isError : bookings.isError;
	const hasItems = activeTab === 0 ? accommodationItems.length > 0 : bookingItems.length > 0;
	const hasNextPage = activeTab === 0 ? accommodations.hasNextPage : bookings.hasNextPage;
	const isFetchingNextPage = activeTab === 0 ? accommodations.isFetchingNextPage : bookings.isFetchingNextPage;
	const fetchNextPage = activeTab === 0 ? accommodations.fetchNextPage : bookings.fetchNextPage;
	const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

	return (
		<main className={classes.page}>
			<div className={classes.content}>
				<header className={classes.pageHeader}>
					<div>
						<h1>Manage your places</h1>
						<p>Keep your listings, guest bookings, and sales in one place.</p>
					</div>
					{isHost ? (
						<Button
							variant="contained"
							startIcon={<AddCircleOutlineOutlinedIcon />}
							className={classes.addButton}
							onClick={handleOpenAddPostDialog}
						>
							Add listing
						</Button>
					) : (
						<Button variant="outlined" className={classes.hostButton} onClick={handleBecomeHost}>
							Become a host
					</Button>
					)}
				</header>

				<Tabs
					value={activeTab}
					onChange={(_event, value: number) => setActiveTab(value)}
					aria-label="Host management"
					className={classes.tabs}
					variant="scrollable"
					scrollButtons="auto"
				>
					<Tab icon={<HomeWorkOutlinedIcon />} iconPosition="start" label="My listings" {...tabProps(0)} />
					<Tab icon={<EventNoteOutlinedIcon />} iconPosition="start" label="Booking status" {...tabProps(1)} />
					<Tab icon={<InsightsOutlinedIcon />} iconPosition="start" label="Statistics" {...tabProps(2)} />
				</Tabs>

				<section id={`manage-posts-panel-${activeTab}`} role="tabpanel" aria-labelledby={`manage-posts-tab-${activeTab}`} className={classes.panel}>
					{activeTab < 2 && (
						<>
							<div className={classes.sectionHeader}>
								<div>
									<h2>{activeTab === 0 ? "Your listings" : "Guest bookings"}</h2>
									<p>{activeTab === 0 ? "Review and update the places you share." : "Check payment and stay details for your guests."}</p>
								</div>
								{hasItems && <span className={classes.resultCount}>{activeTab === 0 ? accommodations.data?.[0]?.meta.totalCount ?? accommodationItems.length : bookings.data?.[0]?.meta.totalCount ?? bookingItems.length} total</span>}
							</div>

							{currentLoading && (
								<div className={classes.listingGrid} aria-label="Loading host information">
									{[0, 1, 2, 3].map(item => (
										<div className={classes.skeletonItem} key={item}>
											<Skeleton variant="rounded" height={190} />
											<Skeleton width="72%" />
											<Skeleton width="48%" />
										</div>
									))}
								</div>
							)}

							{currentError && !currentLoading && (
								<div className={classes.feedbackState} role="alert">
									<h3>We couldn’t load this information</h3>
									<p>Check your connection and try again.</p>
									<Button className={classes.secondaryButton} onClick={handleRetry}>Try again</Button>
								</div>
							)}

							{!currentLoading && !currentError && !hasItems && (
								<div className={classes.emptyState}>
									<div className={classes.emptyIcon}>{activeTab === 0 ? <HomeWorkOutlinedIcon /> : <EventNoteOutlinedIcon />}</div>
									<h3>{activeTab === 0 ? "No listings yet" : "No bookings yet"}</h3>
									<p>{activeTab === 0 ? "Add your first place to begin managing your stays." : "Guest bookings will appear here when someone books one of your places."}</p>
									{activeTab === 0 && (isHost ? (
										<Button className={classes.addButton} variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={handleOpenAddPostDialog}>Add listing</Button>
									) : (
										<Button className={classes.hostButton} variant="outlined" onClick={handleBecomeHost}>Become a host</Button>
									))}
								</div>
							)}

							{!currentLoading && !currentError && hasItems && (
								<div className={classes.listingGrid}>
									{activeTab === 0 ? accommodationItems.map(room => (
										<div className={classes.listingItem} key={room.id}>
											<ActionAreaCard
												idAccommodation={room.id}
												title={room.name}
												type={room.type}
												content={room.address}
												image={room.imageUrls}
												price={room.price.toString()}
												rating={room.avgRating.toString()}
												isFavorite={room.isFavorite}
												isMyPost
												open={Boolean(anchorEl)}
												anchorEl={anchorEl}
												handleClick={handleClick}
												handleClose={handleCloseMenu}
												onEdit={handleEdit}
												handleDelete={handleDelete}
												setAnchorEl={setAnchorEl}
											/>
										</div>
									)) : bookingItems.map(room => (
										<div className={classes.listingItem} key={room.id}>
											<BookingListCard
												idBooking={room.id}
												name={room.accommodation.name}
												address={room.accommodation.address}
												image={room.accommodation.imageUrls}
												price={room.accommodation.price.toString()}
												checkin={formatDate(room.checkInDate)}
												checkout={formatDate(room.checkOutDate)}
												isPaid={room.isPaid}
												isMyPost
												avatar={room.userSummaryDto.avatar}
												userBooking={room.userSummaryDto.name}
											/>
										</div>
									))}
								</div>
							)}

							{!currentLoading && !currentError && hasNextPage && (
								<div className={classes.loadMoreWrap}>
									<Button className={classes.secondaryButton} disabled={isFetchingNextPage} onClick={() => { void fetchNextPage(); }}>
										{isFetchingNextPage ? "Loading…" : "Load more"}
									</Button>
								</div>
							)}
						</>
					)}

					{activeTab === 2 && (
						<div className={classes.statistics}>
							<div className={classes.sectionHeader}>
								<div><h2>Sales overview</h2><p>Sales totals for your recent reporting periods.</p></div>
							</div>
							{statisticsError ? (
								<div className={classes.feedbackState} role="alert"><h3>Statistics are unavailable</h3><p>Check your connection and try again.</p><Button className={classes.secondaryButton} onClick={handleRetry}>Try again</Button></div>
							) : isLoadingStatistics ? (
								<div className={classes.statsGrid}><Skeleton variant="rounded" height={120} /><Skeleton variant="rounded" height={300} /></div>
							) : (
								<div className={classes.statsGrid}>
									<Card className={classes.salesSummary}>
										<CardContent>
											<Typography component="p" className={classes.salesLabel}>Total sales</Typography>
											<Typography component="p" className={classes.salesValue}>{totalSales === null ? "-" : currency.format(totalSales)}</Typography>
										</CardContent>
									</Card>
									{chartData.labels.length > 0 ? (
										<div className={classes.chartWrap}>
											<ReportsLineChart color="primary" title="Sales by week" description="Sales totals for each reporting period." date="" chart={chartData} />
										</div>
									) : <div className={classes.feedbackState}><h3>No sales history yet</h3><p>Sales data will appear here when available.</p></div>}
								</div>
							)}
						</div>
					)}
				</section>
			</div>
			<AddPostDialog
				open={isOpenAddPostDialog}
				isEdit={isEdit}
				setIsEdit={setIsEdit}
				idAccommodation={idAccommodation}
				setIdAccommodation={setIdAccommodation}
				handleClose={handleCloseAddPostDialog}
			/>
		</main>
	);
};

export default ManagePostsPage;
