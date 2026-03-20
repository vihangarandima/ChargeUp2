import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
  Pressable,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://10.146.186.178:5000";

export default function ProfileScreen() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const avatarScale = useRef(new Animated.Value(0.7)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 11, useNativeDriver: true }),
      Animated.spring(avatarScale, { toValue: 1, tension: 80, friction: 8, delay: 200, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Load cached name immediately so screen isn't empty
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) setUserName(storedName);

        const storedRole = await AsyncStorage.getItem("userRole");
        if (storedRole) setUserRole(storedRole);

        const token = await AsyncStorage.getItem("userToken");
        if (!token) { setIsLoading(false); return; }

        const response = await fetch(API_BASE + "/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.name || data.userName) setUserName(data.name || data.userName);
          if (data.email) setUserEmail(data.email);
          if (data.phone) setUserPhone(data.phone);
          if (data.role) setUserRole(data.role);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
  };

  const menuItems = [
    {
      label: "My Profile",
      icon: "person-outline" as const,
      desc: "Edit your personal info",
      onPress: () => {},
      color: "#5ECFDA",
    },
    {
      label: "My Vehicle",
      icon: "car-sport-outline" as const,
      desc: "Manage your EV details",
      onPress: () => {},
      color: "#5ECFDA",
    },
    {
      label: "Lending Details",
      icon: "flash-outline" as const,
      desc: "View your charger listings",
      onPress: () => {},
      color: "#FFC850",
    },
    {
      label: "History",
      icon: "time-outline" as const,
      desc: "Past sessions & payments",
      onPress: () => {},
      color: "#5ECFDA",
    },
    {
      label: "Log Out",
      icon: "log-out-outline" as const,
      desc: "Sign out of your account",
      onPress: handleLogout,
      color: "#FF6B6B",
      danger: true,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={["#101922", "#15252E", "#193038", "#1D3B42", "#0E4548"]}
        locations={[0.13, 0.35, 0.55, 0.74, 1.0]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.topAccent} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* ── TOP BAR ── */}
            <View style={styles.topBar}>
              <View style={styles.logoChip}>
                <Ionicons name="flash" size={13} color="#0E1F26" />
              </View>
              <Text style={styles.brandName}>ChargeUp</Text>
              <View style={styles.badgePill}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>EV Network</Text>
              </View>
            </View>

            {/* ── HERO PROFILE CARD ── */}
            <Animated.View style={[styles.heroCard, { transform: [{ scale: avatarScale }] }]}>
              <LinearGradient
                colors={["rgba(94,207,218,0.14)", "rgba(94,207,218,0.04)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCardGradient}
              >
                {/* Corner glow */}
                <Animated.View style={[styles.heroGlow, { opacity: pulseAnim.interpolate({ inputRange: [1, 1.06], outputRange: [0.6, 1] }) }]} />

                {/* Avatar */}
                <View style={styles.avatarOuter}>
                  <LinearGradient
                    colors={["#3ABFCC", "#1E9BAA"]}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.avatarInitials}>{getInitials(userName)}</Text>
                  </LinearGradient>
                  {/* Camera badge */}
                  <Pressable style={styles.cameraBadge}>
                    <Ionicons name="camera" size={12} color="white" />
                  </Pressable>
                </View>

                {/* Name & role */}
                <Text style={styles.heroName}>
                  {isLoading && !userName ? "Loading..." : userName || "User"}
                </Text>

                <View style={styles.roleTag}>
                  <MaterialCommunityIcons
                    name={userRole === "host" ? "ev-station" : "car-electric"}
                    size={13}
                    color={userRole === "host" ? "#FFC850" : "#5ECFDA"}
                  />
                  <Text style={[
                    styles.roleTagText,
                    { color: userRole === "host" ? "#FFC850" : "#5ECFDA" }
                  ]}>
                    {userRole === "host" ? "Lender" : "EV Owner"}
                  </Text>
                </View>

                {/* Info row */}
                <View style={styles.infoRow}>
                  {userEmail ? (
                    <View style={styles.infoItem}>
                      <Ionicons name="mail-outline" size={14} color="rgba(255,255,255,0.4)" />
                      <Text style={styles.infoText} numberOfLines={1}>{userEmail}</Text>
                    </View>
                  ) : null}
                  {userPhone ? (
                    <View style={styles.infoItem}>
                      <Ionicons name="call-outline" size={14} color="rgba(255,255,255,0.4)" />
                      <Text style={styles.infoText}>{userPhone}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Stats strip */}
                <View style={styles.statsStrip}>
                  <View style={styles.statBox}>
                    <Text style={styles.statNum}>12</Text>
                    <Text style={styles.statLabel}>Sessions</Text>
                  </View>
                  <View style={styles.statSep} />
                  <View style={styles.statBox}>
                    <Text style={styles.statNum}>84 kWh</Text>
                    <Text style={styles.statLabel}>Charged</Text>
                  </View>
                  <View style={styles.statSep} />
                  <View style={styles.statBox}>
                    <Text style={styles.statNum}>4.9★</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* ── SECTION LABEL ── */}
            <View style={styles.sectionHeader}>
              <Ionicons name="settings-outline" size={13} color="#5ECFDA" />
              <Text style={styles.sectionTitle}>Account Settings</Text>
            </View>

            {/* ── MENU ITEMS ── */}
            <View style={styles.menuList}>
              {menuItems.map((item, index) => {
                const itemScale = useRef(new Animated.Value(1)).current;
                const pressIn = () => Animated.timing(itemScale, { toValue: 0.97, duration: 60, useNativeDriver: true }).start();
                const pressOut = () => Animated.spring(itemScale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }).start();

                return (
                  <Animated.View key={index} style={{ transform: [{ scale: itemScale }] }}>
                    <TouchableOpacity
                      onPress={item.onPress}
                      onPressIn={pressIn}
                      onPressOut={pressOut}
                      activeOpacity={1}
                      style={[styles.menuItem, item.danger && styles.menuItemDanger]}
                    >
                      {/* Icon box */}
                      <View style={[styles.menuIconBox, { backgroundColor: item.color + "18", borderColor: item.color + "30" }]}>
                        <Ionicons name={item.icon} size={18} color={item.color} />
                      </View>

                      {/* Text */}
                      <View style={styles.menuTextBox}>
                        <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                          {item.label}
                        </Text>
                        <Text style={styles.menuDesc}>{item.desc}</Text>
                      </View>

                      {/* Chevron */}
                      <Ionicons
                        name="chevron-forward"
                        size={17}
                        color={item.danger ? "#FF6B6B" : "rgba(255,255,255,0.2)"}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>

            {/* ── APP VERSION ── */}
            <View style={styles.versionRow}>
              <Ionicons name="flash" size={11} color="rgba(94,207,218,0.4)" />
              <Text style={styles.versionText}>ChargeUp v1.0.0</Text>
            </View>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },

  topAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, backgroundColor: "#5ECFDA", opacity: 0.65, zIndex: 10,
  },
  blob1: {
    position: "absolute", width: 300, height: 300, borderRadius: 150,
    backgroundColor: "rgba(94,207,218,0.055)", top: -100, right: -80,
  },
  blob2: {
    position: "absolute", width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(94,207,218,0.03)", bottom: 100, left: -70,
  },

  // Top bar
  topBar: {
    flexDirection: "row", alignItems: "center",
    marginTop: 10, marginBottom: 24,
  },
  logoChip: {
    width: 26, height: 26, borderRadius: 7, backgroundColor: "#5ECFDA",
    alignItems: "center", justifyContent: "center", marginRight: 8,
  },
  brandName: { color: "white", fontSize: 20, fontWeight: "700", letterSpacing: 0.4, flex: 1 },
  badgePill: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(94,207,218,0.1)", borderWidth: 1,
    borderColor: "rgba(94,207,218,0.22)", borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, gap: 5,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#5ECFDA" },
  badgeText: { color: "#5ECFDA", fontSize: 11, fontWeight: "600" },

  // Hero card
  heroCard: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.2)",
    marginBottom: 24,
    shadowColor: "#5ECFDA",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  heroCardGradient: {
    padding: 24,
    alignItems: "center",
  },
  heroGlow: {
    position: "absolute",
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(94,207,218,0.1)",
    top: -40, right: -40,
  },

  // Avatar
  avatarOuter: {
    position: "relative",
    marginBottom: 14,
  },
  avatarGradient: {
    width: 86, height: 86, borderRadius: 43,
    alignItems: "center", justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.15)",
  },
  avatarInitials: {
    color: "white", fontSize: 32, fontWeight: "800", letterSpacing: -1,
  },
  cameraBadge: {
    position: "absolute", bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#1D3B42",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "rgba(94,207,218,0.4)",
  },

  heroName: {
    color: "white", fontSize: 24, fontWeight: "800",
    letterSpacing: -0.6, marginBottom: 8,
  },
  roleTag: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(94,207,218,0.1)",
    borderWidth: 1, borderColor: "rgba(94,207,218,0.25)",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4,
    marginBottom: 16,
  },
  roleTagText: { fontSize: 12, fontWeight: "700" },

  infoRow: { gap: 8, marginBottom: 20, width: "100%", alignItems: "center" },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { color: "rgba(255,255,255,0.5)", fontSize: 13 },

  // Stats strip
  statsStrip: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  statBox: { flex: 1, alignItems: "center" },
  statNum: { color: "#5ECFDA", fontSize: 16, fontWeight: "800", marginBottom: 2 },
  statLabel: { color: "rgba(255,255,255,0.38)", fontSize: 11 },
  statSep: { width: 1, backgroundColor: "rgba(255,255,255,0.07)" },

  // Section header
  sectionHeader: {
    flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 14,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.45)", fontSize: 11,
    fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase",
  },

  // Menu
  menuList: { gap: 10, marginBottom: 28 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  menuItemDanger: {
    backgroundColor: "rgba(255,107,107,0.05)",
    borderColor: "rgba(255,107,107,0.15)",
  },
  menuIconBox: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1,
  },
  menuTextBox: { flex: 1 },
  menuLabel: { color: "white", fontSize: 15, fontWeight: "600", marginBottom: 2 },
  menuLabelDanger: { color: "#FF6B6B" },
  menuDesc: { color: "rgba(255,255,255,0.35)", fontSize: 12 },

  // Version
  versionRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 5, marginBottom: 8,
  },
  versionText: { color: "rgba(255,255,255,0.2)", fontSize: 11 },
});