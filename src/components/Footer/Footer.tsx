import { Grid } from "@mui/material";
import classes from "./Footer.module.scss";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = (): React.JSX.Element => {
	return (
		<Grid container className={classes.footer}>
			<Grid xs={12} className={classes.footerInfo}>
				<div className={classes.footerInfoLeft}>
					<p>4LIFE</p>
					<p>Help</p>
					<p>Contact us</p>
				</div>
				<div className={classes.footerInfoCenter}>
					<p>Quick Links</p>
					<p>Rooms</p>
					<p>Home</p>
					<p>Explore</p>
				</div>
				<div className={classes.footerInfoRight}>
					<p>Social Media</p>
					<p>Facebook</p>
					<p>Instagram</p>
					<p>Twitter</p>
					<p>Linkedin</p>
				</div>
			</Grid>
			<Grid className={classes.line}></Grid>
			<Grid xs={12} className={classes.copyRight}>
				<p>&copy; 2023 4LIFE - All rights reserved.</p>
				<div>
					<FacebookOutlinedIcon />
					<InstagramIcon />
					<TwitterIcon />
					<LinkedInIcon />
				</div>
			</Grid>
		</Grid>
	);
};

export default Footer;
