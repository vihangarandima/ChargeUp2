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