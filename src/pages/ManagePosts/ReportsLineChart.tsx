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
import { Line } from "react-chartjs-2";
import { ReportChartType } from "./type";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function ReportsLineChart({ title, description, chart }: ReportChartType): React.JSX.Element {
	return (
		<Card sx={{ height: "100%", boxShadow: "none", borderRadius: "14px" }}>
			<Box padding="1.25rem">
				<Box sx={{ position: "relative", height: "230px", width: "100%" }}>
					<Line
						data={{
							labels: chart.labels,
							datasets: [{
								label: chart.datasets.label,
								data: chart.datasets.data,
								tension: 0.28,
								pointRadius: 3,
								pointHoverRadius: 5,
								pointBorderColor: "#ffffff",
								pointBorderWidth: 2,
								pointBackgroundColor: "#2f7668",
								borderColor: "#2f7668",
								borderWidth: 2,
								backgroundColor: "rgba(47, 118, 104, .10)",
								fill: true
							}]
						}}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							interaction: { intersect: false, mode: "index" },
							plugins: { legend: { display: false } },
							scales: {
								y: {
									beginAtZero: true,
									grid: { color: "#edf1ed" },
									ticks: { color: "#586970", padding: 8, font: { family: "K2D", size: 12 } }
								},
								x: {
									grid: { display: false },
									ticks: { color: "#586970", maxRotation: 0, font: { family: "K2D", size: 12 } }
								}
							}
						}}
						redraw
					/>
				</Box>
				<Box pt={2} pb={1}>
					<Typography fontWeight="600" color="#172b3a" textTransform="capitalize">{title}</Typography>
					<Typography component="div" fontSize={15} color="#586970" fontWeight="light">{description}</Typography>
					<Divider sx={{ mt: 1.5 }} />
				</Box>
			</Box>
		</Card>
	);
}

export default ReportsLineChart;
