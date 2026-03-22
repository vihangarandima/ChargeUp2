import React from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ChargingHistoryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#060E14", "#101922", "#15252E"]} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="white" onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Charging History</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Mock history card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.date}>Today, 10:30 AM</Text>
              <Text style={styles.cost}>$12.50</Text>
            </View>
            <View style={styles.cardBody}>
              <Ionicons name="flash" size={20} color="#5ECFDA" />
              <Text style={styles.stationName}>Downtown Fast Charger #4</Text>
            </View>
            <Text style={styles.details}>Delivered 42 kWh • 45 mins</Text>
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
  card: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  date: { color: "rgba(255,255,255,0.5)", fontSize: 13 },
  cost: { color: "#5ECFDA", fontSize: 16, fontWeight: "700" },
  cardBody: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  stationName: { color: "white", fontSize: 16, fontWeight: "600" },
  details: { color: "rgba(255,255,255,0.5)", fontSize: 13 },
});
