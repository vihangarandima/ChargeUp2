const path = require("path");

module.exports = {
  preset: "jest-expo",
  roots: [
    path.resolve(__dirname),
    path.resolve(__dirname, "../test cases/frontend")
  ],
  testEnvironment: "node",
  testMatch: [
    "**/test cases/frontend/**/*.test.tsx",
    "**/test cases/frontend/**/*.test.ts"
  ],
  setupFilesAfterEnv: [path.resolve(__dirname, "jest.setup.js")],
  moduleDirectories: [
    "node_modules",
    path.resolve(__dirname, "node_modules")
  ],
  moduleNameMapper: {
    // Redirect ../../../chargeUp-frontend/... → the actual project root
    "^\\.\\./\\.\\./\\.\\./chargeUp-frontend/(.*)$": path.resolve(__dirname, "$1"),
    // Existing mappers
    "^expo-router$": path.resolve(__dirname, "node_modules/expo-router"),
    "\\.(jpg|jpeg|png|gif|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      path.resolve(__dirname, "__mocks__/fileMock.js"),
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-webview|md5)",
  ],
  forceExit: true,
  clearMocks: true,
  testTimeout: 30000,
};