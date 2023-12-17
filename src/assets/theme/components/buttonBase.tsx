import { ButtonBaseClasses, ButtonBaseProps, Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

const buttonBase: {
	defaultProps?: Partial<ButtonBaseProps> | undefined;
	styleOverrides?: Partial<OverridesStyleRules<keyof ButtonBaseClasses, "MuiButtonBase", Omit<Theme, "components">>>;
} = {
	defaultProps: {
		disableRipple: false
	},
	styleOverrides: {
		root: {
			outlineStyle: "none",
			":focus": {
				outlineStyle: "none"
			}
		}
	}
};

export default buttonBase;
