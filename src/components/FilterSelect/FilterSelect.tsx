import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { IconButton } from "@mui/material";

interface FilterSelectProps {
	label: string;
	icon: React.ReactNode;
	// options: SelectOption<V>[];
	value: string | "";
	onChange: (value: string) => void;
	// disabled?: boolean;
}

const FilterSelect = ({ label, icon, value, onChange }: FilterSelectProps): React.JSX.Element => {
	// const handleChange = (event: SelectChangeEvent) => {
	// 	setAge(event.target.value);
	// };
	const handleChange = (event: SelectChangeEvent): void => {
		onChange(event.target.value);
	};
	return (
		<FormControl sx={{ m: 1, minWidth: 120 }} size="small">
			<InputLabel id="demo-select-small-label">{label}</InputLabel>
			<Select value={value} label={label} onChange={handleChange}>
				<MenuItem value="">
					<em>None</em>
				</MenuItem>
				<MenuItem value="Da Nang">
					<div style={{ display: "flex", alignItems: "center" }}>
						<IconButton
							aria-label="Hue icon"
							size="small"
							sx={{ marginRight: 1 }} // Khoảng cách giữa biểu tượng và giá trị
						>
							{icon}
						</IconButton>
						Da Nang
					</div>
				</MenuItem>
				<MenuItem value="">
					<div style={{ display: "flex", alignItems: "center" }}>
						<IconButton
							aria-label="Hue icon"
							size="small"
							sx={{ marginRight: 1 }} // Khoảng cách giữa biểu tượng và giá trị
						>
							{icon}
						</IconButton>
						Thua Thien Hue
					</div>
				</MenuItem>
				<MenuItem value="">
					<div style={{ display: "flex", alignItems: "center" }}>
						<IconButton
							aria-label="Hue icon"
							size="small"
							sx={{ marginRight: 1 }} // Khoảng cách giữa biểu tượng và giá trị
						>
							{icon}
						</IconButton>
						Quang Nam
					</div>
				</MenuItem>
			</Select>
		</FormControl>
	);
};

export default FilterSelect;
