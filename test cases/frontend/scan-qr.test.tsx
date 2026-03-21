/**
 * SCAN QR SCREEN TESTS — app/(client)/scan-qr.tsx
 *
 * Covers:
 *   - Screen renders main title and buttons
 *   - QUICK CONNECT navigates to /charging-session with id latest
 *   - Valid CHARGEUP_ QR code navigates to charging-session with correct id
 *   - CHARGEUP_LATEST resolves to id latest
 *   - Invalid QR code shows Invalid Charger alert
 *   - Invalid QR code does not navigate
 *
 * Compatible: Windows, Mac, Linux
 *
 * Run from chargeUp-frontend/:
 *   npm test
 */

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Alert } from "react-native";

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockReplace = jest.fn();
const mockBack    = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack }),
}));

const mockRequestPermission = jest.fn().mockResolvedValue({ granted: true });

jest.mock("expo-camera", () => {
  const { View, TouchableOpacity } = require("react-native");
  return {
    CameraView: ({ children, onBarcodeScanned }: any) => (
      <View testID="camera-view">
        {children}
        <TouchableOpacity
          testID="trigger-valid-scan"
          onPress={() =>
            onBarcodeScanned?.({ data: "CHARGEUP_6634abc123def456abc789ab" })
          }
        />
        <TouchableOpacity
          testID="trigger-invalid-scan"
          onPress={() => onBarcodeScanned?.({ data: "RANDOM_INVALID_CODE" })}
        />
        <TouchableOpacity
          testID="trigger-latest-scan"
          onPress={() => onBarcodeScanned?.({ data: "CHARGEUP_LATEST" })}
        />
      </View>
    ),
    useCameraPermissions: () => [{ granted: true }, mockRequestPermission],
  };
});

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: ({ children }: any) => <View>{children}</View> };
});

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children }: any) => <View>{children}</View>,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// ─── Component ───────────────────────────────────────────────────────────────
import ScanQRScreen from "../../../chargeUp-frontend/app/(client)/scan-qr";

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
});

// ═══════════════════════════════════════════════════════════════════════════
describe("ScanQRScreen — rendering", () => {
  test("renders the Ready to Charge title", () => {
    const { getByText } = render(<ScanQRScreen />);
    expect(getByText(/Ready to Charge/i)).toBeTruthy();
  });

  test("renders the QUICK CONNECT button", () => {
    const { getByText } = render(<ScanQRScreen />);
    expect(getByText("QUICK CONNECT")).toBeTruthy();
  });

  test("renders the START SCANNING button", () => {
    const { getByText } = render(<ScanQRScreen />);
    expect(getByText(/START SCANNING/i)).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("ScanQRScreen — QUICK CONNECT", () => {
  test("navigates to charging-session with chargerId latest when pressed", () => {
    const { getByText } = render(<ScanQRScreen />);
    fireEvent.press(getByText("QUICK CONNECT"));

    expect(mockReplace).toHaveBeenCalledWith({
      pathname: "/charging-session",
      params: { chargerId: "latest" },
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("ScanQRScreen — QR scanning", () => {
  test("navigates with the correct charger id on a valid CHARGEUP_ scan", async () => {
    const { getByText, getByTestId } = render(<ScanQRScreen />);
    fireEvent.press(getByText(/START SCANNING/i));

    await act(async () => {
      fireEvent.press(getByTestId("trigger-valid-scan"));
    });

    expect(mockReplace).toHaveBeenCalledWith({
      pathname: "/charging-session",
      params: { chargerId: "6634abc123def456abc789ab" },
    });
  });

  test("navigates with chargerId latest when QR data is CHARGEUP_LATEST", async () => {
    const { getByText, getByTestId } = render(<ScanQRScreen />);
    fireEvent.press(getByText(/START SCANNING/i));

    await act(async () => {
      fireEvent.press(getByTestId("trigger-latest-scan"));
    });

    expect(mockReplace).toHaveBeenCalledWith({
      pathname: "/charging-session",
      params: { chargerId: "latest" },
    });
  });

  test("shows Invalid Charger alert when QR code does not start with CHARGEUP_", async () => {
    const { getByText, getByTestId } = render(<ScanQRScreen />);
    fireEvent.press(getByText(/START SCANNING/i));

    await act(async () => {
      fireEvent.press(getByTestId("trigger-invalid-scan"));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Invalid Charger",
      expect.any(String),
      expect.any(Array),
      expect.any(Object),
    );
  });

  test("does not navigate when an invalid QR code is scanned", async () => {
    const { getByText, getByTestId } = render(<ScanQRScreen />);
    fireEvent.press(getByText(/START SCANNING/i));

    await act(async () => {
      fireEvent.press(getByTestId("trigger-invalid-scan"));
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
