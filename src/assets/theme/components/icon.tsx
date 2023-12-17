import { IconClasses, IconProps, Theme } from "@mui/material";
import pxToRem from "../functions/pxToRem";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

const icon: {
	defaultProps?: Partial<IconProps> | undefined;
	styleOverrides?: Partial<OverridesStyleRules<keyof IconClasses, "MuiIcon", Omit<Theme, "components">>>;
} = {
	defaultProps: {
		baseClassName: "material-icons-round",
		fontSize: "inherit"
	},

	styleOverrides: {
		fontSizeInherit: {
			fontSize: "inherit !important"
		},

		fontSizeSmall: {
			fontSize: `${pxToRem(20)} !important`
		},

		fontSizeLarge: {
			fontSize: `${pxToRem(36)} !important`
		}
	}
};

export default icon;
