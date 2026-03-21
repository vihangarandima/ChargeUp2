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
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 90 : 72;
const NOTCH_RADIUS = 38;
const NOTCH_WIDTH = 88;

// ── SVG Notched Background ────────────────────────────────────────────────────
function NotchedBackground() {
  const h = TAB_BAR_HEIGHT;
  const w = width;
  const cx = w / 2;
  const nr = NOTCH_RADIUS;
  const nw = NOTCH_WIDTH;

  const path = `
    M 30 0
    L ${cx - nw / 2} 0
    Q ${cx - nw / 2 + 6} 0 ${cx - nw / 2 + 10} ${8}
    A ${nr} ${nr} 0 0 0 ${cx + nw / 2 - 10} ${8}
    Q ${cx + nw / 2 - 6} 0 ${cx + nw / 2} 0
    L ${w - 30} 0
    Q ${w} 0 ${w} 30
    L ${w} ${h}
    L 0 ${h}
    L 0 30
    Q 0 0 30 0
    Z
  `;

  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
      <Path
        d={path}
        fill="rgba(10,24,32,0.98)"
        stroke="rgba(94,207,218,0.25)"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

// ── Regular Tab Icon ──────────────────────────────────────────────────────────
function TabIcon({ name, focused }: { name: any; focused: boolean }) {
  return (
    <View style={styles.iconWrapper}>
      {focused && <View style={styles.activeDot} />}
      <Ionicons name={name} size={22} color={focused ? "#5ECFDA" : "#556570"} />
    </View>
  );
}

// ── Custom Tab Bar ────────────────────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

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

  // ✅ FIXED: "scan-qr" matches the actual registered route name
  const iconMap: Record<string, string> = {
    "home": "home-outline",
    "map-station-finder": "map-outline",
    "scan-qr": "qr-code-outline",       // ✅ was "scan-qr-screen" — now matches Tabs.Screen name
    "client-profile": "person-outline",
  };

  const leftTabs = ["home", "map-station-finder"];
  const rightTabs = ["scan-qr", "client-profile"];   // ✅ was "scan-qr-screen"

  return (
    <View style={styles.container}>

      {/* ── Floating Switch Button ── */}
      <View style={styles.floatingBtnWrapper}>
        <View style={styles.btnBackdrop} />

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
              <Ionicons name="swap-horizontal" size={26} color="white" />
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Text style={styles.switchLabel}>Switch</Text>
      </View>

      {/* ── Notched Bar ── */}
      <View style={styles.navBar}>
        <NotchedBackground />

        {/* Left tabs: Home, Map */}
        {leftTabs.map((routeName) => {
          const index = state.routes.findIndex((r) => r.name === routeName);
          const focused = state.index === index;
          return (
            <TouchableOpacity
              key={routeName}
              style={styles.tabBtn}
              onPress={() => navigation.navigate(routeName)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                {focused && <View style={styles.activeDot} />}
                <Ionicons
                  name={iconMap[routeName] as any}
                  size={22}
                  color={focused ? "#5ECFDA" : "#556570"}
                />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Center gap — space for the floating switch button */}
        <View style={styles.centerGap} />

        {/* Right tabs: QR Scan, Profile */}
        {rightTabs.map((routeName) => {
          const index = state.routes.findIndex((r) => r.name === routeName);
          const focused = state.index === index;
          return (
            <TouchableOpacity
              key={routeName}
              style={styles.tabBtn}
              onPress={() => navigation.navigate(routeName)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                {focused && <View style={styles.activeDot} />}
                <Ionicons
                  name={iconMap[routeName] as any}
                  size={22}
                  color={focused ? "#5ECFDA" : "#556570"}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="map-station-finder" />
      <Tabs.Screen name="scan-qr" />          {/* ✅ this is the real QR screen file */}
      <Tabs.Screen name="client-profile" />

      {/* Hidden pages */}
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
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT + 36,
    alignItems: "center",
    overflow: "visible",
  },

  floatingBtnWrapper: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    alignItems: "center",
    zIndex: 10,
  },
  btnBackdrop: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#0D1F23",
  },
  switchPressable: {
    alignItems: "center",
  },
  switchBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#5ECFDA",
    shadowOpacity: 0.8,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 20,
  },
  switchLabel: {
    color: "#5ECFDA",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 4,
  },

  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 20 : 6,
    paddingTop: 10,
    overflow: "visible",
  },

  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  centerGap: {
    width: NOTCH_WIDTH + 10,
  },

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
});