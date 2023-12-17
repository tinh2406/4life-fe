import { createTheme } from "@mui/material/styles";

import breakpoints from "./base/breakpoints";
import globals from "./base/globals";

// import sidenav from "./components/sidenav";
import list from "./components/list";
import listItem from "./components/list/listItem";
import listItemText from "./components/list/listItemText";
import card from "./components/card";
import cardMedia from "./components/card/cardMedia";
import cardContent from "./components/card/cardContent";
import button from "./components/button";
import iconButton from "./components/iconButton";
import input from "./components/form/input";
import inputLabel from "./components/form/inputLabel";
import inputOutlined from "./components/form/inputOutlined";
import textField from "./components/form/textField";
import menu from "./components/menu";
import menuItem from "./components/menu/menuItem";
import divider from "./components/divider";
import tableContainer from "./components/table/tableContainer";
import tableHead from "./components/table/tableHead";
import tableCell from "./components/table/tableCell";
import linearProgress from "./components/linearProgress";
import breadcrumbs from "./components/breadcrumbs";
import avatar from "./components/avatar";
import appBar from "./components/appBar";
import autocomplete from "./components/form/autocomplete";
import container from "./components/container";
import buttonBase from "./components/buttonBase";
import icon from "./components/icon";
import svgIcon from "./components/svgIcon";

export default createTheme({
	breakpoints: { ...breakpoints },

	components: {
		MuiCssBaseline: {
			styleOverrides: {
				...globals,
				...container
			}
		},
		// MuiDrawer: { ...sidenav },
		MuiList: { ...list },
		MuiListItem: { ...listItem },
		MuiListItemText: { ...listItemText },
		MuiCard: { ...card },
		MuiCardMedia: { ...cardMedia },
		MuiCardContent: { ...cardContent },
		MuiButton: { ...button },
		MuiIconButton: { ...iconButton },
		MuiInput: { ...input },
		MuiInputLabel: { ...inputLabel },
		MuiOutlinedInput: { ...inputOutlined },
		MuiTextField: { ...textField },
		MuiMenu: { ...menu },
		MuiMenuItem: { ...menuItem },
		MuiDivider: { ...divider },
		MuiTableContainer: { ...tableContainer },
		MuiTableHead: { ...tableHead },
		MuiTableCell: { ...tableCell },
		MuiLinearProgress: { ...linearProgress },
		MuiBreadcrumbs: { ...breadcrumbs },
		MuiAvatar: { ...avatar },
		MuiAppBar: { ...appBar },
		MuiAutocomplete: { ...autocomplete },
		MuiButtonBase: { ...buttonBase },
		MuiIcon: { ...icon },
		MuiSvgIcon: { ...svgIcon }
	}
});
