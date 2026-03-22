/**
 * FRONTEND JEST CONFIG
 * Copy this file to: chargeUp-frontend/jest.config.js
 * Works on Windows, Mac and Linux
 *
 * Also add this to chargeUp-frontend/package.json scripts:
 *   "test": "jest"
 *
 * Install test dependencies first:
 *   npm install --save-dev jest jest-expo @testing-library/react-native @testing-library/jest-native
 */

module.exports = {
  preset: "jest-expo",
  roots: ["<rootDir>", "<rootDir>/../test cases/frontend"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/../test cases/frontend/**/*.test.tsx", "<rootDir>/../test cases/frontend/**/*.test.ts"],
  setupFilesAfterFramework: ["./jest.setup.js"],
  forceExit: true,
  clearMocks: true,
  testTimeout: 30000,
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-webview|md5)",
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
};
