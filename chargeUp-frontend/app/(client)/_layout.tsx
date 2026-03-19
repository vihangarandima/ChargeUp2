import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View, StyleSheet } from "react-native";

// ── Custom Tab Icon with active indicator dot ──────────────────────────────
function TabIcon({ name, color, focused }: { name: any; color: string; focused: boolean }) {
  return (
    <View style={styles.iconWrapper}>
      {focused && <View style={styles.activePill} />}
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFFFFF",        // White for active icon
        tabBarInactiveTintColor: "#888888",      // Grey for inactive icon

        tabBarStyle: {
          // ── Background ──
          backgroundColor: "#0B2F3A",

          // 🌟 NEW: Full White Border (Top, Left, Right to outline the curves)
          borderColor: "#FFFFFF",
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,

          // ── Shape ──
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden', // Ensures nothing clips outside the border

          // ── Size ──
          height: Platform.OS === "ios" ? 80 : 65,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,

          // ── Position ──
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,

          // ── Shadow (iOS) ──
          shadowColor: "#FFFFFF",
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },

          // ── Elevation (Android) ──
          elevation: 20,
        },
      }}
    >

      {/* ── HOME ── */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />

      {/* ── MAP ── */}
      <Tabs.Screen
        name="map-station-finder"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="map" color={color} focused={focused} />
          ),
        }}
      />

      {/* ── QR SCAN ── */}
      <Tabs.Screen
        name="scan-qr"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="qr-code" color={color} focused={focused} />
          ),
        }}
      />

      {/* ── PROFILE ── */}
      <Tabs.Screen
        name="client-profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} focused={focused} />
          ),
        }}
      />

      {/* ── HIDDEN PAGES ── */}
      <Tabs.Screen name="station-details"       options={{ href: null }} />
      <Tabs.Screen name="booking-confirmation"  options={{ href: null }} />
      <Tabs.Screen name="charger-booking"       options={{ href: null }} />
      <Tabs.Screen name="payment-success"       options={{ href: null }} />
      <Tabs.Screen name="payment"               options={{ href: null }} />
      <Tabs.Screen name="charging-session"      options={{ href: null }} />

    </Tabs>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // Wrapper around each icon
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 40,
  },

  // White pill indicator above active icon
  activePill: {
    position: "absolute",
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },

});