export interface SalesLifeGrowth {
	typeCycles: string;
	numberCycles: number;
	valueCycles: [
		{
			dateFrom: string;
			dateTo: string;
			cyclesNo: number;
			value: number;
		}
	];
}
