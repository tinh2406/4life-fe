import React from "react";

export type ColorType = "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";

export type ReportChartType = {
	color: ColorType;
	title: string;
	description: React.ReactNode;
	date: string;
	chart: {
		labels: string[];
		datasets: {
			label: string;
			data: number[];
		};
	};
}