import { Box } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import colors from "../../assets/theme/base/colors";
import linearGradient from "../../assets/theme/functions/linearGradient";
import borders from "../../assets/theme/base/borders";
import boxShadows from "../../assets/theme/base/boxShadows";
type ColorType = "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
const GradientBox = ({ bgColor, children, ...rest }: BoxProps & { bgColor?: ColorType }) => {
	return (
		<Box
			sx={{
				opacity: 1,
				background: bgColor
					? linearGradient(colors.gradients[bgColor].main, colors.gradients[bgColor].state)
					: colors.white.main,
				color: colors.white.main,
				borderRadius: borders.borderRadius.xl,
				boxShadow: boxShadows.colored.dark
			}}
			{...rest}
		>
			{children}
		</Box>
	);
};
export default GradientBox;
