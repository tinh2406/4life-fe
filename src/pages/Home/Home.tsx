import React from "react";
import { Button } from "@mui/material";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import HomeImage from "../../assets/images/home.png";
import { useNavigate } from "react-router-dom";
import classes from "./Home.module.scss";

const HomePage = (): React.JSX.Element => {
	const navigate = useNavigate();

	return (
		<main className={classes.page}>
			<section className={classes.hero} aria-labelledby="home-heading">
				<img src={HomeImage} alt="" className={classes.heroImage} />
				<div className={classes.heroContent}>
					<h1 id="home-heading">Book your stay with 4LIFE</h1>
					<p>
						Many fantastic rooms are waiting for you! Let discover the best hotels and resorts to stay.
						Don't worry about the quality of the service!
					</p>
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

			<section className={classes.introduction} aria-labelledby="intro-heading">
				<div className={classes.introCopy}>
					<h2 id="intro-heading">Why choose 4LIFE</h2>
					<p className={classes.introLead}>
						We are a group of young people who are passionate about travel. We have been to many places and
						experienced many different types of hotels and resorts. We understand what you need when you
						come to a new place. We are here to help you find the best place to stay.
					</p>
					<div className={classes.reasons}>
						<article className={classes.reason}>
							<div>
								<h3>We provide the best choice of hotels and homestays for you to stay</h3>
								<p>We always prioritize customer comfort and satisfaction. That’s why we only accept the best accommodation.</p>
							</div>
						</article>
						<article className={classes.reason}>
							<div>
								<h3>Low price with best quality</h3>
								<p>Although the price tends to be cheaper but it will not affect the quality of service, so don’t worry.</p>
							</div>
						</article>
						<article className={classes.reason}>
							<div>
								<h3>Variety of accommodation and facilities</h3>
								<p>We provide a variety of the best lodging accommodations for those of you who need it.</p>
							</div>
						</article>
					</div>
				</div>
			</section>
		</main>
	);
};

export default HomePage;
