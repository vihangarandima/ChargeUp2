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

   // Draw a rounded rect with a smooth circular notch cut out at the top center
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
      <Svg
        width={w}
        height={h}
        style={StyleSheet.absoluteFill}
      >
        {/* Shadow layer */}
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