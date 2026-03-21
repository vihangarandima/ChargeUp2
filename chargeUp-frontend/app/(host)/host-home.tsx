import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = "https://chargeup2.onrender.com";
// ─────────────────────────────────────────────────────────────────────────────

export default function HostHomeScreen() {
  const router = useRouter();

  const [userName, setUserName]       = useState("");
  const [chargerType, setChargerType] = useState("No Charger Added");
  const [chargerImage, setChargerImage] = useState({
    uri: "https://cdn-icons-png.flaticon.com/512/8643/8643034.png",
  });

  // Entrance animations
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(30)).current;
  const cardSlide  = useRef(new Animated.Value(40)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const glowAnim   = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 11, useNativeDriver: true }),
      Animated.spring(cardSlide, { toValue: 0, tension: 55, friction: 11, delay: 150, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1,   duration: 2200, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // ── Same image map as original ─────────────────────────────────────────────
  const getChargerImage = (type: string) => {
    switch (type) {
      case "Standard 3-Pin Plug (13A)":
        return require("../../assets/images/host/Charger_types/Standard 3-Pin Plug (13A).png");
      case "Commando Socket (16A/32A)":
        return require("../../assets/images/host/Charger_types/Commando Socket (16A32A).png");
      case "Type 1 (J1772) - AC":
        return require("../../assets/images/host/Charger_types/Type 1 (J1772) - AC.png");
      case "Type 2 (Mennekes) - AC":
        return require("../../assets/images/host/Charger_types/Type 2 (Mennekes) - AC.png");
      case "CHAdeMO - DC Fast":
        return require("../../assets/images/host/Charger_types/CHAdeMO - DC Fast.png");
      case "CCS2 - DC Fast":
        return require("../../assets/images/host/Charger_types/CCS2 - DC Fast.png");
      case "Tesla Proprietary":
        return require("../../assets/images/host/Charger_types/Tesla Proprietary.png");
      case "Other":
        return require("../../assets/images/host/Charger_types/Other.png");
      default:
        return { uri: "https://cdn-icons-png.flaticon.com/512/8643/8643034.png" };
    }
  };

  // ── Same fetch logic as original ───────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) setUserName(storedName);

        const userId = await AsyncStorage.getItem("userId");
        console.log("🔑 Found ID in Locker:", userId);

        const response = await fetch(API_BASE + "/api/chargers/latest");

        if (response.ok) {
          const data = await response.json();
          console.log("🔌 WHAT IS IN THE CHARGER BOX?:", data);
          if (data && data.chargerType) {
            setChargerType(data.chargerType);
            setChargerImage(getChargerImage(data.chargerType));
          }
        }
      } catch (error) {
        console.log("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background gradient */}
      <LinearGradient
        colors={["#101922", "#15252E", "#193038", "#1D3B42", "#0E4548"]}
        locations={[0.13, 0.35, 0.55, 0.74, 1.0]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient blobs */}
      <Animated.View style={[styles.blob1, { opacity: glowAnim }]} />
      <View style={styles.blob2} />

      {/* Gold top accent */}
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
                <Ionicons name="flash" size={13} color="#3A2000" />
              </View>
              <Text style={styles.brandName}>ChargeUp</Text>
              <View style={styles.badgePill}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>Host Portal</Text>
              </View>
            </View>

            {/* ── GREETING ── */}
            <View style={styles.greetingRow}>
              <View style={styles.greetingLeft}>
                <Text style={styles.greetingLabel}>Welcome back,</Text>
                <Text style={styles.greetingName}>
                  {userName || "Host"} 👋
                </Text>
                <Text style={styles.greetingSubtitle}>Lend your charger & earn</Text>
              </View>

              {/* Action icons */}
              <View style={styles.headerIcons}>
                <Pressable 
                  style={styles.iconCircle}
                  onPress={() => alert("Search functionality coming soon!")}
                >
                  <Ionicons name="search" size={18} color="white" />
                </Pressable>
                <Pressable 
                  style={styles.iconCircle}
                  onPress={() => router.push("/(host)/host-notifications")}
                >
                  <Ionicons name="notifications-outline" size={18} color="white" />
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifText}>4</Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* ── EARNINGS STRIP ── */}
            <View style={styles.earningsStrip}>
              {[
                { num: "₹1,240", label: "This Month" },
                { num: "24",     label: "Sessions"   },
                { num: "4.9★",   label: "Rating"     },
              ].map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <View style={styles.stripSep} />}
                  <View style={styles.stripItem}>
                    <Text style={styles.stripNum}>{s.num}</Text>
                    <Text style={styles.stripLabel}>{s.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>

            {/* ── HERO CHARGER CARD ── */}
            <Animated.View style={{ transform: [{ translateY: cardSlide }] }}>
              <LinearGradient
                colors={["rgba(255,200,80,0.12)", "rgba(255,200,80,0.03)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
              >
                {/* Glow dot */}
                <Animated.View style={[styles.heroGlowDot, { opacity: glowAnim }]} />

                {/* Charger type label */}
                <View style={styles.heroTopRow}>
                  <View style={styles.chargerTypePill}>
                    <MaterialCommunityIcons name="power-plug" size={13} color="#FFC850" />
                    <Text style={styles.chargerTypeText} numberOfLines={1}>
                      {chargerType}
                    </Text>
                  </View>
                  <View style={styles.activeBadge}>
                    <View style={styles.activeDot} />
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                </View>

                {/* Charger image */}
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Image
                    source={chargerImage}
                    style={styles.chargerImage}
                    resizeMode="contain"
                  />
                </Animated.View>

                {/* Card bottom label */}
                <Text style={styles.heroCardHint}>Tap to manage your station</Text>
              </LinearGradient>
            </Animated.View>

            {/* ── SECTION HEADER ── */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>Manage Your Charger</Text>
              <View style={styles.sectionLine} />
            </View>

            {/* ── LIST ITEMS — same navigation as original ── */}
            <Pressable
              style={styles.listItem}
              onPress={() => router.push("/(host)/manage-charger")}
            >
              <View style={[styles.listIconWrap, { borderColor: "rgba(255,200,80,0.3)", backgroundColor: "rgba(255,200,80,0.1)" }]}>
                <Ionicons name="flash" size={18} color="#FFC850" />
              </View>
              <View style={styles.listTextWrap}>
                <Text style={styles.listItemTitle}>
                  {userName ? `${userName}'s Charging Station` : "Your Charging Station"}
                </Text>
                <Text style={styles.listItemDesc}>View bookings, status & earnings</Text>
              </View>
              <View style={[styles.listChevron, { backgroundColor: "rgba(255,200,80,0.1)" }]}>
                <Ionicons name="chevron-forward" size={15} color="#FFC850" />
              </View>
            </Pressable>

            <Pressable 
              style={styles.listItem}
              onPress={() => router.push("/(host)/location-picker")}
            >
              <View style={[styles.listIconWrap, { borderColor: "rgba(94,207,218,0.3)", backgroundColor: "rgba(94,207,218,0.1)" }]}>
                <Ionicons name="add" size={20} color="#5ECFDA" />
              </View>
              <View style={styles.listTextWrap}>
                <Text style={styles.listItemTitle}>Add Another Charger</Text>
                <Text style={styles.listItemDesc}>List a new charging point</Text>
              </View>
              <View style={[styles.listChevron, { backgroundColor: "rgba(94,207,218,0.1)" }]}>
                <Ionicons name="chevron-forward" size={15} color="#5ECFDA" />
              </View>
            </Pressable>

            {/* ── TIPS CARD ── */}
            <View style={styles.tipBox}>
              <Ionicons name="bulb-outline" size={16} color="#FFC850" style={{ marginRight: 10 }} />
              <Text style={styles.tipText}>
                Keep your charger available during peak hours (6–9 AM & 5–8 PM) to maximise earnings.
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
  scrollContent: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 120 },

  // Accent & blobs
  topAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, backgroundColor: "#FFC850", opacity: 0.7, zIndex: 10,
  },
  blob1: {
    position: "absolute",
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: "rgba(255,200,80,0.06)",
    top: -80, right: -80,
  },
  blob2: {
    position: "absolute",
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(255,200,80,0.03)",
    bottom: 120, left: -70,
  },

  // Top bar
  topBar: { flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 22 },
  logoChip: {
    width: 26, height: 26, borderRadius: 7, backgroundColor: "#FFC850",
    alignItems: "center", justifyContent: "center", marginRight: 8,
  },
  brandName: { color: "white", fontSize: 20, fontWeight: "700", letterSpacing: 0.4, flex: 1 },
  badgePill: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,200,80,0.12)", borderWidth: 1,
    borderColor: "rgba(255,200,80,0.3)", borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, gap: 5,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFC850" },
  badgeText: { color: "#FFC850", fontSize: 11, fontWeight: "600" },

  // Greeting
  greetingRow: {
    flexDirection: "row", alignItems: "flex-start",
    justifyContent: "space-between", marginBottom: 22,
  },
  greetingLeft: { flex: 1 },
  greetingLabel: { color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 2 },
  greetingName: { color: "white", fontSize: 26, fontWeight: "800", letterSpacing: -0.6, marginBottom: 4 },
  greetingSubtitle: { color: "rgba(255,255,255,0.4)", fontSize: 13 },
  headerIcons: { flexDirection: "row", gap: 10, marginTop: 4 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  notifBadge: {
    position: "absolute", top: -2, right: -2,
    backgroundColor: "#FFC850",
    width: 16, height: 16, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  notifText: { color: "#3A2000", fontSize: 9, fontWeight: "800" },

  // Earnings strip
  earningsStrip: {
    flexDirection: "row",
    backgroundColor: "rgba(255,200,80,0.07)",
    borderWidth: 1, borderColor: "rgba(255,200,80,0.15)",
    borderRadius: 18, paddingVertical: 14,
    marginBottom: 22,
  },
  stripItem: { flex: 1, alignItems: "center" },
  stripNum: { color: "#FFC850", fontSize: 16, fontWeight: "800", marginBottom: 2 },
  stripLabel: { color: "rgba(255,255,255,0.38)", fontSize: 11 },
  stripSep: { width: 1, backgroundColor: "rgba(255,255,255,0.08)" },

  // Hero charger card
  heroCard: {
    width: "100%", height: 260,
    borderRadius: 24,
    borderWidth: 1, borderColor: "rgba(255,200,80,0.25)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 28, overflow: "hidden",
    shadowColor: "#FFC850", shadowOpacity: 0.15,
    shadowRadius: 20, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  heroGlowDot: {
    position: "absolute",
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(255,200,80,0.08)",
    top: -60, right: -40,
  },
  heroTopRow: {
    position: "absolute", top: 16, left: 16, right: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  chargerTypePill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(255,200,80,0.12)",
    borderWidth: 1, borderColor: "rgba(255,200,80,0.25)",
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    maxWidth: "70%",
  },
  chargerTypeText: { color: "#FFC850", fontSize: 12, fontWeight: "600" },
  activeBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(32,178,120,0.12)",
    borderWidth: 1, borderColor: "rgba(32,178,120,0.3)",
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#20B278" },
  activeText: { color: "#4ECFA0", fontSize: 11, fontWeight: "600" },
  chargerImage: { width: 180, height: 160 },
  heroCardHint: {
    position: "absolute", bottom: 14,
    color: "rgba(255,255,255,0.3)", fontSize: 11,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row", alignItems: "center",
    gap: 10, marginBottom: 14,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.07)" },
  sectionTitle: {
    color: "rgba(255,255,255,0.4)", fontSize: 11,
    fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase",
  },

  // List items
  listItem: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18, borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    paddingHorizontal: 14, paddingVertical: 14,
    gap: 12, marginBottom: 12,
  },
  listIconWrap: {
    width: 44, height: 44, borderRadius: 13,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1,
  },
  listTextWrap: { flex: 1 },
  listItemTitle: { color: "white", fontSize: 15, fontWeight: "600", marginBottom: 2 },
  listItemDesc: { color: "rgba(255,255,255,0.38)", fontSize: 12 },
  listChevron: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },

  // Tip box
  tipBox: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: "rgba(255,200,80,0.06)",
    borderWidth: 1, borderColor: "rgba(255,200,80,0.15)",
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    marginTop: 4,
  },
  tipText: { flex: 1, color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 18 },
});