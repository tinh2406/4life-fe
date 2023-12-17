import { LinearProgressClasses, LinearProgressProps, Theme } from "@mui/material";
import borders from "../base/borders";
import colors from "../base/colors";

// Material Dashboard 2 React helper functions
import pxToRem from "../functions/pxToRem";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

const { borderRadius } = borders;
const { primary,white } = colors;

const linearProgress: {
	defaultProps?: Partial<LinearProgressProps> | undefined;
	styleOverrides?: Partial<
		OverridesStyleRules<keyof LinearProgressClasses, "MuiLinearProgress", Omit<Theme, "components">>
	>;
} = {
	styleOverrides: {
		root: {
			height: pxToRem(4),
			borderRadius: borderRadius.md,
			overflow: "visible",
			position: "relative",
		},

		colorPrimary: {
			backgroundColor: primary.main
		},

		colorSecondary: {
			backgroundColor: white.main
		},

		bar: {
			height: pxToRem(4),
			borderRadius: borderRadius.sm,
			position: "absolute",
			transform: `translate(0, 0) !important`,
			transition: "width 0.6s ease !important"
		}
	}
};

export default linearProgress;
