import { ReactNode } from "react";
import "./GlobalStyles.scss";

const GlobalStyles = ({ children }: { children: ReactNode }): JSX.Element => {
	return <>{children}</>;
};

export default GlobalStyles;
