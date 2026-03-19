import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient as SvgGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  RadialGradient,
} from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// ── ANIMATED SVG WRAPPERS ─────────────────────────────────────────────────────
const AnimatedView = Animated.createAnimatedComponent(View);

export default function WelcomeScreen() {
  const router = useRouter();

  // Entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(40)).current;
  const subSlide = useRef(new Animated.Value(30)).current;
  const btnSlide = useRef(new Animated.Value(30)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  // Car drive-in from right
  const carX = useRef(new Animated.Value(width)).current;
  const carFloat = useRef(new Animated.Value(0)).current;

  // Wheels spin
  const wheelSpin = useRef(new Animated.Value(0)).current;

  // Charging bolt pulse
  const boltPulse = useRef(new Animated.Value(0)).current;
  const boltScale = useRef(new Animated.Value(1)).current;

  // Road lines scroll
  const roadScroll = useRef(new Animated.Value(0)).current;

  // Glow pulse
  const glowPulse = useRef(new Animated.Value(0.6)).current;

  // Particle floats
  const p1Y = useRef(new Animated.Value(0)).current;
  const p2Y = useRef(new Animated.Value(0)).current;
  const p3Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ── Entrance sequence ──
    Animated.stagger(120, [
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(titleSlide, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
      Animated.spring(subSlide, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
      Animated.spring(btnSlide, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
    ]).start();

    // Car drives in then settles
    Animated.spring(carX, {
      toValue: 0,
      tension: 35,
      friction: 12,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Car floating bob
    Animated.loop(
      Animated.sequence([
        Animated.timing(carFloat, { toValue: -8, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(carFloat, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // Wheels spin continuously
    Animated.loop(
      Animated.timing(wheelSpin, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // Bolt pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(boltPulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(boltPulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(boltScale, { toValue: 1.25, duration: 700, useNativeDriver: true }),
        Animated.timing(boltScale, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();

    // Road lines scrolling
    Animated.loop(
      Animated.timing(roadScroll, { toValue: 1, duration: 800, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.5, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Floating particles
    const floatParticle = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -18, duration: 2200, delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();

    floatParticle(p1Y, 0);
    floatParticle(p2Y, 600);
    floatParticle(p3Y, 1200);
  }, []);

  const wheelRotate = wheelSpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const boltOpacity = boltPulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  const roadOffset = roadScroll.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });

  const animateBtn = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }),
    ]).start(() => router.push("/role-select"));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background gradient */}
      <LinearGradient
        colors={["#060E14", "#0C1A22", "#101922", "#15252E", "#0E3038"]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Background geometric lines */}
      <View style={styles.bgLines} pointerEvents="none">
        <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <SvgGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#5ECFDA" stopOpacity="0" />
              <Stop offset="0.5" stopColor="#5ECFDA" stopOpacity="0.15" />
              <Stop offset="1" stopColor="#5ECFDA" stopOpacity="0" />
            </SvgGradient>
          </Defs>
          {/* Horizontal scan lines */}
          {[0.2, 0.35, 0.5, 0.65, 0.8].map((y, i) => (
            <Line key={i} x1={0} y1={height * y} x2={width} y2={height * y} stroke="url(#lineGrad)" strokeWidth="0.5" />
          ))}
          {/* Diagonal accent */}
          <Line x1={-50} y1={height * 0.3} x2={width + 50} y2={height * 0.55} stroke="#5ECFDA" strokeWidth="0.4" strokeOpacity="0.12" />
          <Line x1={-50} y1={height * 0.28} x2={width + 50} y2={height * 0.53} stroke="#5ECFDA" strokeWidth="0.4" strokeOpacity="0.07" />
        </Svg>
      </View>

      {/* Ambient glow blobs */}
      <Animated.View style={[styles.glowBlob1, { opacity: glowPulse }]} pointerEvents="none" />
      <Animated.View style={[styles.glowBlob2, { opacity: glowPulse }]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>

        {/* ── BRAND ── */}
        <Animated.View style={[styles.brandRow, { opacity: fadeAnim }]}>
          <View style={styles.logoChip}>
            <Ionicons name="flash" size={13} color="#0E1F26" />
          </View>
          <Text style={styles.brandText}>ChargeUp</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>EV Network</Text>
          </View>
        </Animated.View>

        {/* ── CAR SCENE ── */}
        <Animated.View
          style={[
            styles.carScene,
            { transform: [{ translateX: carX }, { translateY: carFloat }] },
          ]}
          pointerEvents="none"
        >
          {/* Ground glow */}
          <View style={styles.groundGlow} />

          {/* Road */}
          <View style={styles.road}>
            <Animated.View style={[styles.roadLines, { transform: [{ translateX: roadOffset }] }]}>
              {[-1, 0, 1, 2, 3, 4, 5, 6].map((i) => (
                <View key={i} style={[styles.roadDash, { left: i * 60 }]} />
              ))}
            </Animated.View>
          </View>

          {/* THE CAR SVG */}
          <Svg width={280} height={130} viewBox="0 0 280 130">
            <Defs>
              <SvgGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#2ABFCC" stopOpacity="1" />
                <Stop offset="0.5" stopColor="#1A8F9A" stopOpacity="1" />
                <Stop offset="1" stopColor="#0E5A62" stopOpacity="1" />
              </SvgGradient>
              <SvgGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#3AD0DE" stopOpacity="1" />
                <Stop offset="1" stopColor="#1A9BAA" stopOpacity="1" />
              </SvgGradient>
              <SvgGradient id="windowGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#A8F0FF" stopOpacity="0.9" />
                <Stop offset="1" stopColor="#5ECFDA" stopOpacity="0.5" />
              </SvgGradient>
              <SvgGradient id="wheelGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#3A3A3A" />
                <Stop offset="1" stopColor="#111" />
              </SvgGradient>
              <RadialGradient id="headlight" cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor="#FFFBE0" stopOpacity="1" />
                <Stop offset="1" stopColor="#FFD700" stopOpacity="0.3" />
              </RadialGradient>
              <RadialGradient id="taillight" cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor="#FF4444" stopOpacity="1" />
                <Stop offset="1" stopColor="#AA0000" stopOpacity="0.3" />
              </RadialGradient>
            </Defs>

            {/* Shadow under car */}
            <Ellipse cx="140" cy="118" rx="110" ry="8" fill="rgba(0,0,0,0.4)" />

            {/* Body lower */}
            <Path
              d="M30,85 Q25,85 22,80 L22,70 Q22,65 27,65 L253,65 Q258,65 258,70 L258,80 Q255,85 250,85 Z"
              fill="url(#bodyGrad)"
            />

            {/* Body upper / roof */}
            <Path
              d="M75,65 Q85,38 105,32 L175,32 Q200,32 210,65 Z"
              fill="url(#roofGrad)"
            />

            {/* Roof highlight */}
            <Path
              d="M95,60 Q103,42 115,37 L170,37 Q190,42 198,60 Z"
              fill="rgba(255,255,255,0.08)"
            />

            {/* Windshield */}
            <Path
              d="M100,64 Q105,42 118,36 L162,36 Q175,42 178,64 Z"
              fill="url(#windowGrad)"
            />
            {/* Windshield glare */}
            <Path d="M108,60 Q112,46 120,40 L132,40 Q120,48 118,60 Z" fill="rgba(255,255,255,0.35)" />

            {/* Side window */}
            <Path
              d="M80,64 Q84,50 95,44 L102,44 Q94,52 96,64 Z"
              fill="url(#windowGrad)"
            />
            <Path
              d="M182,64 Q184,50 192,44 L200,44 Q200,52 196,64 Z"
              fill="url(#windowGrad)"
            />

            {/* Body side panel line */}
            <Path d="M27,75 L253,75" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

            {/* Teal underglow strip */}
            <Path
              d="M50,85 L230,85"
              stroke="#5ECFDA"
              strokeWidth="2.5"
              strokeOpacity="0.8"
            />

            {/* Door line */}
            <Path d="M138,65 L138,85" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />

            {/* Front bumper detail */}
            <Path d="M22,72 Q18,72 17,75 L17,80 Q17,84 22,85" stroke="#5ECFDA" strokeWidth="1.5" fill="none" strokeOpacity="0.6" />

            {/* Rear bumper detail */}
            <Path d="M258,72 Q262,72 263,75 L263,80 Q263,84 258,85" stroke="#5ECFDA" strokeWidth="1.5" fill="none" strokeOpacity="0.6" />

            {/* Headlight */}
            <Ellipse cx="30" cy="72" rx="7" ry="5" fill="url(#headlight)" />
            <Ellipse cx="30" cy="72" rx="4" ry="3" fill="#FFFBE0" />
            {/* Headlight beam */}
            <Path d="M23,70 L5,62 M23,72 L2,72 M23,74 L5,80" stroke="#FFFBE0" strokeWidth="0.8" strokeOpacity="0.4" />

            {/* Tail light */}
            <Rect x="252" y="67" width="8" height="10" rx="2" fill="url(#taillight)" />
            <Rect x="254" y="69" width="4" height="6" rx="1" fill="#FF6666" />

            {/* Front wheel */}
            <G>
              <Circle cx="72" cy="95" r="20" fill="url(#wheelGrad)" />
              <Circle cx="72" cy="95" r="17" fill="none" stroke="#5ECFDA" strokeWidth="1.5" strokeOpacity="0.5" />
              <Circle cx="72" cy="95" r="8" fill="#2A2A2A" />
              <Circle cx="72" cy="95" r="5" fill="#1A1A1A" />
              {/* Spokes - static base */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <Line
                    key={i}
                    x1={72 + 8 * Math.cos(rad)}
                    y1={95 + 8 * Math.sin(rad)}
                    x2={72 + 16 * Math.cos(rad)}
                    y2={95 + 16 * Math.sin(rad)}
                    stroke="#5ECFDA"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                  />
                );
              })}
              {/* Rim highlight */}
              <Circle cx="72" cy="95" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            </G>

            {/* Rear wheel */}
            <G>
              <Circle cx="208" cy="95" r="20" fill="url(#wheelGrad)" />
              <Circle cx="208" cy="95" r="17" fill="none" stroke="#5ECFDA" strokeWidth="1.5" strokeOpacity="0.5" />
              <Circle cx="208" cy="95" r="8" fill="#2A2A2A" />
              <Circle cx="208" cy="95" r="5" fill="#1A1A1A" />
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <Line
                    key={i}
                    x1={208 + 8 * Math.cos(rad)}
                    y1={95 + 8 * Math.sin(rad)}
                    x2={208 + 16 * Math.cos(rad)}
                    y2={95 + 16 * Math.sin(rad)}
                    stroke="#5ECFDA"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                  />
                );
              })}
              <Circle cx="208" cy="95" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            </G>

            {/* Antenna */}
            <Line x1="160" y1="32" x2="165" y2="20" stroke="#5ECFDA" strokeWidth="1.5" strokeOpacity="0.6" />
            <Circle cx="165" cy="19" r="2" fill="#5ECFDA" fillOpacity="0.8" />
          </Svg>

          {/* Spinning wheel overlay (Animated) */}
          <Animated.View
            style={[
              styles.wheelOverlayFront,
              { transform: [{ rotate: wheelRotate }] },
            ]}
            pointerEvents="none"
          >
            <Svg width={40} height={40} viewBox="0 0 40 40">
              {[0, 45, 90, 135].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <Line
                    key={i}
                    x1={20 + 6 * Math.cos(rad)}
                    y1={20 + 6 * Math.sin(rad)}
                    x2={20 + 17 * Math.cos(rad)}
                    y2={20 + 17 * Math.sin(rad)}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="2.5"
                  />
                );
              })}
            </Svg>
          </Animated.View>

          <Animated.View
            style={[
              styles.wheelOverlayRear,
              { transform: [{ rotate: wheelRotate }] },
            ]}
            pointerEvents="none"
          >
            <Svg width={40} height={40} viewBox="0 0 40 40">
              {[0, 45, 90, 135].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <Line
                    key={i}
                    x1={20 + 6 * Math.cos(rad)}
                    y1={20 + 6 * Math.sin(rad)}
                    x2={20 + 17 * Math.cos(rad)}
                    y2={20 + 17 * Math.sin(rad)}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="2.5"
                  />
                );
              })}
            </Svg>
          </Animated.View>
        </Animated.View>

        {/* ── FLOATING ENERGY PARTICLES ── */}
        {[
          { anim: p1Y, left: width * 0.15, top: height * 0.38, size: 5 },
          { anim: p2Y, left: width * 0.75, top: height * 0.32, size: 4 },
          { anim: p3Y, left: width * 0.5, top: height * 0.28, size: 6 },
        ].map((p, i) => (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={[
              styles.particle,
              { left: p.left, top: p.top, width: p.size, height: p.size, borderRadius: p.size / 2 },
              { transform: [{ translateY: p.anim }] },
            ]}
          />
        ))}

        {/* ── CONTENT ── */}
        <View style={styles.content}>

          {/* Title */}
          <Animated.View style={{ transform: [{ translateY: titleSlide }], opacity: fadeAnim }}>
            <Text style={styles.tagline}>THE FUTURE OF</Text>
            <Text style={styles.mainTitle}>EV Charging</Text>
            <View style={styles.titleUnderline} />
          </Animated.View>

          {/* Sub */}
          <Animated.View style={{ transform: [{ translateY: subSlide }], opacity: fadeAnim }}>
            <Text style={styles.subText}>
              Find nearby stations, book your slot,{"\n"}and charge seamlessly.
            </Text>
          </Animated.View>

          {/* Stats row */}
          <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
            {[
              { num: "2,400+", label: "Stations" },
              { num: "50k+", label: "Users" },
              { num: "4.9★", label: "Rating" },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{s.num}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </Animated.View>

          {/* CTA Button */}
          <Animated.View style={{ transform: [{ translateY: btnSlide }, { scale: btnScale }], opacity: fadeAnim }}>
            <Pressable onPress={animateBtn} style={styles.ctaBtn}>
              <LinearGradient
                colors={["#3ABFCC", "#1A9BAA", "#0E7A88"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Get Started</Text>
                <View style={styles.ctaArrow}>
                  <Ionicons name="arrow-forward" size={18} color="#0E4548" />
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Already have account */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Pressable onPress={() => router.push("/(auth)/login")} style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Text style={styles.loginLink}>Sign In →</Text>
            </Pressable>
          </Animated.View>

        </View>

        {/* Charging bolt badge — pulsing */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.boltBadge,
            { opacity: boltOpacity, transform: [{ scale: boltScale }] },
          ]}
        >
          <Ionicons name="flash" size={18} color="#5ECFDA" />
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  bgLines: { ...StyleSheet.absoluteFillObject },

  // Glow blobs
  glowBlob1: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(94,207,218,0.07)",
    top: -80,
    right: -100,
  },
  glowBlob2: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(94,207,218,0.05)",
    bottom: 60,
    left: -80,
  },

  // Brand row
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 26,
    paddingTop: 8,
    marginBottom: 0,
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
  brandText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.4,
    flex: 1,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(94,207,218,0.1)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.25)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#5ECFDA" },
  liveText: { color: "#5ECFDA", fontSize: 11, fontWeight: "600" },

  // Car scene
  carScene: {
    alignItems: "center",
    marginTop: height * 0.04,
    marginBottom: -16,
    position: "relative",
  },
  groundGlow: {
    position: "absolute",
    bottom: 12,
    width: 260,
    height: 24,
    borderRadius: 40,
    backgroundColor: "rgba(94,207,218,0.18)",
    alignSelf: "center",
  },
  road: {
    position: "absolute",
    bottom: 0,
    width: width * 0.9,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 6,
    overflow: "hidden",
  },
  roadLines: {
    position: "absolute",
    top: 5,
    left: 0,
    flexDirection: "row",
    width: width * 2,
  },
  roadDash: {
    position: "absolute",
    width: 30,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(94,207,218,0.3)",
    top: 0,
  },

  // Spinning wheel overlays
  wheelOverlayFront: {
    position: "absolute",
    bottom: 14,
    left: "50%",
    marginLeft: -140 + 72 - 20,
    width: 40,
    height: 40,
  },
  wheelOverlayRear: {
    position: "absolute",
    bottom: 14,
    left: "50%",
    marginLeft: -140 + 208 - 20,
    width: 40,
    height: 40,
  },

  // Particles
  particle: {
    position: "absolute",
    backgroundColor: "#5ECFDA",
    opacity: 0.6,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    paddingBottom: 20,
  },
  tagline: {
    color: "rgba(94,207,218,0.8)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 6,
  },
  mainTitle: {
    color: "white",
    fontSize: 46,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 50,
    marginBottom: 10,
  },
  titleUnderline: {
    width: 56,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#5ECFDA",
    marginBottom: 18,
  },
  subText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 28,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(94,207,218,0.06)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.12)",
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 28,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { color: "#5ECFDA", fontSize: 17, fontWeight: "800", marginBottom: 2 },
  statLabel: { color: "rgba(255,255,255,0.38)", fontSize: 11, fontWeight: "500" },
  statDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.08)" },

  // CTA
  ctaBtn: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    gap: 12,
  },
  ctaText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  ctaArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.88)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Login
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: { color: "rgba(255,255,255,0.38)", fontSize: 14 },
  loginLink: { color: "#5ECFDA", fontSize: 14, fontWeight: "700" },

  // Bolt badge
  boltBadge: {
    position: "absolute",
    top: height * 0.22,
    right: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(94,207,218,0.12)",
    borderWidth: 1,
    borderColor: "rgba(94,207,218,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
});