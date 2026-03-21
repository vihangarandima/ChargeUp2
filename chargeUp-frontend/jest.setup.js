/**
 * SHARED JEST SETUP FILE
 * Copy this file to: chargeUp-frontend/jest.setup.js
 * Referenced by jest.config.js — runs before every frontend test
 */

import "@testing-library/jest-native/extend-expect";

// ─── Mock AsyncStorage ──────────────────────────────────────────────────────
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// ─── Mock React Native Animated (avoids NativeAnimatedHelper crash on Windows)
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// ─── Mock expo-font (avoids font loading crash on Windows) ──────────────────
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
  isLoading: jest.fn(() => false),
}));

// ─── Mock expo-asset ────────────────────────────────────────────────────────
jest.mock("expo-asset", () => ({
  Asset: {
    loadAsync: jest.fn(),
    fromModule: jest.fn(() => ({ uri: "mock-asset-uri" })),
  },
}));

// ─── Mock expo-constants ────────────────────────────────────────────────────
jest.mock("expo-constants", () => ({
  default: { expoConfig: { name: "ChargeUp", slug: "chargeup" } },
}));

// ─── Silence noisy console.error in tests ───────────────────────────────────
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning:") || args[0].includes("act("))
    ) {
      return;
    }
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
