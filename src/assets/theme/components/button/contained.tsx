import colors from "../../base/colors";
import typography from "../../base/typography";

// Material Dashboard 2 React Helper Functions
import pxToRem from "../../functions/pxToRem";
import { CSSInterpolation } from "@mui/styled-engine";

const { white, text, primary, secondary } = colors;
const { size } = typography;

const contained: Record<"base" | "small" | "large" | "primary" | "secondary", CSSInterpolation> = {
	base: {
		backgroundColor: white.main,
		minHeight: pxToRem(40),
		color: text.main,
		outline: 0,
		padding: `${pxToRem(10)} ${pxToRem(24)}`,
		outlineStyle: "none",

		"&:hover": {
			backgroundColor: white.main
		},

		"&:active, &:active:focus, &:active:hover": {
			opacity: 0.85
		},

		"& .material-icon, .material-icons-round, svg": {
			fontSize: `${pxToRem(16)} !important`
		}
	},

	small: {
		minHeight: pxToRem(32),
		padding: `${pxToRem(6)} ${pxToRem(16)}`,
		fontSize: size.xs,

		"& .material-icon, .material-icons-round, svg": {
			fontSize: `${pxToRem(12)} !important`
		}
	},

	large: {
		minHeight: pxToRem(47),
		padding: `${pxToRem(12)} ${pxToRem(28)}`,
		fontSize: size.sm,

		"& .material-icon, .material-icons-round, svg": {
			fontSize: `${pxToRem(22)} !important`
		}
	},

	primary: {
		backgroundColor: primary.main,

		"&:hover": {
			backgroundColor: primary.focus
		},

		"&:focus:not(:hover)": {
			// backgroundColor: info.focus
		}
	},

	secondary: {
		backgroundColor: secondary.main,

		"&:hover": {
			backgroundColor: secondary.main
		}

		// "&:focus:not(:hover)": {
		// 	backgroundColor: secondary.focus
		// }
	}
};

export default contained;
