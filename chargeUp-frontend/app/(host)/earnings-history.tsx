import React from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function EarningsHistoryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#060E14", "#101922", "#15252E"]} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="white" onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Earnings History</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
            <Text style={styles.summaryValue}>$420.50</Text>
          </View>

          <Text style={styles.listHeader}>Recent Payouts</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.date}>Mar 15, 2026</Text>
              <Text style={styles.cost}>+$25.00</Text>
            </View>
            <View style={styles.cardBody}>
              <Ionicons name="wallet-outline" size={20} color="#FFC850" />
              <Text style={styles.stationName}>Payout to Bank Account ending in 1234</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  content: { padding: 20 },
  summaryCard: { backgroundColor: "rgba(255,200,80,0.1)", borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 30, borderWidth: 1, borderColor: "rgba(255,200,80,0.3)" },
  summaryLabel: { color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 },
  summaryValue: { color: "#FFC850", fontSize: 36, fontWeight: "800" },
  listHeader: { color: "white", fontSize: 18, fontWeight: "600", marginBottom: 14 },
  card: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  date: { color: "rgba(255,255,255,0.5)", fontSize: 13 },
  cost: { color: "#FFC850", fontSize: 16, fontWeight: "700" },
  cardBody: { flexDirection: "row", alignItems: "center", gap: 8 },
  stationName: { color: "white", fontSize: 14, fontWeight: "500" },
});
