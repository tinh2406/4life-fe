import typography from "../../base/typography";
import borders from "../../base/borders";

// Material Dashboard 2 React Helper Functions
import pxToRem from "../../functions/pxToRem";
import { CSSInterpolation } from "@mui/styled-engine";

const { fontWeightBold, size } = typography;
const { borderRadius } = borders;

const root:CSSInterpolation = {
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: size.xs,
  fontWeight: fontWeightBold,
  borderRadius: borderRadius.lg,
  padding: `${pxToRem(6.302)} ${pxToRem(16.604)}`,
  lineHeight: 1.4,
  textAlign: "center",
  textTransform: "uppercase",
  userSelect: "none",
  backgroundSize: "150% !important",
  backgroundPositionX: "25% !important",
  transition: "all 150ms ease-in",

  "&:disabled": {
    pointerEvent: "none",
    opacity: 0.65,
  },

  "& .material-icons": {
    fontSize: pxToRem(15),
    marginTop: pxToRem(-2),
  },
};
export default root;
