import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons, Entypo, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, Line, RadialGradient, Stop, LinearGradient as SvgGradient } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function RoleSelectScreen() {
  const router = useRouter();

  // ── Entrance animations ──
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideTitle = useRef(new Animated.Value(35)).current;
  const slideSub = useRef(new Animated.Value(25)).current;
  const slideCard1 = useRef(new Animated.Value(50)).current;
  const slideCard2 = useRef(new Animated.Value(50)).current;
  const slideLegal = useRef(new Animated.Value(20)).current;

  // ── Card press scales ──
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;

  // ── Icon glow pulses ──
  const glow1 = useRef(new Animated.Value(0.5)).current;
  const glow2 = useRef(new Animated.Value(0.5)).current;

  // ── Ambient particle floats ──
  const p1Y = useRef(new Animated.Value(0)).current;
  const p2Y = useRef(new Animated.Value(0)).current;
  const p3Y = useRef(new Animated.Value(0)).current;
  const p4Y = useRef(new Animated.Value(0)).current;
  const p1O = useRef(new Animated.Value(0.4)).current;
  const p2O = useRef(new Animated.Value(0.6)).current;
  const p3O = useRef(new Animated.Value(0.3)).current;
  const p4O = useRef(new Animated.Value(0.5)).current;

  // ── Blob pulse ──
  const blobScale = useRef(new Animated.Value(1)).current;
  const blobScale2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance
    Animated.stagger(80, [
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideTitle, { toValue: 0, tension: 70, friction: 10, useNativeDriver: true }),
      Animated.spring(slideSub, { toValue: 0, tension: 70, friction: 10, useNativeDriver: true }),
      Animated.spring(slideCard1, { toValue: 0, tension: 60, friction: 11, useNativeDriver: true }),
      Animated.spring(slideCard2, { toValue: 0, tension: 60, friction: 11, useNativeDriver: true }),
      Animated.spring(slideLegal, { toValue: 0, tension: 60, friction: 11, useNativeDriver: true }),
    ]).start();

    // Icon glows loop
    const pulseGlow = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 1600, delay, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.5, duration: 1600, useNativeDriver: true }),
        ])
      ).start();
    pulseGlow(glow1, 0);
    pulseGlow(glow2, 800);

    // Blob breathe
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobScale, { toValue: 1.12, duration: 3500, useNativeDriver: true }),
        Animated.timing(blobScale, { toValue: 1, duration: 3500, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobScale2, { toValue: 1.08, duration: 4200, useNativeDriver: true }),
        Animated.timing(blobScale2, { toValue: 1, duration: 4200, useNativeDriver: true }),
      ])
    ).start();

    // Floating particles
    const floatP = (yAnim: Animated.Value, oAnim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(yAnim, { toValue: -22, duration: 2800, delay, useNativeDriver: true }),
            Animated.timing(yAnim, { toValue: 0, duration: 2800, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(oAnim, { toValue: 0.9, duration: 2800, delay, useNativeDriver: true }),
            Animated.timing(oAnim, { toValue: 0.2, duration: 2800, useNativeDriver: true }),
          ]),
        ])
      ).start();

    floatP(p1Y, p1O, 0);
    floatP(p2Y, p2O, 700);
    floatP(p3Y, p3O, 1400);
    floatP(p4Y, p4O, 2100);
  }, []);

  const pressCard = (scale: Animated.Value, cb: () => void) => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }),
    ]).start(cb);
  };

  const handleSelectOwner = async () => {
    pressCard(scale1, async () => {
      await AsyncStorage.setItem("userRole", "client");
      router.push("/(auth)/register");
    });
  };

  const handleSelectLender = async () => {
    pressCard(scale2, async () => {
      await AsyncStorage.setItem("userRole", "host");
      router.push("/(auth)/register");
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={["#101922", "#15252E", "#193038", "#1D3B42", "#0E4548"]}
        locations={[0.13, 0.35, 0.55, 0.74, 1.0]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Teal top stripe */}
      <View style={styles.topAccent} />

      {/* Background SVG grid lines */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width={width} height={height}>
          <Defs>
            <SvgGradient id="lg" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#5ECFDA" stopOpacity="0" />
              <Stop offset="0.5" stopColor="#5ECFDA" stopOpacity="0.12" />
              <Stop offset="1" stopColor="#5ECFDA" stopOpacity="0" />
            </SvgGradient>
          </Defs>
          {[0.22, 0.38, 0.54, 0.70, 0.86].map((y, i) => (
            <Line key={i} x1={0} y1={height * y} x2={width} y2={height * y} stroke="url(#lg)" strokeWidth="0.6" />
          ))}
          <Line x1={0} y1={height * 0.25} x2={width} y2={height * 0.6} stroke="#5ECFDA" strokeWidth="0.4" strokeOpacity="0.08" />
        </Svg>
      </View>

      {/* Animated glow blobs */}
      <Animated.View style={[styles.blob1, { transform: [{ scale: blobScale }] }]} pointerEvents="none" />
      <Animated.View style={[styles.blob2, { transform: [{ scale: blobScale2 }] }]} pointerEvents="none" />

      {/* Floating particles */}
      {[
        { y: p1Y, o: p1O, left: width * 0.1, top: height * 0.3, size: 5 },
        { y: p2Y, o: p2O, left: width * 0.85, top: height * 0.42, size: 4 },
        { y: p3Y, o: p3O, left: width * 0.2, top: height * 0.65, size: 6 },
        { y: p4Y, o: p4O, left: width * 0.78, top: height * 0.72, size: 3 },
      ].map((p, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={[
            styles.particle,
            {
              left: p.left, top: p.top,
              width: p.size, height: p.size, borderRadius: p.size / 2,
              opacity: p.o,
              transform: [{ translateY: p.y }],
            },
          ]}
        />
      ))}

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>

          {/* ── TOP BAR ── */}
          <View style={styles.topBar}>
            <View style={styles.logoChip}>
              <Ionicons name="flash" size={13} color="#0E1F26" />
            </View>
            <Text style={styles.brandText}>ChargeUp</Text>
            <View style={styles.badgePill}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>EV Network</Text>
            </View>
          </View>

          {/* ── MAIN CONTENT ── */}
          <View style={styles.content}>

            {/* Hero text */}
            <Animated.View style={{ transform: [{ translateY: slideTitle }] }}>
              <Text style={styles.eyebrow}>CHOOSE YOUR ROLE</Text>
              <Text style={styles.welcomeTitle}>Welcome to{"\n"}ChargeUp</Text>
              <View style={styles.titleUnderline} />
            </Animated.View>

            <Animated.View style={{ transform: [{ translateY: slideSub }] }}>
              <Text style={styles.subtitle}>
                Tell us how you'll use the app — you can always change this later.
              </Text>
            </Animated.View>

            {/* ── EV OWNER CARD ── */}
            <Animated.View style={{ transform: [{ translateY: slideCard1 }, { scale: scale1 }] }}>
              <Pressable onPress={handleSelectOwner} style={styles.roleCard}>
                <LinearGradient
                  colors={["rgba(94,207,218,0.13)", "rgba(94,207,218,0.03)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  {/* Top row: icon + label + arrow */}
                  <View style={styles.cardTopRow}>
                    <Animated.View style={[styles.bigIconCircle, styles.bigIconCircleBlue, { opacity: glow1.interpolate({ inputRange: [0.5, 1], outputRange: [0.85, 1] }) }]}>
                      <MaterialCommunityIcons name="car-electric" size={38} color="white" />
                    </Animated.View>
                    <View style={styles.cardTopText}>
                      <Text style={styles.cardQuestion}>I own an electric car</Text>
                      <Text style={styles.roleTitle}>EV Owner</Text>
                    </View>
                    <View style={styles.cardArrow}>
                      <Ionicons name="arrow-forward" size={16} color="#0E4548" />
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Benefit lines */}
                  <View style={styles.benefitList}>
                    {[
                      { icon: "search-outline", text: "Find charging stations near you" },
                      { icon: "calendar-outline", text: "Book a slot in advance" },
                      { icon: "flash-outline", text: "Pay and track charging in the app" },
                    ].map((b, i) => (
                      <View key={i} style={styles.benefitRow}>
                        <Ionicons name={b.icon as any} size={15} color="#5ECFDA" style={{ marginRight: 10 }} />
                        <Text style={styles.benefitText}>{b.text}</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </Pressable>
            </Animated.View>

            {/* Divider */}
            <Animated.View style={[styles.orRow, { transform: [{ translateY: slideCard1 }] }]}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.orLine} />
            </Animated.View>

            {/* ── LENDER CARD ── */}
            <Animated.View style={{ transform: [{ translateY: slideCard2 }, { scale: scale2 }] }}>
              <Pressable onPress={handleSelectLender} style={[styles.roleCard, styles.roleCardGold]}>
                <LinearGradient
                  colors={["rgba(255,200,80,0.1)", "rgba(255,200,80,0.02)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  {/* Top row */}
                  <View style={styles.cardTopRow}>
                    <Animated.View style={[styles.bigIconCircle, styles.bigIconCircleGold, { opacity: glow2.interpolate({ inputRange: [0.5, 1], outputRange: [0.85, 1] }) }]}>
                      <MaterialCommunityIcons name="ev-station" size={38} color="white" />
                    </Animated.View>
                    <View style={styles.cardTopText}>
                      <Text style={[styles.cardQuestion, { color: "rgba(255,200,80,0.8)" }]}>I have a charger at home</Text>
                      <Text style={styles.roleTitle}>Lender</Text>
                    </View>
                    <View style={[styles.cardArrow, styles.cardArrowGold]}>
                      <Ionicons name="arrow-forward" size={16} color="#5A3800" />
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={[styles.cardDivider, { backgroundColor: "rgba(255,200,80,0.15)" }]} />

                  {/* Benefit lines */}
                  <View style={styles.benefitList}>
                    {[
                      { icon: "home-outline", text: "List your home charger easily" },
                      { icon: "pricetag-outline", text: "Set your own pricing and hours" },
                      { icon: "wallet-outline", text: "Earn money while you're away" },
                    ].map((b, i) => (
                      <View key={i} style={styles.benefitRow}>
                        <Ionicons name={b.icon as any} size={15} color="#FFC850" style={{ marginRight: 10 }} />
                        <Text style={styles.benefitText}>{b.text}</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </Pressable>
            </Animated.View>

          </View>

          {/* ── LEGAL ── */}
          <Animated.View style={[styles.legalBox, { transform: [{ translateY: slideLegal }] }]}>
            <Ionicons name="shield-checkmark-outline" size={13} color="#5ECFDA" style={{ marginRight: 7 }} />
            <Text style={styles.legalText}>
              By continuing, you agree to our{" "}
              <Text style={styles.legalLink}>Terms & Conditions</Text>
              {" "}and{" "}
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </Text>
          </Animated.View>

        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  topAccent: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 2, backgroundColor: "#5ECFDA", opacity: 0.65, zIndex: 10,
  },

  // Blobs
  blob1: {
    position: "absolute",
    width: 320, height: 320, borderRadius: 160,
    backgroundColor: "rgba(94,207,218,0.07)",
    top: -80, right: -90,
  },
  blob2: {
    position: "absolute",
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: "rgba(94,207,218,0.04)",
    bottom: 60, left: -80,
  },

  // Particles
  particle: {
    position: "absolute",
    backgroundColor: "#5ECFDA",
  },

  // Top bar
  topBar: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 26, paddingTop: 8, marginBottom: 6,
  },
  logoChip: {
    width: 26, height: 26, borderRadius: 7, backgroundColor: "#5ECFDA",
    alignItems: "center", justifyContent: "center", marginRight: 8,
  },
  brandText: { color: "white", fontSize: 20, fontWeight: "700", letterSpacing: 0.4, flex: 1 },
  badgePill: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(94,207,218,0.1)", borderWidth: 1,
    borderColor: "rgba(94,207,218,0.22)", borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, gap: 5,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#5ECFDA" },
  badgeText: { color: "#5ECFDA", fontSize: 11, fontWeight: "600" },

  // Content
  content: { flex: 1, paddingHorizontal: 24, justifyContent: "center", gap: 0 },

  eyebrow: {
    color: "rgba(94,207,218,0.75)",
    fontSize: 11, fontWeight: "700", letterSpacing: 3,
    marginBottom: 6,
  },
  welcomeTitle: {
    color: "white",
    fontSize: 36, fontWeight: "800", letterSpacing: -1,
    lineHeight: 42, marginBottom: 10,
  },
  titleUnderline: {
    width: 48, height: 3, borderRadius: 2,
    backgroundColor: "#5ECFDA", marginBottom: 12,
  },
  subtitle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14, lineHeight: 21,
    marginBottom: 24,
  },

  // Cards
  roleCard: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#5ECFDA",
    marginBottom: 0,
    shadowColor: "#5ECFDA",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  roleCardGold: {
    borderColor: "#FFC850",
    shadowColor: "#FFC850",
  },
  cardGradient: {
    padding: 20,
  },
  cardGradientGold: {},

  // Card top row: big icon + text + arrow
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  bigIconCircle: {
    width: 64, height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  bigIconCircleBlue: {
    backgroundColor: "rgba(94,207,218,0.15)",
    borderColor: "rgba(94,207,218,0.5)",
  },
  bigIconCircleGold: {
    backgroundColor: "rgba(255,200,80,0.15)",
    borderColor: "rgba(255,200,80,0.5)",
  },
  cardTopText: { flex: 1 },
  cardQuestion: {
    color: "rgba(94,207,218,0.8)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  roleTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  cardArrow: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: "#5ECFDA",
    alignItems: "center",
    justifyContent: "center",
  },
  cardArrowGold: { backgroundColor: "#FFC850" },

  cardDivider: {
    height: 1,
    backgroundColor: "rgba(94,207,218,0.15)",
    marginBottom: 14,
  },

  // Benefit lines
  benefitList: { gap: 10 },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  benefitText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },

  // Or divider
  orRow: {
    flexDirection: "row", alignItems: "center",
    gap: 12, marginVertical: 14,
  },
  orLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.07)" },
  orText: { color: "rgba(255,255,255,0.25)", fontSize: 12 },

  // Legal
  legalBox: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: "rgba(94,207,218,0.06)",
    borderWidth: 1, borderColor: "rgba(94,207,218,0.12)",
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    marginHorizontal: 24, marginBottom: 12,
  },
  legalText: { flex: 1, color: "rgba(255,255,255,0.5)", fontSize: 11, lineHeight: 17 },
  legalLink: { color: "#5ECFDA", fontWeight: "700", textDecorationLine: "underline" },
});