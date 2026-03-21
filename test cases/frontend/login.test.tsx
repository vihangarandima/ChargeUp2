/**
 * LOGIN SCREEN TESTS — app/(auth)/login.tsx
 *
 * Covers:
 *   - Screen renders correctly
 *   - Validation: empty fields, invalid email, short password
 *   - Successful login routes client to /home and host to /(host)/host-home
 *   - Failed login shows error message
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

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
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

jest.mock("expo-status-bar", () => ({ StatusBar: () => null }));

// ─── Component ───────────────────────────────────────────────────────────────
import LoginScreen from "../../../chargeUp-frontend/app/(auth)/login";

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
describe("LoginScreen — rendering", () => {
  test("renders the Sign In button", () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText("Sign In")).toBeTruthy();
  });

  test("renders Email Address input field", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText("Email Address")).toBeTruthy();
  });

  test("renders Password input field", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText("Password")).toBeTruthy();
  });

  test("renders Sign Up link for new users", () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText(" Sign Up →")).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("LoginScreen — validation", () => {
  test("shows Missing Info alert when both fields are empty", async () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Missing Info", expect.any(String));
    });
  });

  test("shows Invalid Email alert when email format is wrong", async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText("Email Address"), "not-an-email");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Invalid Email", expect.any(String));
    });
  });

  test("shows Weak Password alert when password is fewer than 6 characters", async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText("Email Address"), "user@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "abc");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Weak Password", expect.any(String));
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("LoginScreen — API integration", () => {
  test("calls fetch with correct endpoint and credentials", async () => {
    mockFetch(200, {
      message: "Login successful!",
      user: { id: "abc123", name: "Sandali", email: "sandali@test.com", role: "client" },
    });
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText("Email Address"), "sandali@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "pass1234");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/login"),
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  test("navigates to /home when role is client", async () => {
    mockFetch(200, {
      user: { id: "abc123", name: "Sandali", email: "sandali@test.com", role: "client" },
    });
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText("Email Address"), "sandali@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "pass1234");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/home");
    });
  });

  test("navigates to host-home when role is host", async () => {
    mockFetch(200, {
      user: { id: "host999", name: "Host User", email: "host@test.com", role: "host" },
    });
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText("Email Address"), "host@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "pass1234");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/(host)/host-home");
    });
  });

  test("shows Login Failed alert on 400 response", async () => {
    mockFetch(400, { message: "Wrong password! Try again." });
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText("Email Address"), "sandali@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrongpass");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Login Failed", "Wrong password! Try again.");
    });
  });

  test("shows Connection Error alert when fetch throws a network error", async () => {
    (global as any).fetch = jest.fn().mockRejectedValue(new Error("Network error"));
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText("Email Address"), "sandali@test.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "pass1234");
    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Connection Error", expect.any(String));
    });
  });
});
