export const startMockWorker = async () => {
	if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS !== "true") return;
	const { worker } = await import("./browser");
	await worker.start({ onUnhandledRequest: "bypass" });
	console.info("Mock Service Worker enabled");
};
