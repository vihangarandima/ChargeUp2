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

// ── SVG Notched Background — gold theme ──────────────────────────────────────
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
        stroke="rgba(255,200,80,0.3)"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

// ── Tab Icon ──────────────────────────────────────────────────────────────────
function TabIcon({ name, focused }: { name: any; focused: boolean }) {
  return (
    <View style={styles.iconWrapper}>
      {focused && <View style={styles.activeDot} />}
      <Ionicons name={name} size={24} color={focused ? "#FFC850" : "#556570"} />
    </View>
  );
}

// ── Custom Tab Bar ────────────────────────────────────────────────────────────
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  Animated.loop(
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.6,
        duration: 1400,
        useNativeDriver: true,
      }),
    ]),
  ).start();

  const pressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 60,
    }).start();
  const pressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
    }).start();

  const handleSwitchRole = () => {
    Alert.alert(
      "Switch to Driver Mode",
      "Switch back to EV Owner mode to find and book charging stations?",
      [
        { text: "Stay as Host", style: "cancel" },
        {
          text: "Switch to Driver ⚡",
          onPress: async () => {
            await AsyncStorage.setItem("userRole", "client");
            router.replace("/home");
          },
        },
      ],
    );
  };

  // 2 left tabs + 2 right tabs = 4 tabs total, switch button in the middle
  const leftTabs = [
    { name: "host-home", icon: "home-outline" },
    { name: "host-charger-details", icon: "flash-outline" },
  ];
  const rightTabs = [
    { name: "manage-charger", icon: "battery-charging-outline" },
    { name: "host-profile", icon: "person-outline" },
  ];

  return (
    <View style={styles.container}>
      {/* ── Floating Switch Button ── */}
      <View style={styles.floatingBtnWrapper}>
        <View style={styles.btnBackdrop} />

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            onPress={handleSwitchRole}
            onPressIn={pressIn}
            onPressOut={pressOut}
            style={styles.switchPressable}
          >
            <LinearGradient
              colors={["#D4A017", "#FFC850", "#C8860A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.switchBtn}
            >
              <Ionicons name="swap-horizontal" size={26} color="#3A2000" />
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Text style={styles.switchLabel}>Switch</Text>
      </View>

      {/* ── Notched Bar ── */}
      <View style={styles.navBar}>
        <NotchedBackground />

        {/* Left: Home, Add Charger */}
        {leftTabs.map((tab) => {
          const index = state.routes.findIndex((r) => r.name === tab.name);
          const focused = state.index === index;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabBtn}
              onPress={() => navigation.navigate(tab.name)}
              activeOpacity={0.7}
            >
              <TabIcon name={tab.icon} focused={focused} />
            </TouchableOpacity>
          );
        })}

        {/* Center gap for the floating button */}
        <View style={styles.centerGap} />

        {/* Right: Manage, Profile */}
        {rightTabs.map((tab) => {
          const index = state.routes.findIndex((r) => r.name === tab.name);
          const focused = state.index === index;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabBtn}
              onPress={() => navigation.navigate(tab.name)}
              activeOpacity={0.7}
            >
              <TabIcon name={tab.icon} focused={focused} />
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
      {/* 4 visible host tabs */}
      <Tabs.Screen name="host-home" />
      <Tabs.Screen name="host-charger-details" />
      <Tabs.Screen name="manage-charger" />
      <Tabs.Screen name="host-profile" />

      {/* Hidden pages */}
      <Tabs.Screen name="location-picker" options={{ href: null }} />
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

  // Floating switch button
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
    shadowColor: "#FFC850",
    shadowOpacity: 0.8,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 20,
  },
  switchLabel: {
    color: "#FFC850",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 4,
  },

  // Nav bar
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
    backgroundColor: "#FFC850",
    shadowColor: "#FFC850",
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
