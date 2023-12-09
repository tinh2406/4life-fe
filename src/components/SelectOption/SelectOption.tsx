import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
// import { MenuItem, ListItemIcon, Typography } from "@mui/material";

export interface SelectType {
	label: string;
	value: number;
}

interface SelectOptionProps {
	// nameSelect: string;
	options: SelectType[];
	onChange: (value: number) => void;
	value: number;
	// disabled?: boolean;
}

const SelectOption = ({ options, onChange, value }: SelectOptionProps): React.JSX.Element => {
	const handleChange = (event: React.ChangeEvent<unknown>, value: SelectType | null) => {
		onChange(value?.value || 0);
	};

	return (
		<Autocomplete
			options={options}
			getOptionLabel={option => option.label}
			value={options.find(option => option.value === value) || null}
			onChange={handleChange}
			renderInput={params => <TextField {...params} variant="outlined" />}
		/>
	);
};

export default SelectOption;
