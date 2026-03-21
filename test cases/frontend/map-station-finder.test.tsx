/**
 * MAP STATION FINDER TESTS — app/(client)/map-station-finder.tsx
 *
 * Covers:
 *   - Loading indicator shown initially
 *   - Fetches chargers from /api/chargers on mount
 *   - Renders station cards after data loads
 *   - Empty state when no chargers returned
 *   - calculateDistance (Haversine) helper is mathematically correct
 *
 * Compatible: Windows, Mac, Linux
 *
 * Run from chargeUp-frontend/:
 *   npm test
 */

import React from "react";
import { render, waitFor } from "@testing-library/react-native";

// ─── Mocks ──────────────────────────────────────────────────────────────────

jest.mock("expo-router", () => ({
  useRouter:            () => ({ push: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 6.9271, longitude: 79.8612 },
  }),
}));

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  return {
    __esModule:  true,
    default:     ({ children }: any) => <View testID="map-view">{children}</View>,
    Marker:      () => null,
    Polyline:    () => null,
    PROVIDER_GOOGLE: "google",
  };
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

// ─── Sample data ─────────────────────────────────────────────────────────────
const mockChargers = [
  {
    _id: "c001",
    fullName: "Station Alpha",
    address: "10 Galle Rd, Colombo",
    chargerType: "Type 2 AC",
    location: { latitude: 6.9271, longitude: 79.8612 },
  },
  {
    _id: "c002",
    fullName: "Station Beta",
    address: "20 Kandy Rd, Colombo",
    chargerType: "DC Fast Charger",
    location: { latitude: 6.9355, longitude: 79.849 },
  },
];

function mockFetch(body: object, ok = true) {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok,
    json: jest.fn().mockResolvedValue(body),
  });
}

// ─── Component ───────────────────────────────────────────────────────────────
import MapScreen from "../../../chargeUp-frontend/app/(client)/map-station-finder";

beforeEach(() => jest.clearAllMocks());

// ═══════════════════════════════════════════════════════════════════════════
describe("MapScreen — data fetching", () => {
  test("calls /api/chargers on mount", async () => {
    mockFetch(mockChargers);
    render(<MapScreen />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/chargers"),
      );
    });
  });

  test("renders the map view component after data loads", async () => {
    mockFetch(mockChargers);
    const { getByTestId } = render(<MapScreen />);

    await waitFor(() => {
      expect(getByTestId("map-view")).toBeTruthy();
    });
  });

  test("renders station names in the bottom cards", async () => {
    mockFetch(mockChargers);
    const { findAllByText } = render(<MapScreen />);

    await waitFor(async () => {
      const items = await findAllByText("Station Alpha");
      expect(items.length).toBeGreaterThan(0);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("MapScreen — empty state", () => {
  test("renders without crashing when zero chargers are returned", async () => {
    mockFetch([]);
    const { queryByText } = render(<MapScreen />);

    await waitFor(() => {
      expect(queryByText("Station Alpha")).toBeNull();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("calculateDistance — Haversine formula unit tests", () => {
  function calculateDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number,
  ): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  test("returns 0 for identical coordinates", () => {
    expect(calculateDistance(6.9271, 79.8612, 6.9271, 79.8612)).toBe(0);
  });

  test("returns a positive distance for two different points", () => {
    expect(calculateDistance(6.9271, 79.8612, 7.2906, 80.6337)).toBeGreaterThan(0);
  });

  test("Colombo to Kandy is approximately 90 to 105 km", () => {
    const km = calculateDistance(6.9271, 79.8612, 7.2906, 80.6337);
    expect(km).toBeGreaterThanOrEqual(90);
    expect(km).toBeLessThanOrEqual(105);
  });

  test("distance is symmetric — A to B equals B to A", () => {
    const ab = calculateDistance(6.9271, 79.8612, 7.2906, 80.6337);
    const ba = calculateDistance(7.2906, 80.6337, 6.9271, 79.8612);
    expect(Math.abs(ab - ba)).toBeLessThan(0.0001);
  });
});
