module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/__tests__/setup.ts",
    "<rootDir>/__tests__/fixtures/",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  collectCoverageFrom: [
    "services/api.ts",
    "services/storage.ts",
    "context/AuthContext.tsx",
    "services/ClientServices.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json-summary"],
};
