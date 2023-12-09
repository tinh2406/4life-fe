// /* eslint-disable */
// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
// 	preset: "ts-jest",
// 	testEnvironment: "jsdom",
// 	globals: {
// 		"ts-jest": {
// 			tsconfig: "tsconfig.jest.json"
// 		}
// 	},
// 	modulePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/", "<rootDir>/src/assets"],
// 	// moduleNameMapper: {
// 	// 	"\\.(png|jpg|jpeg|gif|svg)$": "./src/fileMock.ts"
// 	// },
// 	setupFilesAfterEnv: ["./src/jest.setup.ts"]
// };

// eslint-disable-next-line no-undef
module.exports = {
	preset: "ts-jest",
	verbose: true,
	testEnvironment: "jsdom",
	collectCoverageFrom: [
		"<rootDir>/src/**/*.{ts,tsx}",
		"!<rootDir>/src/**/*.stories.{js,jsx,ts,tsx}",
		"!<rootDir>/src/**/index.{js,jsx,ts,tsx}",
		"!<rootDir>/src/assets/*.{ts,tsx}"
	],
	modulePaths: ["<rootDir>/src"],
	moduleNameMapper: {
		"\\.(css|less)$": "<rootDir>/test/styleMock.ts",
		"@src/(.*)": "<rootDir>/src/$1",
		"@test/(.*)": "<rootDir>/test/$1",
		"^.+\\.module\\.scss$": "identity-obj-proxy"
	},
	modulePathIgnorePatterns: [
		"<rootDir>/node_modules/",
		"<rootDir>/dist/",
		"<rootDir>/src/assets",
		"^.+\\.module\\.scss$"
	],

	setupFilesAfterEnv: ["./src/jest.setup.ts"],
	testMatch: ["<rootDir>/test/**/*.test.[jt]s?(x)", "<rootDir>/?(*.)+(spec|test).[jt]s?(x)"],
	transform: {
		"\\.(jpg|jpeg|png|eot|otf|webp|svg|ttf|woff|woff2|webm)$": "jest-transform-stub"
	},
	transformIgnorePatterns: ["<rootDir>/node_modules/"]
};
