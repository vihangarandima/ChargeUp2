import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type StatusType = "in-use" | "available" | "unavailable";

export default function HostChargerDetailsScreen() {
  const [chargerStatus, setChargerStatus] = useState<StatusType>("available");
  const router = useRouter();

  const statusConfig = {
    "in-use": { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)", icon: "flash", label: "In Use" },
    available: { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.4)", icon: "checkmark-circle", label: "Available" },
    unavailable: { color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)", icon: "close-circle", label: "Unavailable" },
  };

  const current = statusConfig[chargerStatus];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={require("../../assets/images/car_charging.jpg")}
        style={StyleSheet.absoluteFillObject}
        imageStyle={{ opacity: 0.15 }}
      />
      <LinearGradient
        colors={["#0A1114", "rgba(10,17,20,0.92)", "#0A1114"]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── HEADER ── */}
          <View style={styles.header}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="white" />
            </Pressable>
            <View style={styles.logoChip}>
              <Ionicons name="flash" size={13} color="#0A1114" />
            </View>
            <Text style={styles.brandText}>ChargeUp</Text>
          </View>

          {/* ── HERO IMAGE ── */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={["rgba(0,209,255,0.08)", "rgba(0,209,255,0.02)"]}
              style={styles.heroGradient}
            >
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/8643/8643034.png" }}
                style={styles.chargerImage}
                resizeMode="contain"
              />
              {/* Live status badge */}
              <View style={[styles.liveBadge, { backgroundColor: current.bg, borderColor: current.border }]}>
                <Ionicons name={current.icon as any} size={13} color={current.color} />
                <Text style={[styles.liveBadgeText, { color: current.color }]}>{current.label}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* ── CHARGER SPECS ── */}
          <Text style={styles.sectionTitle}>Charger Specs</Text>
          <View style={styles.specsGrid}>
            {[
              { icon: "flash", label: "Type", value: "Fast Charger" },
              { icon: "power", label: "Power", value: "30–75 kW" },
              { icon: "hardware-chip", label: "Protocol", value: "CHAdeMO / CCS" },
              { icon: "wifi", label: "Ports", value: "Single Port" },
            ].map((item) => (
              <View key={item.label} style={styles.specCard}>
                <View style={styles.specIconBox}>
                  <Ionicons name={item.icon as any} size={18} color="#00D1FF" />
                </View>
                <Text style={styles.specLabel}>{item.label}</Text>
                <Text style={styles.specValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* ── STATUS CONTROL ── */}
          <Text style={styles.sectionTitle}>Charger Status</Text>
          <Text style={styles.sectionSub}>Tap to update your charger's availability</Text>

          <View style={styles.statusRow}>
            {(["in-use", "available", "unavailable"] as const).map((s) => {
              const cfg = statusConfig[s];
              const isActive = chargerStatus === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => setChargerStatus(s)}
                  style={[
                    styles.statusBtn,
                    isActive && {
                      backgroundColor: cfg.bg,
                      borderColor: cfg.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={cfg.icon as any}
                    size={16}
                    color={isActive ? cfg.color : "rgba(255,255,255,0.3)"}
                  />
                  <Text
                    style={[
                      styles.statusBtnText,
                      { color: isActive ? cfg.color : "rgba(255,255,255,0.4)" },
                    ]}
                  >
                    {cfg.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── EARNINGS CARD ── */}
          <View style={styles.earningsCard}>
            <LinearGradient
              colors={["rgba(0,209,255,0.1)", "rgba(0,209,255,0.03)"]}
              style={styles.earningsGradient}
            >
              <View style={styles.earningsLeft}>
                <Text style={styles.earningsLabel}>Today's Earnings</Text>
                <Text style={styles.earningsAmount}>Rs. 0.00</Text>
                <Text style={styles.earningsSub}>No sessions yet today</Text>
              </View>
              <View style={styles.earningsIconBox}>
                <Ionicons name="wallet-outline" size={28} color="#00D1FF" />
              </View>
            </LinearGradient>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A1114" },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 120 },

  // ── HEADER ──
  header: { flexDirection: "row", alignItems: "center", marginBottom: 24, gap: 10 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.07)", justifyContent: "center", alignItems: "center" },
  logoChip: { width: 26, height: 26, borderRadius: 7, backgroundColor: "#00D1FF", justifyContent: "center", alignItems: "center" },
  brandText: { color: "white", fontSize: 20, fontWeight: "700", flex: 1 },

  // ── HERO ──
  heroCard: { borderRadius: 24, overflow: "hidden", marginBottom: 28, borderWidth: 1, borderColor: "rgba(0,209,255,0.15)" },
  heroGradient: { alignItems: "center", paddingVertical: 30, position: "relative" },
  chargerImage: { width: 160, height: 180 },
  liveBadge: { position: "absolute", bottom: 16, right: 16, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  liveBadgeText: { fontSize: 12, fontWeight: "700" },

  // ── SPECS ──
  sectionTitle: { color: "white", fontSize: 18, fontWeight: "700", marginBottom: 6 },
  sectionSub: { color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 14 },
  specsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 },
  specCard: { width: "47%", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", padding: 16 },
  specIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(0,209,255,0.1)", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  specLabel: { color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: "600", textTransform: "uppercase", marginBottom: 3 },
  specValue: { color: "white", fontSize: 14, fontWeight: "600" },

  // ── STATUS ──
  statusRow: { flexDirection: "row", gap: 10, marginBottom: 28, marginTop: 4 },
  statusBtn: { flex: 1, alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 14, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  statusBtnText: { fontSize: 12, fontWeight: "600" },

  // ── EARNINGS ──
  earningsCard: { borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(0,209,255,0.15)" },
  earningsGradient: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 },
  earningsLeft: { gap: 4 },
  earningsLabel: { color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: "500" },
  earningsAmount: { color: "white", fontSize: 26, fontWeight: "800" },
  earningsSub: { color: "rgba(255,255,255,0.3)", fontSize: 12 },
  earningsIconBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: "rgba(0,209,255,0.1)", justifyContent: "center", alignItems: "center" },
});