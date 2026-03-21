import React from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HostNotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#060E14", "#101922", "#15252E"]} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="white" onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Host Notifications</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="car-sport-outline" size={20} color="#FFC850" />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.title}>New Booking Request</Text>
              <Text style={styles.desc}>Review a new charging request from John for your Downtown Charger at 2:00 PM today.</Text>
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
  card: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,200,80,0.1)", alignItems: "center", justifyContent: "center" },
  textWrap: { flex: 1 },
  title: { color: "white", fontSize: 15, fontWeight: "600", marginBottom: 4 },
  desc: { color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 18 },
});
