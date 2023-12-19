import { SalesLifeGrowth } from "../types/axios/sales-life-growth";
import { axiosInstance } from "./instance";

interface SalesParams {
	IsPaid?: boolean | null;
	NumberCycles: number;
	TypeCycles: string;
}

export const getTotalSales = async () => {
	const response = await axiosInstance.get("/statistics/total-amount");
	return response.data;
};

export const getTotalSalesLifeGrow = async (params: SalesParams): Promise<SalesLifeGrowth> => {
	const response = await axiosInstance.get<SalesLifeGrowth>("/statistics/total-sales-life-growth", {
		params: {
			...params
		}
	});
	return response.data;
};
