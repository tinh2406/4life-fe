import React from "react";
import Home from "../../assets/images/home.png";
import classes from "./Home.module.scss";
import { Button, Grid } from "@mui/material";
// import FilterSelect from "../../components/FilterSelect/FilterSelect";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
// import PeopleIcon from "@mui/icons-material/People";
import IntroduceImg from "../../assets/images/introduce.png";
import { useNavigate } from "react-router-dom";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";

// import dayjs, { Dayjs } from "dayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const HomePage = (): React.JSX.Element => {
	// const [value, setValue] = React.useState<Dayjs | null>(dayjs("2022-04-17"));
	const navigate = useNavigate();

	return (
		<>
			<Grid container>
				<Grid item xs={12} className={classes.wrapperImg}>
					<img src={Home} className={classes.homeImg} />
					<div className={classes.text}>
						<div className={classes.title}>Book Your Stay With 4LIFE</div>
						<div className={classes.content}>
							Many fantastic rooms are waiting for you! Let discover the best hotels and resorts to stay.
							Don't worry about the quality of the service!
						</div>
						<Button
							variant="contained"
							endIcon={<ArrowRightAltOutlinedIcon />}
							className={classes.btn}
							onClick={() => navigate("/rooms")}
						>
							Explore
						</Button>
					</div>
					{/* <Paper elevation={6} className={classes.filter}>
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
					</Paper> */}
				</Grid>
				{/* <Grid item xs={10} className={classes.wrapperIntroduce}> */}
				<div className={classes.introduce}>
					<div className={classes.titleIntroduce}>WHY YOU SHOULD CHOOSE US</div>
					<div className={classes.contentIntroduce}>
						We are a group of young people who are passionate about travel. We have been to many places and
						experienced many different types of hotels and resorts. We understand what you need when you
						come to a new place. We are here to help you find the best place to stay.
					</div>
					<div className={classes.wrapperContentIntroduce}>
						<div className={classes.contentLeft}>
							<div className={classes.contentItem}>
								<div className={classes.number}>01</div>
								<div className={classes.contentIntroduceItem}>
									<div className={classes.contentTitle}>
										We provide the best choice of hotels, homestays,... for you to stay
									</div>
									<div className={classes.contentMain}>
										We always prioritize customer comfort and satisfaction. That’s why we only
										accept the best accommodation.
									</div>
								</div>
							</div>
							<div className={classes.contentItem}>
								<div className={classes.number}>02</div>
								<div className={classes.contentIntroduceItem}>
									<div className={classes.contentTitle}>Low price with best quality</div>
									<div className={classes.contentMain}>
										Although the price tends to be cheaper but it will not affect the quality of
										service, so don’t worry.
									</div>
								</div>
							</div>
							<div className={classes.contentItem}>
								<div className={classes.number}>03</div>
								<div className={classes.contentIntroduceItem}>
									<div className={classes.contentTitle}>Variety of accommodation and facilities</div>
									<div className={classes.contentMain}>
										We provide a variety of the best lodging accommodations for those of you who
										need it.
									</div>
								</div>
							</div>
						</div>
						<div className={classes.contentRight}>
							<img src={IntroduceImg} alt="Introduce" className={classes.introduceImg} />
						</div>
					</div>
				</div>
				{/* </Grid> */}
			</Grid>
		</>
	);
};

export default HomePage;
