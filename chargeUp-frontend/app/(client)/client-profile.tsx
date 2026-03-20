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
  Image,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://10.184.109.178:5000";
const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const avatarScale = useRef(new Animated.Value(0.6)).current;
  const carSlide = useRef(new Animated.Value(60)).current;
  const carFade = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Staggered entrance
    Animated.stagger(80, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(avatarScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(carSlide, {
          toValue: 0,
          tension: 45,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(carFade, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Avatar breathe
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) setUserName(storedName);
        const storedRole = await AsyncStorage.getItem("userRole");
        if (storedRole) setUserRole(storedRole);

        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(API_BASE + "/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.name || data.userName)
            setUserName(data.name || data.userName);
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

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
  };

  const isHost = userRole === "host";

  const menuItems = [
    {
      label: "Edit Profile",
      icon: "person-outline" as const,
      desc: "Update your name, photo & info",
      color: "#5ECFDA",
      onPress: () => {},
    },
    {
      label: "My Vehicle",
      icon: "car-sport-outline" as const,
      desc: "Manage your EV details",
      color: "#5ECFDA",
      onPress: () => {},
    },
    {
      label: "Charging History",
      icon: "time-outline" as const,
      desc: "View past sessions & receipts",
      color: "#5ECFDA",
      onPress: () => {},
    },
    {
      label: "Notifications",
      icon: "notifications-outline" as const,
      desc: "Manage alerts & reminders",
      color: "#5ECFDA",
      onPress: () => {},
    },
    {
      label: isHost ? "My Charger Listings" : "Become a Lender",
      icon: "flash-outline" as const,
      desc: isHost
        ? "View and manage your stations"
        : "Share your charger & earn money",
      color: "#FFC850",
      onPress: () => {},
    },
    {
      label: "Help & Support",
      icon: "help-circle-outline" as const,
      desc: "FAQs, contact & feedback",
      color: "rgba(255,255,255,0.5)",
      onPress: () => {},
    },
    {
      label: "Log Out",
      icon: "log-out-outline" as const,
      desc: "Sign out of ChargeUp",
      color: "#FF6B6B",
      danger: true,
      onPress: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Base gradient */}
      <LinearGradient
        colors={["#060E14", "#101922", "#15252E", "#0E4548"]}
        locations={[0, 0.3, 0.65, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* ── EV CAR BACKGROUND IMAGE ── */}
      <Animated.View
        style={[
          styles.evBgContainer,
          { opacity: carFade, transform: [{ translateX: carSlide }] },
        ]}
        pointerEvents="none"
      >
        
        {/* Glow under the car */}
        <Animated.View style={[styles.carGlow, { opacity: glowAnim }]} />
      </Animated.View>

      {/* Dark overlay so text stays readable */}
      <LinearGradient
        colors={[
          "rgba(6,14,20,0.65)",
          "rgba(6,14,20,0.0)",
          "rgba(6,14,20,0.85)",
          "rgba(6,14,20,0.98)",
        ]}
        locations={[0, 0.35, 0.62, 1.0]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      {/* Teal top stripe */}
      <View style={styles.topAccent} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
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

            {/* ── SPACER so car image is visible ── */}
            <View style={styles.heroSpacer} />

            {/* ── PROFILE IDENTITY BLOCK ── */}
            <Animated.View
              style={[
                styles.identityBlock,
                { transform: [{ scale: avatarScale }] },
              ]}
            >
              {/* Big Avatar */}
              <Animated.View
                style={[
                  styles.avatarRing,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <LinearGradient
                  colors={["#3ABFCC", "#1A9BAA", "#0E7080"]}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarInitials}>
                    {getInitials(userName)}
                  </Text>
                </LinearGradient>
              </Animated.View>

              {/* Camera edit button */}
              <Pressable style={styles.editAvatarBtn}>
                <Ionicons name="camera" size={14} color="white" />
              </Pressable>

              {/* Name */}
              <Text style={styles.profileName}>
                {isLoading && !userName
                  ? "Loading..."
                  : userName || "Your Name"}
              </Text>

              {/* Role chip */}
              <View style={[styles.roleChip, isHost && styles.roleChipGold]}>
                <MaterialCommunityIcons
                  name={isHost ? "ev-station" : "car-electric"}
                  size={13}
                  color={isHost ? "#FFC850" : "#5ECFDA"}
                />
                <Text
                  style={[styles.roleChipText, isHost && { color: "#FFC850" }]}
                >
                  {isHost ? "Lender" : "EV Owner"}
                </Text>
              </View>

              {/* Email & phone */}
              <View style={styles.contactRow}>
                {userEmail ? (
                  <View style={styles.contactItem}>
                    <Ionicons
                      name="mail-outline"
                      size={13}
                      color="rgba(255,255,255,0.45)"
                    />
                    <Text style={styles.contactText}>{userEmail}</Text>
                  </View>
                ) : null}
                {userPhone ? (
                  <View style={styles.contactItem}>
                    <Ionicons
                      name="call-outline"
                      size={13}
                      color="rgba(255,255,255,0.45)"
                    />
                    <Text style={styles.contactText}>{userPhone}</Text>
                  </View>
                ) : null}
              </View>
            </Animated.View>

            {/* ── STATS ROW ── */}
            <View style={styles.statsRow}>
              {[
                { num: "12", label: "Sessions", icon: "flash-outline" },
                {
                  num: "84 kWh",
                  label: "Total Charged",
                  icon: "battery-charging-outline",
                },
                { num: "4.9★", label: "Rating", icon: "star-outline" },
              ].map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <View style={styles.statsSep} />}
                  <View style={styles.statItem}>
                    <Ionicons
                      name={s.icon as any}
                      size={14}
                      color="#5ECFDA"
                      style={{ marginBottom: 4 }}
                    />
                    <Text style={styles.statNum}>{s.num}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>

            {/* ── MENU SECTION ── */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>Account</Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={styles.menuList}>
              {menuItems.map((item, index) => {
                const itemScale = useRef(new Animated.Value(1)).current;
                return (
                  <Animated.View
                    key={index}
                    style={{ transform: [{ scale: itemScale }] }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={item.onPress}
                      onPressIn={() =>
                        Animated.timing(itemScale, {
                          toValue: 0.97,
                          duration: 60,
                          useNativeDriver: true,
                        }).start()
                      }
                      onPressOut={() =>
                        Animated.spring(itemScale, {
                          toValue: 1,
                          tension: 200,
                          friction: 10,
                          useNativeDriver: true,
                        }).start()
                      }
                      style={[
                        styles.menuItem,
                        (item as any).danger && styles.menuItemDanger,
                      ]}
                    >
                      {/* Left icon */}
                      <View
                        style={[
                          styles.menuIconWrap,
                          {
                            backgroundColor: item.color + "15",
                            borderColor: item.color + "28",
                          },
                        ]}
                      >
                        <Ionicons
                          name={item.icon}
                          size={19}
                          color={item.color}
                        />
                      </View>

                      {/* Text block */}
                      <View style={styles.menuTextWrap}>
                        <Text
                          style={[
                            styles.menuLabel,
                            (item as any).danger && { color: "#FF6B6B" },
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text style={styles.menuDesc}>{item.desc}</Text>
                      </View>

                      {/* Right chevron */}
                      <View
                        style={[
                          styles.menuChevronBox,
                          { backgroundColor: item.color + "12" },
                        ]}
                      >
                        <Ionicons
                          name="chevron-forward"
                          size={14}
                          color={(item as any).danger ? "#FF6B6B" : item.color}
                        />
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>

            {/* ── VERSION FOOTER ── */}
            <View style={styles.footer}>
              <Ionicons name="flash" size={10} color="rgba(94,207,218,0.3)" />
              <Text style={styles.footerText}>
                ChargeUp v1.0.0 • Made with ⚡
              </Text>
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
  scrollContent: { paddingHorizontal: 22, paddingBottom: 120 },

  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#5ECFDA",
    opacity: 0.7,
    zIndex: 10,
  },

  // EV Background
  evBgContainer: {
    position: "absolute",
    top: -height * 0.1,
    left: -width * 0.08,
    width: width * 1.16,
    height: height * 0.52,
    zIndex: 0,
  },
  evBgImage: {
    width: "100%",
    height: "100%",
    opacity: 0.28,
  },
  carGlow: {
    position: "absolute",
    bottom: -8,
    left: "5%",
    width: "90%",
    height: 40,
    borderRadius: 60,
    backgroundColor: "#5ECFDA",
    shadowColor: "#5ECFDA",
    shadowOpacity: 1,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 0,
    zIndex: 5,
  },
  logoChip: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: "#5ECFDA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  brandName: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.4,
    flex: 1,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(94,207,218,0.1)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.22)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5ECFDA",
  },
  badgeText: { color: "#5ECFDA", fontSize: 11, fontWeight: "600" },

  // Hero spacer — let the car show
  heroSpacer: { height: height * 0.12 },

  // Identity block
  identityBlock: {
    alignItems: "center",
    marginBottom: 20,
    zIndex: 5,
  },
  avatarRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "rgba(94,207,218,0.6)",
    padding: 4,
    marginBottom: 4,
    shadowColor: "#5ECFDA",
    shadowOpacity: 0.7,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    elevation: 16,
  },
  avatarGradient: {
    flex: 1,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "white",
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: -3,
  },
  editAvatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1D3B42",
    borderWidth: 2,
    borderColor: "rgba(94,207,218,0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -16,
    marginBottom: 14,
    zIndex: 10,
  },

  profileName: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(94,207,218,0.12)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.3)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 14,
  },
  roleChipGold: {
    backgroundColor: "rgba(255,200,80,0.1)",
    borderColor: "rgba(255,200,80,0.35)",
  },
  roleChipText: { color: "#5ECFDA", fontSize: 13, fontWeight: "700" },

  contactRow: { gap: 6, alignItems: "center" },
  contactItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  contactText: { color: "rgba(255,255,255,0.5)", fontSize: 13 },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.14)",
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 28,
    zIndex: 5,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: {
    color: "#5ECFDA",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  statLabel: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 10,
    textAlign: "center",
  },
  statsSep: { width: 1, backgroundColor: "rgba(255,255,255,0.07)" },

  // Section divider
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // Menu
  menuList: { gap: 10, marginBottom: 30 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 13,
  },
  menuItemDanger: {
    backgroundColor: "rgba(255,107,107,0.05)",
    borderColor: "rgba(255,107,107,0.14)",
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  menuTextWrap: { flex: 1 },
  menuLabel: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuDesc: { color: "rgba(255,255,255,0.35)", fontSize: 12, lineHeight: 16 },
  menuChevronBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  footerText: { color: "rgba(255,255,255,0.18)", fontSize: 11 },
});
