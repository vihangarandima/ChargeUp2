import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Platform,
  View,
  StyleSheet,
  Pressable,
  Animated,
  Alert,
  Text,
} from "react-native";
import { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ── Regular Tab Icon ──────────────────────────────────────────────────────────
function TabIcon({
  name,
  focused,
}: {
  name: any;
  focused: boolean;
}) {
  return (
    <View style={styles.iconWrapper}>
      {focused && <View style={styles.activeDot} />}
      <Ionicons name={name} size={22} color={focused ? "#5ECFDA" : "#556570"} />
    </View>
  );
}

// ── Center Switch Role Button ─────────────────────────────────────────────────
function SwitchRoleButton({ focused }: { focused: boolean }) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  // Start glow loop
  Animated.loop(
    Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0.6, duration: 1400, useNativeDriver: true }),
    ])
  ).start();

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.88, useNativeDriver: true, speed: 60 }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  const handleSwitchRole = () => {
    Alert.alert(
      "Switch Role",
      "Switch to Host mode to manage your charger listings?",
      [
        { text: "Stay as Driver", style: "cancel" },
        {
          text: "Switch to Host ⚡",
          onPress: async () => {
            await AsyncStorage.setItem("userRole", "host");
            router.replace("/(host)/host-home");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.switchWrapper}>
      {/* Outer animated glow ring */}
      <Animated.View style={[styles.switchGlowRing, { opacity: glowAnim }]} />

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={handleSwitchRole}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.switchPressable}
        >
          <LinearGradient
            colors={["#3ABFCC", "#1A9BAA", "#0E7080"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.switchBtn}
          >
            <Ionicons name="swap-horizontal" size={22} color="white" />
          </LinearGradient>
          {/* Label below */}
          <Text style={styles.switchLabel}>Switch</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#5ECFDA",
        tabBarInactiveTintColor: "#556570",

        tabBarStyle: {
          // Shape
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          overflow: "hidden",

          // Background
          backgroundColor: "rgba(10,24,32,0.98)",

          // Borders
          borderTopWidth: 1,
          borderTopColor: "rgba(94,207,218,0.2)",
          borderLeftWidth: 1,
          borderLeftColor: "rgba(94,207,218,0.1)",
          borderRightWidth: 1,
          borderRightColor: "rgba(94,207,218,0.1)",

          // Size — taller to give the center button room to float
          height: Platform.OS === "ios" ? 90 : 72,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 10,

          // Position
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,

          // Shadow
          shadowColor: "#5ECFDA",
          shadowOpacity: 0.18,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: -4 },
          elevation: 26,
        },
      }}
    >
      {/* ── 1. HOME ── */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" focused={focused} />
          ),
        }}
      />

      {/* ── 2. MAP ── */}
      <Tabs.Screen
        name="map-station-finder"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="map-outline" focused={focused} />
          ),
        }}
      />

      {/* ── 3. SWITCH ROLE — bold center button ── */}
      <Tabs.Screen
        name="scan-qr"
        options={{
          tabBarIcon: ({ focused }) => (
            <SwitchRoleButton focused={focused} />
          ),
        }}
      />

      {/* ── 4. QR SCAN ── */}
      <Tabs.Screen
        name="scan-qr-screen"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="qr-code-outline" focused={focused} />
          ),
        }}
      />

      {/* ── 5. PROFILE ── */}
      <Tabs.Screen
        name="client-profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person-outline" focused={focused} />
          ),
        }}
      />

      {/* ── HIDDEN PAGES ── */}
      <Tabs.Screen name="station-details"      options={{ href: null }} />
      <Tabs.Screen name="booking-confirmation" options={{ href: null }} />
      <Tabs.Screen name="charger-booking"      options={{ href: null }} />
      <Tabs.Screen name="payment-success"      options={{ href: null }} />
      <Tabs.Screen name="payment"              options={{ href: null }} />
      <Tabs.Screen name="charging-session"     options={{ href: null }} />
    </Tabs>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // Regular icon slot
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 40,
  },
  activeDot: {
    position: "absolute",
    top: 0,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#5ECFDA",
    shadowColor: "#5ECFDA",
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },

  // Switch role button — floats above the bar
  switchWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -32,
    width: 72,
    height: 72,
  },
  switchGlowRing: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: "#5ECFDA",
    backgroundColor: "transparent",
    shadowColor: "#5ECFDA",
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  switchPressable: {
    alignItems: "center",
  },
  switchBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#5ECFDA",
    shadowOpacity: 0.7,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 14,
  },
  switchLabel: {
    color: "#5ECFDA",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 4,
  },
});