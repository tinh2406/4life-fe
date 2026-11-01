import classes from "./About.module.scss";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import User1 from "../../assets/images/user1.png";
import User2 from "../../assets/images/user2.png";
import User3 from "../../assets/images/user3.png";

const AboutPage = (): React.JSX.Element => {
	return (
		<main className={classes.page}>
			<section className={classes.imgAbout} aria-labelledby="about-heading">
				<div className={classes.contentImg}>
					<h1 id="about-heading">About us</h1>
					<p>
						The elegant luxury bedrooms in this gallery showcase custom interior designs & decorating ideas.
						View pictures and find your perfect luxury bedroom design.
					</p>
				</div>
			</section>
			<div className={classes.wrapReviews}>
				<h2 className={classes.title}>What Our Customers Say About 4LIFE?</h2>
				<div className={classes.comments}>
					<div className={classes.commentItem}>
						<p>
							4LIFE made my hotel booking experience effortless. The interface is clean and easy to
							navigate, helping me find the perfect accommodations quickly! It's realy easy to use."
						</p>
						<div className={classes.line}></div>
						<div className={classes.commentFooter}>
							<div className={classes.wrapUser}>
									<img src={User1} alt="Eric" className={classes.userImg} />
								<p>Eric</p>
							</div>
							<div className={classes.action}>
								<ThumbUpOutlinedIcon />
								<ThumbDownOutlinedIcon />
							</div>
						</div>
					</div>
					<div className={classes.commentItem}>
						<p>
							Booking through 4LIFE was a breeze! The wide range of hotel options, coupled with detailed
							descriptions, allowed me to make an informed decision. Highly recommended!
						</p>
						<div className={classes.line}></div>
						<div className={classes.commentFooter}>
							<div className={classes.wrapUser}>
									<img src={User2} alt="Hans" className={classes.userImg} />
								<p>Hans</p>
							</div>
							<div className={classes.action}>
								<ThumbUpOutlinedIcon />
								<ThumbDownOutlinedIcon />
							</div>
						</div>
					</div>
					<div className={classes.commentItem}>
						<p>
							4LIFE is my go-to platform for hotel bookings. It offers an intuitive search function and
							comprehensive filters, ensuring I find the ideal stay for my preferences and budget.
						</p>
						<div className={classes.line}></div>
						<div className={classes.commentFooter}>
							<div className={classes.wrapUser}>
									<img src={User3} alt="John Doe" className={classes.userImg} />
								<p>John Doe</p>
							</div>
							<div className={classes.action}>
								<ThumbUpOutlinedIcon />
								<ThumbDownOutlinedIcon />
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default AboutPage;
