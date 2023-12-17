import { Box, Card, Divider, Typography } from "@mui/material";
import GradientBox from "./GradientBox";
import colors from "../../assets/theme/base/colors";
import { ColorType } from "./type";
// import { IconType } from "@material-ui/icons";

function ComplexStatisticsCard({
	color,
	title,
	count,
	percentage,
	icon
}: {
	color: ColorType;
	title: string;
	count: string | number;
	percentage: {
		color: "success" | "warning" | "error" | "light";
		amount: string;
		label: string;
	};
	icon: any;
}) {
	return (
		<Card>
			<Box display="flex" justifyContent="space-between" pt={1} px={2} overflow="inherit">
				<GradientBox
					bgColor={color}
					color={color === "light" ? "dark" : "white"}
					borderRadius="xl"
					display="flex"
					justifyContent="center"
					alignItems="center"
					width="4rem"
					height="4rem"
					mt={-3}
				>
					{icon}
				</GradientBox>
				<Box textAlign="right" lineHeight={1.25}>
					<Typography variant="subtitle2" fontWeight="light" color={colors.text.main}>
						{title}
					</Typography>
					<Typography variant="h5" fontWeight={"600"} color={colors.dark.main}>
						{count}
					</Typography>
				</Box>
			</Box>
			<Divider />
			<Box pb={2} px={2}>
				<Typography component="p" variant="subtitle2" color={colors.text.main} display="flex">
					<Typography
						component="span"
						variant="button"
						fontWeight="bold"
						color={colors[percentage.color].main}
					>
						{percentage.amount}
					</Typography>
					&nbsp;{percentage.label}
				</Typography>
			</Box>
		</Card>
	);
}

export default ComplexStatisticsCard;
