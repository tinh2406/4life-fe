import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import GlobalStyles from "./components/GlobalStyles/GlobalStyles";
import { StyledEngineProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
//import store from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { clientID } from "./utils/get-client-id.ts";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotifyProvider } from "./context/notify.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./assets/theme";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<GoogleOAuthProvider clientId={clientID}>
					<PersistGate loading={null} persistor={persistor}>
						<StyledEngineProvider injectFirst>
							<GlobalStyles>
								<QueryClientProvider client={queryClient}>
									<NotifyProvider>
										<App />
									</NotifyProvider>
									<ToastContainer />
								</QueryClientProvider>
							</GlobalStyles>
						</StyledEngineProvider>
					</PersistGate>
				</GoogleOAuthProvider>
			</ThemeProvider>
		</Provider>
	</React.StrictMode>
);
