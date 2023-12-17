import { SvgIconClasses, SvgIconProps, Theme } from "@mui/material";
import pxToRem from "../functions/pxToRem";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

const svgIcon: {
	defaultProps?: Partial<SvgIconProps> | undefined;
	styleOverrides?: Partial<OverridesStyleRules<keyof SvgIconClasses, "MuiSvgIcon", Omit<Theme, "components">>>;
} = {
	defaultProps: {
		fontSize: "inherit"
	},

	styleOverrides: {
		fontSizeInherit: {
			fontSize: `${pxToRem(18)} !important`
		},

		fontSizeSmall: {
			fontSize: `${pxToRem(20)} !important`
		},

		fontSizeLarge: {
			fontSize: `${pxToRem(36)} !important`
		}
	}
};

export default svgIcon;
