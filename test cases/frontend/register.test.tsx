/**
 * REGISTER SCREEN TESTS — app/(auth)/register.tsx
 *
 * Covers:
 *   - Screen renders correctly
 *   - Validation: empty fields
 *   - Successful registration routes client to /vehicle-details
 *   - Successful registration routes host to /host-charger-details
 *   - Duplicate email shows server error alert
 *   - Network error shows connection alert
 *
 * Compatible: Windows, Mac, Linux
 *
 * Run from chargeUp-frontend/:
 *   npm test
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockReplace = jest.fn();
const mockPush    = jest.fn();
const mockGetItem = jest.fn();
const mockSetItem = jest.fn().mockResolvedValue(null);

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: mockGetItem,
  setItem: mockSetItem,
}));

jest.mock("../../../chargeUp-frontend/app/Config/firebaseConfig", () => ({
  auth: {},
}));

jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: { credential: jest.fn() },
  signInWithCredential: jest.fn(),
}));

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: () => [null, null, jest.fn()],
}));

jest.mock("expo-web-browser", () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: ({ children }: any) => <View>{children}</View> };
});

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children }: any) => <View>{children}</View>,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock("@expo/vector-icons", () => ({
  Ionicons:     () => null,
  FontAwesome5: () => null,
}));

// ─── Component ───────────────────────────────────────────────────────────────
import RegisterScreen from "../../../chargeUp-frontend/app/(auth)/register";

// ─── Helper ──────────────────────────────────────────────────────────────────
function mockFetch(status: number, body: object) {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
});

// ═══════════════════════════════════════════════════════════════════════════
describe("RegisterScreen — rendering", () => {
  test("renders the Create Account button", () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText("Create Account")).toBeTruthy();
  });

  test("renders Full Name input field", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    expect(getByPlaceholderText("Full Name")).toBeTruthy();
  });

  test("renders Email Address input field", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    expect(getByPlaceholderText("Email Address")).toBeTruthy();
  });

  test("renders Password input field", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    expect(getByPlaceholderText("Password")).toBeTruthy();
  });

  test("renders Sign In link for existing users", () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText(" Sign In →")).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("RegisterScreen — validation", () => {
  test("shows Missing Info alert when all fields are empty", async () => {
    const { getByText } = render(<RegisterScreen />);
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Missing Info", expect.any(String));
    });
  });

  test("shows Missing Info alert when only name is filled", async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText("Full Name"), "Sandali");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Missing Info", expect.any(String));
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("RegisterScreen — API integration", () => {
  test("calls fetch with correct endpoint and payload", async () => {
    mockGetItem.mockResolvedValue("client");
    mockFetch(201, { message: "User registered successfully!" });

    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText("Full Name"), "Sandali Test");
    fireEvent.changeText(getByPlaceholderText("Email Address"), "sandali@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "secure123");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/register"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("sandali@test.com"),
        }),
      );
    });
  });

  test("navigates to vehicle-details when role is client", async () => {
    mockGetItem.mockResolvedValue("client");
    mockFetch(201, { message: "User registered successfully!" });

    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText("Full Name"), "Client User");
    fireEvent.changeText(getByPlaceholderText("Email Address"), "client@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "secure123");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/vehicle-details");
    });
  });

  test("navigates to host-charger-details when role is host", async () => {
    mockGetItem.mockResolvedValue("host");
    mockFetch(201, { message: "User registered successfully!" });

    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText("Full Name"), "Host User");
    fireEvent.changeText(getByPlaceholderText("Email Address"), "host@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "secure123");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/host-charger-details");
    });
  });

  test("shows Signup Failed alert when server returns 400 for duplicate email", async () => {
    mockGetItem.mockResolvedValue("client");
    mockFetch(400, { message: "User already exists" });

    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText("Full Name"), "Dup User");
    fireEvent.changeText(getByPlaceholderText("Email Address"), "dup@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "secure123");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Signup Failed", "User already exists");
    });
  });

  test("shows Connection Error alert when fetch throws a network error", async () => {
    mockGetItem.mockResolvedValue("client");
    (global as any).fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText("Full Name"), "Offline User");
    fireEvent.changeText(getByPlaceholderText("Email Address"), "offline@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "secure123");
    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Connection Error", expect.any(String));
    });
  });
});
