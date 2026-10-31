export const startMockWorker = async () => {
	const shouldEnable = import.meta.env.DEV && (import.meta.env.VITE_ENABLE_MOCKS === "true" || import.meta.env.MODE === "mock");
	if (!shouldEnable) return;
	const { worker } = await import("./browser");
	await worker.start({ onUnhandledRequest: "bypass" });
	console.info("Mock Service Worker enabled");
}