/**
 * SHARED JEST SETUP FILE
 * Copy this file to: chargeUp-frontend/jest.setup.js
 * Referenced by jest.config.js — runs before every frontend test
 */

import "@testing-library/jest-native/extend-expect";

// ─── Mock AsyncStorage ──────────────────────────────────────────────────────
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(null),
    clear: jest.fn().mockResolvedValue(null),
    getAllKeys: jest.fn().mockResolvedValue([]),
    multiGet: jest.fn().mockResolvedValue([]),
    multiSet: jest.fn().mockResolvedValue(null),
  },
}));

// ─── Mock expo-font ──────────────────────────────────────────────────────────
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