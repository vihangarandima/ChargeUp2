import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function MyVehicleScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#060E14", "#101922", "#15252E"]} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="white" onPress={() => router.back()} />
          <Text style={styles.headerTitle}>My Vehicle</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.content}>
          <Ionicons name="car-sport-outline" size={64} color="rgba(94,207,218,0.3)" style={{ marginBottom: 20 }} />
          <Text style={styles.title}>No Vehicle Found</Text>
          <Text style={styles.subtitle}>You haven't added an EV yet. Add one to get better charging recommendations.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },
  title: { color: "white", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", lineHeight: 22 },
});
