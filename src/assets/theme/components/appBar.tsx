import { AppBarClasses, AppBarProps, Theme } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

const appBar:{
  defaultProps?: Partial<AppBarProps> | undefined;
  styleOverrides?: Partial<OverridesStyleRules<keyof AppBarClasses, "MuiAppBar", Omit<Theme, "components">>>;

  } = {
  defaultProps: {
    color: "transparent",
  },

  styleOverrides: {
    root: {
      boxShadow: "none",
    },
  },
};

export default appBar;
