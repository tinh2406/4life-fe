// import { Schedule } from "@mui/icons-material";
import { Box, Card, Divider, Typography } from "@mui/material";
import {
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import colors from "../../assets/theme/base/colors";
import typography from "../../assets/theme/base/typography";
import GradientBox from "./GradientBox";
import { ReportChartType } from "./type";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function ReportsLineChart({ color, title, description, chart }: ReportChartType) {
	const { labels, datasets } = chart;

	return (
		<Card sx={{ height: "80%" }}>
			<Box padding="1rem">
				{useMemo(
					() => (
						<GradientBox bgColor={color} borderRadius="lg" py={2} pr={0.5} mt={-5} height="12.5rem">
							<Line
								data={{
									labels,
									datasets: [
										{
											label: datasets.label,
											tension: 0,
											pointRadius: 5,
											pointBorderColor: "transparent",
											pointBackgroundColor: "rgba(255, 255, 255, .8)",
											borderColor: "rgba(255, 255, 255, .8)",
											borderWidth: 4,
											backgroundColor: "transparent",
											fill: true,
											data: datasets.data
										}
									]
								}}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											display: false
										}
									},
									interaction: {
										intersect: false,
										mode: "index"
									},
									scales: {
										y: {
											grid: {
												display: true,
												drawOnChartArea: true,
												drawTicks: false,
												color: "rgba(255, 255, 255, .2)"
											},
											ticks: {
												display: true,
												color: "#f8f9fa",
												padding: 10,
												font: {
													size: 14,
													weight: 300,
													family: "Roboto",
													style: "normal",
													lineHeight: 2
												}
											}
										},
										x: {
											grid: {
												display: false,
												drawOnChartArea: false,
												drawTicks: false
											},
											ticks: {
												display: true,
												color: "#f8f9fa",
												padding: 10,
												font: {
													size: 14,
													weight: 300,
													family: "Roboto",
													style: "normal",
													lineHeight: 2
												}
											}
										}
									}
								}}
								redraw
							/>
						</GradientBox>
					),
					[chart, color]
				)}
				<Box pt={3} pb={1} px={1}>
					<Typography fontWeight="600" color={colors.dark.main} textTransform="capitalize">
						{title}
					</Typography>
					<Typography
						component="div"
						fontSize={typography.size.sm}
						color={colors.text.main}
						fontWeight="light"
					>
						{description}
					</Typography>
					<Divider />
					{/* <Box display="flex" alignItems="center">
						<Typography color={colors.text.main} lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
							<Schedule />
						</Typography>
						<Typography fontSize={typography.size.sm} color={colors.text.main} fontWeight="light">
							{date}
						</Typography>
					</Box> */}
				</Box>
			</Box>
		</Card>
	);
}

export default ReportsLineChart;
