/**
 * PAYMENT SCREEN TESTS — app/(client)/payment.tsx
 *
 * Covers:
 *   - Screen renders amount and Confirm & Pay button
 *   - Confirm & Pay opens the PayHere WebView modal
 *   - Success redirect calls /api/complete-charging-session
 *   - Request body contains totalAmount, hostId and status paid
 *   - Navigates to /payment-success after backend call completes
 *   - Does not crash when backend call fails with a network error
 *
 * Compatible: Windows, Mac, Linux
 *
 * Run from chargeUp-frontend/:
 *   npm test
 */

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockReplace = jest.fn();
const mockBack    = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, back: mockBack }),
  useLocalSearchParams: () => ({
    amount:    "200.00",
    sessionId: "SESSION_12345",
    date:      "2025-01-01",
    time:      "10:00",
    duration:  "30",
    chargerId: "HOST_ABC123",
  }),
  Stack: { Screen: () => null },
}));

jest.mock("react-native-webview", () => {
  const { View, TouchableOpacity } = require("react-native");
  return {
    WebView: ({ onNavigationStateChange }: any) => (
      <View testID="webview">
        <TouchableOpacity
          testID="simulate-success"
          onPress={() =>
            onNavigationStateChange?.({ url: "http://chargeup.local/success" })
          }
        />
        <TouchableOpacity
          testID="simulate-cancel"
          onPress={() =>
            onNavigationStateChange?.({ url: "http://chargeup.local/cancel" })
          }
        />
      </View>
    ),
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

jest.mock("md5", () => (str: string) => `mock_hash_${str.length}`);

// ─── Component ───────────────────────────────────────────────────────────────
import PaymentPage from "../../../chargeUp-frontend/app/(client)/payment";

// ─── Helper ──────────────────────────────────────────────────────────────────
function mockFetch(status = 200, body: object = { success: true }) {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch();
});

// ═══════════════════════════════════════════════════════════════════════════
describe("PaymentPage — rendering", () => {
  test("renders the amount passed via route params", () => {
    const { getByText } = render(<PaymentPage />);
    expect(getByText(/200\.00/)).toBeTruthy();
  });

  test("renders the Confirm and Pay button", () => {
    const { getByText } = render(<PaymentPage />);
    expect(getByText(/Confirm & Pay/i)).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("PaymentPage — PayHere modal", () => {
  test("shows the WebView modal when Confirm and Pay is pressed", async () => {
    const { getByText, getByTestId } = render(<PaymentPage />);
    fireEvent.press(getByText(/Confirm & Pay/i));

    await waitFor(() => {
      expect(getByTestId("webview")).toBeTruthy();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("PaymentPage — payment success flow", () => {
  test("calls /api/complete-charging-session when redirected to success URL", async () => {
    const { getByText, getByTestId } = render(<PaymentPage />);
    fireEvent.press(getByText(/Confirm & Pay/i));
    await waitFor(() => getByTestId("webview"));

    await act(async () => {
      fireEvent.press(getByTestId("simulate-success"));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/complete-charging-session"),
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  test("sends totalAmount of 200.00 in the request body", async () => {
    const { getByText, getByTestId } = render(<PaymentPage />);
    fireEvent.press(getByText(/Confirm & Pay/i));
    await waitFor(() => getByTestId("webview"));

    await act(async () => {
      fireEvent.press(getByTestId("simulate-success"));
    });

    await waitFor(() => {
      const [, options] = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.totalAmount).toBe("200.00");
    });
  });

  test("sends chargerId as hostId in the request body", async () => {
    const { getByText, getByTestId } = render(<PaymentPage />);
    fireEvent.press(getByText(/Confirm & Pay/i));
    await waitFor(() => getByTestId("webview"));

    await act(async () => {
      fireEvent.press(getByTestId("simulate-success"));
    });

    await waitFor(() => {
      const [, options] = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.hostId).toBe("HOST_ABC123");
    });
  });

  test("sends status paid in the request body", async () => {
    const { getByText, getByTestId } = render(<PaymentPage />);
    fireEvent.press(getByText(/Confirm & Pay/i));
    await waitFor(() => getByTestId("webview"));

    await act(async () => {
      fireEvent.press(getByTestId("simulate-success"));
    });

    await waitFor(() => {
      const [, options] = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.status).toBe("paid");
    });
  });

  test("navigates to payment-success after the backend call completes", async () => {
    const { getByText, getByTestId } = render(<PaymentPage />);
    fireEvent.press(getByText(/Confirm & Pay/i));
    await waitFor(() => getByTestId("webview"));

    await act(async () => {
      fireEvent.press(getByTestId("simulate-success"));
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining("payment-success"),
      );
    });
  });

  test("does not crash when the backend call fails with a network error", async () => {
    (global as any).fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const { getByText, getByTestId } = render(<PaymentPage />);
    fireEvent.press(getByText(/Confirm & Pay/i));
    await waitFor(() => getByTestId("webview"));

    await expect(
      act(async () => {
        fireEvent.press(getByTestId("simulate-success"));
      }),
    ).resolves.not.toThrow();
  });
});
